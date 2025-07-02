async function loadSnippets() {
    const container = document.getElementById('snippetsList');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading snippets...</div>';

    try {
        const snippets = await apiCall(`${API_BASE}/snippets`);
        displaySnippets(snippets);
    } catch (error) {
        container.innerHTML = '<div class="loading">Failed to load snippets</div>';
    }
}

function displaySnippets(snippets) {
    const container = document.getElementById('snippetsList');

    if (snippets.length === 0) {
        container.innerHTML = '<div class="loading">No snippets found</div>';
        return;
    }

    container.innerHTML = snippets.map(snippet => `
        <div class="item-card">
            <div class="item-title">${snippet.title}</div>
            <div class="item-meta">
                <span class="tag">${snippet.language}</span>
                <span class="tag">${snippet.tags}</span>
            </div>
            <div class="item-description">${snippet.description}</div>
            <pre><code>${snippet.code}</code></pre>
            <div class="item-actions">
                <button class="btn" onclick="copyToClipboard(\`${snippet.code.replace(/`/g, '\\`')}\`)">Copy Code</button>
                <button class="btn btn-danger" onclick="deleteSnippet('${snippet._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function addSnippet(event) {
    event.preventDefault();

    const snippetData = {
        title: document.getElementById('snippetTitle').value || 'Code Snippet',
        language: document.getElementById('snippetLanguage').value,
        code: document.getElementById('snippetCode').value,
        tags: document.getElementById('snippetTags').value || 'Random',
        description: document.getElementById('snippetDescription').value || 'No Description'
    };

    try {
        await apiCall(`${API_BASE}/snippets`, {
            method: 'POST',
            body: JSON.stringify(snippetData)
        });

        document.getElementById('snippetForm').reset();
        loadSnippets();
    } catch (error) {
        console.error('Failed to add snippet:', error);
    }
}

async function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet?')) {
        try {
            await apiCall(`${API_BASE}/snippets/${id}`, {
                method: 'DELETE'
            });
            loadSnippets();
        } catch (error) {
            console.error('Failed to delete snippet:', error);
        }
    }
}

function filterSnippets() {
    const searchTerm = document.getElementById('snippetSearch').value.toLowerCase();
    const cards = document.querySelectorAll('#snippetsList .item-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Code copied to clipboard!');
    });
}