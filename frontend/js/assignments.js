async function loadAssignments() {
    const container = document.getElementById('assignmentsList');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading assignments...</div>';

    try {
        const assignments = await apiCall(`${API_BASE}/assignments`);
        displayAssignments(assignments);
    } catch (error) {
        container.innerHTML = '<div class="loading">Failed to load assignments</div>';
    }
}

function displayAssignments(assignments) {
    const container = document.getElementById('assignmentsList');

    if (assignments.length === 0) {
        container.innerHTML = '<div class="loading">No assignments found</div>';
        return;
    }

    container.innerHTML = assignments.map(assignment => {
        const overdue = !assignment.submitted && isOverdue(assignment.dueDate);
        return `
            <div class="item-card" style="border-left-color: ${overdue ? '#e53e3e' : assignment.submitted ? '#38a169' : '#667eea'}">
                <div class="item-title">${assignment.course}</div>
                <div class="item-meta">
                    Due: ${formatDate(assignment.dueDate)}
                    ${overdue ? '<span style="color: #e53e3e; font-weight: bold;">⚠️ OVERDUE</span>' : ''}
                    <span class="status-badge ${assignment.submitted ? 'status-submitted' : 'status-pending'}">
                        ${assignment.submitted ? 'Submitted' : 'Pending'}
                    </span>
                </div>
                <div class="item-description">${assignment.instruction}</div>
                <div class="item-actions">
                    ${!assignment.submitted ? `<button class="btn btn-success" onclick="submitAssignment('${assignment._id}')">Mark as Submitted</button>` : ''}
                    <button class="btn btn-warning" onclick="editAssignment('${assignment._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteAssignment('${assignment._id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function addAssignment(event) {
    event.preventDefault();

    const form = event.target;
    const isEdit = form.dataset.editId;

    const assignmentData = {
        course: document.getElementById('assignmentCourse').value,
        instruction: document.getElementById('assignmentInstruction').value,
        dueDate: document.getElementById('assignmentDueDate').value
    };

    try {
        if (isEdit) {
            await apiCall(`${API_BASE}/assignments/${isEdit}`, {
                method: 'PATCH',
                body: JSON.stringify(assignmentData)
            });
        } else {
            await apiCall(`${API_BASE}/assignments`, {
                method: 'POST',
                body: JSON.stringify(assignmentData)
            });
        }

        // Reset form
        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add Assignment';
        submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';

        loadAssignments();
    } catch (error) {
        console.error('Failed to save assignment:', error);
    }
}

async function submitAssignment(id) {
    try {
        await apiCall(`${API_BASE}/assignments/${id}/submit`, {
            method: 'PATCH'
        });
        loadAssignments();
    } catch (error) {
        console.error('Failed to submit assignment:', error);
    }
}

async function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        try {
            await apiCall(`${API_BASE}/assignments/${id}`, {
                method: 'DELETE'
            });
            loadAssignments();
        } catch (error) {
            console.error('Failed to delete assignment:', error);
        }
    }
}

async function editAssignment(id) {
    try {
        const assignment = await apiCall(`${API_BASE}/assignments/${id}`);

        // Populate form with existing data
        document.getElementById('assignmentCourse').value = assignment.course;
        document.getElementById('assignmentInstruction').value = assignment.instruction;
        document.getElementById('assignmentDueDate').value = new Date(assignment.dueDate).toISOString().slice(0, 16);

        // Change form behavior to update instead of create
        const form = document.getElementById('assignmentForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Assignment';
        submitBtn.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';

        // Store the ID for update
        form.dataset.editId = id;

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to load assignment for editing:', error);
    }
}

function filterAssignments() {
    const searchTerm = document.getElementById('assignmentSearch').value.toLowerCase();
    const filterValue = document.getElementById('assignmentFilter').value;
    const cards = document.querySelectorAll('#assignmentsList .item-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const isSubmitted = card.querySelector('.status-submitted') !== null;
        const matchesSearch = text.includes(searchTerm);
        const matchesFilter = !filterValue ||
            (filterValue === 'submitted' && isSubmitted) ||
            (filterValue === 'pending' && !isSubmitted);

        card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}