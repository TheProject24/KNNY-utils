async function loadLinks() {
    try {
        const links = await apiRequest('/links');
        renderLinks(links);
        updateTagFilter(links);
    } catch (error) {
        document.getElementById('linksList').innerHTML = '<div class="error-message">Failed to load links</div>';
    }
}

function renderLinks(links) {
    const container = document.getElementById('linksList');

    if (links.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No links yet</h3><p>Add your first link above</p></div>';
        return;
    }

    container.innerHTML = links.map(link => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <div class="item-title">
                        <a href="${link.url}" target="_blank" style="text-decoration: none; color: inherit;">${link.title}</a>
                    </div>
                    <div class="item-meta">${link.url}</div>
                </div>
                <div class="item-actions">
                    <span class="badge badge-info">${link.tag}</span>
                    <button class="btn btn-secondary btn-sm" onclick="editLink('${link._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLink('${link._id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateTagFilter(links) {
    const tags = [...new Set(links.map(link => link.tag))];
    const select = document.getElementById('tagFilter');
    select.innerHTML = '<option value="">All Tags</option>' +
        tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

async function handleLinkSubmit(e) {
    e.preventDefault();

    const data = {
        title: document.getElementById('linkTitle').value,
        url: document.getElementById('linkUrl').value,
        tag: document.getElementById('linkTag').value || 'Generic'
    };

    try {
        await apiRequest('/links', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        showSuccess('Link added successfully!');
        document.getElementById('linkForm').reset();
        loadLinks();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function handleTagFilter(e) {
    const tag = e.target.value;

    if (tag) {
        try {
            const links = await apiRequest(`/links/tag/${tag}`);
            renderLinks(links);
        } catch (error) {
            renderLinks([]);
        }
    } else {
        loadLinks();
    }
}

async function deleteLink(id) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
        await apiRequest(`/links/${id}`, {
            method: 'DELETE'
        });

        showSuccess('Link deleted successfully!');
        loadLinks();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function editLink(id) {
    try {
        const link = await apiRequest(`/links/${id}`);
        openEditModal('link', link);
    } catch (error) {
        // Error already handled in apiRequest
    }
}