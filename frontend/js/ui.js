function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');

    // Load section data
    switch(sectionName) {
        case 'assignments':
            loadAssignments();
            break;
        case 'lectures':
            loadLectures();
            break;
        case 'links':
            loadLinks();
            break;
        case 'snippets':
            loadSnippets();
            break;
    }
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showLoginModal() {
    closeModal('registerModal');
    showModal('loginModal');
}

function showRegisterModal() {
    closeModal('loginModal');
    showModal('registerModal');
}

function showAddAssignmentModal() {
    showModal('addAssignmentModal');
}

function showAddLectureModal() {
    showModal('addLectureModal');
}

function showAddLinkModal() {
    showModal('addLinkModal');
}

function showAddSnippetModal() {
    showModal('addSnippetModal');
}