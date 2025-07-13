async function loadSnippets() {
    try {
        const snippets = await apiRequest('/snippets');
        renderSnippets(snippets);
    } catch (error) {
        document.getElementById('snippetsList').innerHTML = '<div class="error-message">Failed to load snippets</div>';
    }
}

function renderSnippets(snippets) {
    const container = document.getElementById('snippetsList');

    if (snippets.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No snippets yet</h3><p>Create your first snippet above</p></div>';
        return;
    }

    container.innerHTML = snippets.map(snippet => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <div class="item-title">${snippet.title}</div>
                    <div class="item-meta">Language: ${snippet.language}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editSnippet('${snippet._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSnippet('${snippet._id}')">Delete</button>
                </div>
            </div>
            ${snippet.description ? `<p style="margin-bottom: 12px;">${snippet.description}</p>` : ''}
            <div class="code-block">${snippet.code}</div>
            ${snippet.tags ? `<div style="margin-top: 12px;"><span class="badge badge-info">${snippet.tags}</span></div>` : ''}
        </div>
    `).join('');
}

async function handleSnippetSubmit(e) {
    e.preventDefault();

    const data = {
        title: document.getElementById('snippetTitle').value,
        language: document.getElementById('snippetLanguage').value,
        code: document.getElementById('snippetCode').value,
        tags: document.getElementById('snippetTags').value,
        description: document.getElementById('snippetDescription').value
    };

    try {
        await apiRequest('/snippets', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        showSuccess('Snippet created successfully!');
        document.getElementById('snippetForm').reset();
        loadSnippets();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function deleteSnippet(id) {
    if (!confirm('Are you sure you want to delete this snippet?')) return;

    try {
        await apiRequest(`/snippets/${id}`, {
            method: 'DELETE'
        });

        showSuccess('Snippet deleted successfully!');
        loadSnippets();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function editSnippet(id) {
    try {
        const snippet = await apiRequest(`/snippets/${id}`);
        openEditModal('snippet', snippet);
    } catch (error) {
        // Error already handled in apiRequest
    }
}