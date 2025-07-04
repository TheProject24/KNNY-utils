document.addEventListener('DOMContentLoaded', function() {
    checkAuthToken();
    loadAssignments();
    setupEventListeners();
});

function setupEventListeners() {
    // Add Assignment Form
    document.getElementById('addAssignmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const course = document.getElementById('assignmentCourse').value;
        const instruction = document.getElementById('assignmentInstruction').value;
        const dueDate = document.getElementById('assignmentDueDate').value;

        try {
            await apiRequest('/assignments', {
                method: 'POST',
                body: JSON.stringify({ course, instruction, dueDate })
            });
            
            closeModal('addAssignmentModal');
            showToast('Assignment added successfully', 'success');
            loadAssignments();
            e.target.reset();
        } catch (error) {
            showToast('Failed to add assignment: ' + error.message, 'error');
        }
    });

    // Add Lecture Form
    document.getElementById('addLectureForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('lectureTitle').value;
        const description = document.getElementById('lectureDescription').value;
        const files = document.getElementById('lectureFiles').files;

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            for (let file of files) {
                formData.append('files', file);
            }

            await fetch(`${API_BASE_URL}/lectures`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            
            closeModal('addLectureModal');
            showToast('Lecture added successfully', 'success');
            loadLectures();
            e.target.reset();
            document.getElementById('lectureFileList').innerHTML = '';
        } catch (error) {
            showToast('Failed to add lecture: ' + error.message, 'error');
        }
    });

    // Add Link Form
    document.getElementById('addLinkForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('linkTitle').value;
        const url = document.getElementById('linkUrl').value;
        const tag = document.getElementById('linkTag').value || 'Generic';

        try {
            await apiRequest('/links', {
                method: 'POST',
                body: JSON.stringify({ title, url, tag })
            });
            
            closeModal('addLinkModal');
            showToast('Link added successfully', 'success');
            loadLinks();
            e.target.reset();
        } catch (error) {
            showToast('Failed to add link: ' + error.message, 'error');
        }
    });

    // Add Snippet Form
    document.getElementById('addSnippetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('snippetTitle').value;
        const language = document.getElementById('snippetLanguage').value;
        const code = document.getElementById('snippetCode').value;
        const tags = document.getElementById('snippetTags').value || 'Random';
        const description = document.getElementById('snippetDescription').value || 'No Description';

        try {
            await apiRequest('/snippets', {
                method: 'POST',
                body: JSON.stringify({ title, language, code, tags, description })
            });
            
            closeModal('addSnippetModal');
            showToast('Snippet added successfully', 'success');
            loadSnippets();
            e.target.reset();
        } catch (error) {
            showToast('Failed to add snippet: ' + error.message, 'error');
        }
    });

    // File Upload Preview
    document.getElementById('lectureFiles').addEventListener('change', function(e) {
        const fileList = document.getElementById('lectureFileList');
        fileList.innerHTML = '';
        
        Array.from(e.target.files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;
            fileList.appendChild(fileItem);
        });
    });

    // Close Modals on Outside Click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}