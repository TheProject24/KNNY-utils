let currentEditId = null;
let currentEditType = null;

function openEditModal(type, item) {
    currentEditType = type;
    currentEditId = item._id;

    const modal = document.getElementById('editModal');
    const content = document.getElementById('editModalContent');

    let formHTML = '';

    switch (type) {
        case 'assignment':
            formHTML = `
                <form id="editForm">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Course</label>
                            <input type="text" class="form-input" id="editCourse" value="${item.course}" required>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Due Date</label>
                            <input type="datetime-local" class="form-input" id="editDueDate" value="${item.dueDate.slice(0, 16)}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Instructions</label>
                        <textarea class="form-textarea" id="editInstruction" required>${item.instruction}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="editSubmitted" ${item.submitted ? 'checked' : ''}>
                            Mark as submitted
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Assignment</button>
                </form>
            `;
            break;
        case 'lecture':
            formHTML = `
                <form id="editForm">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" id="editTitle" value="${item.title}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" id="editDescription" required>${item.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Files (one per line)</label>
                        <textarea class="form-textarea" id="editFiles">${item.files ? item.files.join('\n') : ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Lecture</button>
                </form>
            `;
            break;
        case 'link':
            formHTML = `
                <form id="editForm">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-input" id="editTitle" value="${item.title}" required>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Tag</label>
                            <input type="text" class="form-input" id="editTag" value="${item.tag}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">URL</label>
                        <input type="url" class="form-input" id="editUrl" value="${item.url}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Link</button>
                </form>
            `;
            break;
        case 'snippet':
            formHTML = `
                <form id="editForm">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-input" id="editTitle" value="${item.title}" required>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Language</label>
                            <input type="text" class="form-input" id="editLanguage" value="${item.language}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Code</label>
                        <textarea class="form-textarea" id="editCode" required style="font-family: monospace; min-height: 120px;">${item.code}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Tags</label>
                            <input type="text" class="form-input" id="editTags" value="${item.tags || ''}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Description</label>
                            <input type="text" class="form-input" id="editDescription" value="${item.description || ''}">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Snippet</button>
                </form>
            `;
            break;
    }

    content.innerHTML = formHTML;
    modal.classList.add('active');

    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditType = null;
    currentEditId = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();

    let data = {};
    let endpoint = '';

    switch (currentEditType) {
        case 'assignment':
            data = {
                course: document.getElementById('editCourse').value,
                instruction: document.getElementById('editInstruction').value,
                dueDate: document.getElementById('editDueDate').value,
                submitted: document.getElementById('editSubmitted').checked
            };
            endpoint = `/assignments/${currentEditId}`;
            break;
        case 'lecture':
            const files = document.getElementById('editFiles').value
                .split('\n')
                .filter(file => file.trim())
                .map(file => file.trim());
            data = {
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDescription').value,
                files: files.length > 0 ? files : []
            };
            endpoint = `/lectures/${currentEditId}`;
            break;
        case 'link':
            data = {
                title: document.getElementById('editTitle').value,
                url: document.getElementById('editUrl').value,
                tag: document.getElementById('editTag').value
            };
            endpoint = `/links/${currentEditId}`;
            break;
        case 'snippet':
            data = {
                title: document.getElementById('editTitle').value,
                language: document.getElementById('editLanguage').value,
                code: document.getElementById('editCode').value,
                tags: document.getElementById('editTags').value,
                description: document.getElementById('editDescription').value
            };
            endpoint = `/snippets/${currentEditId}`;
            break;
    }

    try {
        await apiRequest(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });

        showSuccess(`${currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1)} updated successfully!`);
        closeModal();

        switch (currentEditType) {
            case 'assignment':
                loadAssignments();
                break;
            case 'lecture':
                loadLectures();
                break;
            case 'link':
                loadLinks();
                break;
            case 'snippet':
                loadSnippets();
                break;
        }
    } catch (error) {
        // Error already handled in apiRequest
    }
}

// Close modal when clicking outside
document.getElementById('editModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});