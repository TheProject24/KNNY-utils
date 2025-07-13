const API_BASE = 'https://knny-utils-api.onrender.com/api';
let currentSection = 'assignments';

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupForms();
    loadAssignments();
    loadLectures();
    loadLinks();
    loadSnippets();
});

// Navigation
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    currentSection = section;
}

// Form setup
function setupForms() {
    document.getElementById('assignmentForm').addEventListener('submit', handleAssignmentSubmit);
    document.getElementById('lectureForm').addEventListener('submit', handleLectureSubmit);
    document.getElementById('linkForm').addEventListener('submit', handleLinkSubmit);
    document.getElementById('snippetForm').addEventListener('submit', handleSnippetSubmit);
    document.getElementById('tagFilter').addEventListener('change', handleTagFilter);
}

// API helpers
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showError('Request failed. Please try again.');
        throw error;
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.insertBefore(successDiv, document.body.firstChild);
    setTimeout(() => successDiv.remove(), 3000);
}