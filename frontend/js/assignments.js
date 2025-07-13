async function loadAssignments() {
    try {
        const assignments = await apiRequest('/assignments');
        renderAssignments(assignments);
    } catch (error) {
        document.getElementById('assignmentsList').innerHTML = '<div class="error-message">Failed to load assignments</div>';
    }
}

function renderAssignments(assignments) {
    const container = document.getElementById('assignmentsList');

    if (assignments.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No assignments yet</h3><p>Create your first assignment above</p></div>';
        return;
    }

    container.innerHTML = assignments.map(assignment => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <div class="item-title">${assignment.course}</div>
                    <div class="item-meta">Due: ${new Date(assignment.dueDate).toLocaleDateString()}</div>
                </div>
                <div class="item-actions">
                    <span class="badge ${assignment.submitted ? 'badge-success' : 'badge-warning'}">
                        ${assignment.submitted ? 'Submitted' : 'Pending'}
                    </span>
                    ${!assignment.submitted ? `<button class="btn btn-success btn-sm" onclick="submitAssignment('${assignment._id}')">Submit</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="editAssignment('${assignment._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAssignment('${assignment._id}')">Delete</button>
                </div>
            </div>
            <p style="margin-bottom: 8px;">${assignment.instruction}</p>
            <div class="item-meta">Created: ${new Date(assignment.createdAt).toLocaleDateString()}</div>
        </div>
    `).join('');
}

async function handleAssignmentSubmit(e) {
    e.preventDefault();

    const data = {
        course: document.getElementById('assignmentCourse').value,
        instruction: document.getElementById('assignmentInstruction').value,
        dueDate: document.getElementById('assignmentDueDate').value
    };

    try {
        await apiRequest('/assignments', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        showSuccess('Assignment created successfully!');
        document.getElementById('assignmentForm').reset();
        loadAssignments();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function submitAssignment(id) {
    try {
        await apiRequest(`/assignments/${id}/submit`, {
            method: 'PATCH'
        });

        showSuccess('Assignment submitted successfully!');
        loadAssignments();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function deleteAssignment(id) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
        await apiRequest(`/assignments/${id}`, {
            method: 'DELETE'
        });

        showSuccess('Assignment deleted successfully!');
        loadAssignments();
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function editAssignment(id) {
    try {
        const assignment = await apiRequest(`/assignments/${id}`);
        openEditModal('assignment', assignment);
    } catch (error) {
        // Error already handled in apiRequest
    }
}