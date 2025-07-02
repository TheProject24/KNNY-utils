async function loadLectures() {
    const container = document.getElementById('lecturesList');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading lectures...</div>';

    try {
        const lectures = await apiCall(`${API_BASE}/lectures`);
        displayLectures(lectures);
    } catch (error) {
        container.innerHTML = '<div class="loading">Failed to load lectures</div>';
    }
}

function displayLectures(lectures) {
    const container = document.getElementById('lecturesList');

    if (lectures.length === 0) {
        container.innerHTML = '<div class="loading">No lectures found</div>';
        return;
    }

    container.innerHTML = lectures.map(lecture => `
        <div class="item-card">
            <div class="item-title">${lecture.title}</div>
            <div class="item-meta">Created: ${new Date(lecture.createdAt).toLocaleDateString()}</div>
            <div class="item-description">${lecture.description}</div>
            ${lecture.files && lecture.files.length > 0 ? `
                <div style="margin: 15px 0;">
                    <strong>Files:</strong>
                    ${lecture.files.map(file => `<span class="tag">${file}</span>`).join(' ')}
                </div>
            ` : ''}
            <div class="item-actions">
                <button class="btn btn-warning" onclick="editLecture('${lecture._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteLecture('${lecture._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function addLecture(event) {
    event.preventDefault();

    const form = event.target;
    const isEdit = form.dataset.editId;

    const lectureData = {
        title: document.getElementById('lectureTitle').value,
        description: document.getElementById('lectureDescription').value
    };

    try {
        if (isEdit) {
            await apiCall(`${API_BASE}/lectures/${isEdit}`, {
                method: 'PATCH',
                body: JSON.stringify(lectureData)
            });
        } else {
            await apiCall(`${API_BASE}/lectures`, {
                method: 'POST',
                body: JSON.stringify(lectureData)
            });
        }

        // Reset form
        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Lecture';
        submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';

        loadLectures();
    } catch (error) {
        console.error('Failed to save lecture:', error);
    }
}

async function deleteLecture(id) {
    if (confirm('Are you sure you want to delete this lecture?')) {
        try {
            await apiCall(`${API_BASE}/lectures/${id}`, {
                method: 'DELETE'
            });
            loadLectures();
        } catch (error) {
            console.error('Failed to delete lecture:', error);
        }
    }
}

async function editLecture(id) {
    try {
        const lecture = await apiCall(`${API_BASE}/lectures/${id}`);

        document.getElementById('lectureTitle').value = lecture.title;
        document.getElementById('lectureDescription').value = lecture.description;

        const form = document.getElementById('lectureForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Lecture';
        submitBtn.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';

        form.dataset.editId = id;
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to load lecture for editing:', error);
    }
}

function filterLectures() {
    const searchTerm = document.getElementById('lectureSearch').value.toLowerCase();
    const cards = document.querySelectorAll('#lecturesList .item-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}