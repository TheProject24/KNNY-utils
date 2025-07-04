async function loadAssignments() {
    try {
        const assignments = await apiRequest('/assignments');
        renderAssignments(assignments);
    } catch (error) {
        showToast('Failed to load assignments', 'error');
    }
}

function renderAssignments(assignments) {
    const container = document.getElementById('assignmentsList');
    container.innerHTML = '';

    assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const isOverdue = dueDate < new Date() && !assignment.submitted;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${assignment.course}</div>
                    <div class="card-meta">Due: ${dueDate.toLocaleDateString()}</div>
                </div>
                <div class="card-actions">
                    ${assignment.submitted ? 
                        '<span class="badge badge-success">Submitted</span>' : 
                        (isOverdue ? '<span class="badge badge-error">Overdue</span>' : '<span class="badge badge-warning">Pending</span>')
                    }
                    ${!assignment.submitted && currentUser && currentUser.role === 'student' ? 
                        `<button class="btn btn-sm btn-success" onclick="submitAssignment('${assignment._id}')">Submit</button>` : 
                        ''
                    }
                    <button class="btn btn-sm btn-secondary" onclick="editAssignment('${assignment._id}')">Edit</button>
                    <button class="btn btn-sm btn-error" onclick="deleteAssignment('${assignment._id}')">Delete</button>
                </div>
            </div>
            <p>${assignment.instruction}</p>
        `;
        container.appendChild(card);
    });
}

async function submitAssignment(id) {
    try {
        await apiRequest(`/assignments/${id}/submit`, { method: 'PATCH' });
        showToast('Assignment submitted successfully', 'success');
        loadAssignments();
    } catch (error) {
        showToast('Failed to submit assignment', 'error');
    }
}

async function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        try {
            await apiRequest(`/assignments/${id}`, { method: 'DELETE' });
            showToast('Assignment deleted successfully', 'success');
            loadAssignments();
        } catch (error) {
            showToast('Failed to delete assignment', 'error');
        }
    }
}

function editAssignment(id) {
    showToast('Edit assignment feature coming soon', 'warning');
}