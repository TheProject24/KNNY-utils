async function loadLectures() {
    try {
        const lectures = await apiRequest('/lectures');
        renderLectures(lectures);
    } catch (error) {
        showToast('Failed to load lectures', 'error');
    }
}

function renderLectures(lectures) {
    const container = document.getElementById('lecturesList');
    container.innerHTML = '';

    lectures.forEach(lecture => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${lecture.title}</div>
                    <div class="card-meta">${new Date(lecture.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editLecture('${lecture._id}')">Edit</button>
                    <button class="btn btn-sm btn-error" onclick="deleteLecture('${lecture._id}')">Delete</button>
                </div>
            </div>
            <p>${lecture.description}</p>
            ${lecture.files.length > 0 ? `
                <div style="margin-top: 1rem;">
                    <strong>Files:</strong>
                    <div class="file-list">
                        ${lecture.files.map(file => `
                            <div class="file-item">
                                <span>${file.split('/').pop()}</span>
                                <a href="${API_BASE_URL.replace('/api', '')}/${file}" target="_blank" class="btn btn-sm">Download</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        container.appendChild(card);
    });
}

async function deleteLecture(id) {
    if (confirm('Are you sure you want to delete this lecture?')) {
        try {
            await apiRequest(`/lectures/${id}`, { method: 'DELETE' });
            showToast('Lecture deleted successfully', 'success');
            loadLectures();
        } catch (error) {
            showToast('Failed to delete lecture', 'error');
        }
    }
}

function editLecture(id) {
    showToast('Edit lecture feature coming soon', 'warning');
}