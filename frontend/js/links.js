let allLinks = [];

async function loadLinks() {
    try {
        const links = await apiRequest('/links');
        allLinks = links;
        renderLinks(links);
    } catch (error) {
        showToast('Failed to load links', 'error');
    }
}

function renderLinks(links) {
    const container = document.getElementById('linksList');
    container.innerHTML = '';

    links.forEach(link => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${link.title}</div>
                    <div class="card-meta">
                        <span class="badge badge-success">${link.tag}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editLink('${link._id}')">Edit</button>
                    <button class="btn btn-sm btn-error" onclick="deleteLink('${link._id}')">Delete</button>
                </div>
            </div>
            <a href="${link.url}" target="_blank" class="btn btn-sm" style="width: 100%; margin-top: 1rem;">Visit Link</a>
        `;
        container.appendChild(card);
    });
}

function searchLinks() {
    const query = document.getElementById('linkSearch').value.toLowerCase();
    const filtered = allLinks.filter(link => 
        link.title.toLowerCase().includes(query) || 
        link.tag.toLowerCase().includes(query)
    );
    renderLinks(filtered);
}

async function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        try {
            await apiRequest(`/links/${id}`, { method: 'DELETE' });
            showToast('Link deleted successfully', 'success');
            loadLinks();
        } catch (error) {
            showToast('Failed to delete link', 'error');
        }
    }
}

function editLink(id) {
    showToast('Edit link feature coming soon', 'warning');
}