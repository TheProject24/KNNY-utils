async function loadLinks() {
    const container = document.getElementById('linksList');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading links...</div>';

    try {
        const links = await apiCall(`${API_BASE}/links`);
        displayLinks(links);
        populateLinkTags(links);
    } catch (error) {
        container.innerHTML = '<div class="loading">Failed to load links</div>';
    }
}

function displayLinks(links) {
    const container = document.getElementById('linksList');

    if (links.length === 0) {
        container.innerHTML = '<div class="loading">No links found</div>';
        return;
    }

    container.innerHTML = links.map(link => `
        <div class="item-card">
            <div class="item-title">${link.title}</div>
            <div class="item-description">
                <a href="${link.url}" target="_blank" style="color: #667eea; text-decoration: none;">${link.url}</a>
            </div>
            <div style="margin: 15px 0;">
                <span class="tag">${link.tag}</span>
            </div>
            <div class="item-actions">
                <button class="btn" onclick="window.open('${link.url}', '_blank')">Open Link</button>
                <button class="btn btn-warning" onclick="editLink('${link._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteLink('${link._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function populateLinkTags(links) {
    const tagFilter = document.getElementById('linkTagFilter');
    const tags = [...new Set(links.map(link => link.tag))];

    tagFilter.innerHTML = '<option value="">All Tags</option>' +
        tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

async function addLink(event) {
    event.preventDefault();

    const form = event.target;
    const isEdit = form.dataset.editId;

    const linkData = {
        title: document.getElementById('linkTitle').value,
        url: document.getElementById('linkUrl').value,
        tag: document.getElementById('linkTag').value || 'Generic'
    };

    try {
        if (isEdit) {
            await apiCall(`${API_BASE}/links/${isEdit}`, {
                method: 'PATCH',
                body: JSON.stringify(linkData)
            });
        } else {
            await apiCall(`${API_BASE}/links`, {
                method: 'POST',
                body: JSON.stringify(linkData)
            });
        }

        // Reset form
        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Link';
        submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';

        loadLinks();
    } catch (error) {
        console.error('Failed to save link:', error);
    }
}

async function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        try {
            await apiCall(`${API_BASE}/links/${id}`, {
                method: 'DELETE'
            });
            loadLinks();
        } catch (error) {
            console.error('Failed to delete link:', error);
        }
    }
}

async function editLink(id) {
    try {
        const link = await apiCall(`${API_BASE}/links/${id}`);

        document.getElementById('linkTitle').value = link.title;
        document.getElementById('linkUrl').value = link.url;
        document.getElementById('linkTag').value = link.tag;

        const form = document.getElementById('linkForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Link';
        submitBtn.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';

        form.dataset.editId = id;
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to load link for editing:', error);
    }
}

function filterLinks() {
    const searchTerm = document.getElementById('linkSearch').value.toLowerCase();
    const tagFilter = document.getElementById('linkTagFilter').value;
    const cards = document.querySelectorAll('#linksList .item-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const tag = card.querySelector('.tag').textContent;
        const matchesSearch = text.includes(searchTerm);
        const matchesTag = !tagFilter || tag === tagFilter;

        card.style.display = matchesSearch && matchesTag ? 'block' : 'none';
    });
}