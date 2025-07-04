let allSnippets = [];

async function loadSnippets() {
    try {
        const snippets = await apiRequest('/snippets');
        allSnippets = snippets;
        renderSnippets(snippets);
    } catch (error) {
        showToast('Failed to load snippets', 'error');
    }
}

function renderSnippets(snippets) {
    const container = document.getElementById('snippetsList');
    container.innerHTML = '';

    snippets.forEach(snippet => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${snippet.title}</div>
                    <div class="card-meta">
                        <span class="badge badge-success">${snippet.language}</span>
                        <span class="badge badge-warning">${snippet.tags}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-secondary" onclick="copyCode('${snippet._id}')">Copy</button>
                    <button class="btn btn-sm btn-secondary" onclick="editSnippet('${snippet._id}')">Edit</button>
                    <button class="btn btn-sm btn-error" onclick="deleteSnippet('${snippet._id}')">Delete</button>
                </div>
            </div>
            <p>${snippet.description}</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-language">${snippet.language}</span>
                </div>
                <pre><code id="code-${snippet._id}">${escapeHtml(snippet.code)}</code></pre>
            </div>
        `;
        container.appendChild(card);
    });
}

function searchSnippets() {
    const query = document.getElementById('snippetSearch').value.toLowerCase();
    const filtered = allSnippets.filter(snippet => 
        snippet.title.toLowerCase().includes(query) || 
        snippet.language.toLowerCase().includes(query) ||
        snippet.tags.toLowerCase().includes(query)
    );
    renderSnippets(filtered);
}

async function copyCode(id) {
    const codeElement = document.getElementById(`code-${id}`);
    if (codeElement) {
        try {
            await navigator.clipboard.writeText(codeElement.textContent);
            showToast('Code copied to clipboard', 'success');
        } catch (error) {
            showToast('Failed to copy code', 'error');
        }
    }
}

async function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet?')) {
        try {
            await apiRequest(`/snippets/${id}`, { method: 'DELETE' });
            showToast('Snippet deleted successfully', 'success');
            loadSnippets();
        } catch (error) {
            showToast('Failed to delete snippet', 'error');
        }
    }
}

function editSnippet(id) {
    showToast('Edit snippet feature coming soon', 'warning');
}