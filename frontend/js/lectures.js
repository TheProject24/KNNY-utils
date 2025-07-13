async function loadLectures() {
    try {
        const lectures = await apiRequest('/lectures');
        renderLectures(lectures);
    } catch (error) {
        document.getElementById('lecturesList').innerHTML = '<div class="error-message">Failed to load lectures</div>';
    }
}

function renderLectures(lectures) {
    const container = document.getElementById('lecturesList');

    if (lectures.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No lectures yet</h3><p>Create your first lecture above</p></div>';
        return;
    }

    container.innerHTML = lectures.map(lecture => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <div class="item-title">${lecture.title}</div>
                    <div class="item-meta">Created: ${new Date(lecture.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editLecture('${lecture._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLecture('${lecture._id}')">Delete</button>
                </div>
            </div>
            <p style="margin-bottom: 8px;">${lecture.description}</p>
            ${lecture.files && lecture.files.length > 0 ? `
                <div style="margin-top: 12px;">
                    <strong>Files:</strong>
                    <ul style="margin-left: 20px; margin-top: 4px;">
                        ${lecture.files.map(file => `<li>${file}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function handleLectureSubmit(e) {
    e.preventDefault();

    const files = document.getElementById('lectureFiles').value
        .split('\n')
        .filter(file => file.trim())
        .map(file => file.trim());

    const data = {
        title: document.getElementById('lectureTitle').value,
        description: document.getElementById('lectureDescription').value,
        files: files.length > 0 ? files : undefined
    };

    try {
        await apiRequest('/lectures', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        showSuccess('Lecture created successfully!');
        document.getElementById('lectureForm').reset();
        loadLectures();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function deleteLecture(id) {
    if (!confirm('Are you sure you want to delete this lecture?')) return;

    try {
        await apiRequest(`/lectures/${id}`, {
            method: 'DELETE'
        });

        showSuccess('Lecture deleted successfully!');
        loadLectures();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function editLecture(id) {
    try {
        const lecture = await apiRequest(`/lectures/${id}`);
        openEditModal('lecture', lecture);
    } catch (error) {
        // Error already handled in apiRequest
    }
}