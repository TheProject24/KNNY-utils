function setupSearchAndFilter() {
    // Assignment search and filter
    document.getElementById('assignmentSearch').addEventListener('input', filterAssignments);
    document.getElementById('assignmentFilter').addEventListener('change', filterAssignments);

    // Lecture search
    document.getElementById('lectureSearch').addEventListener('input', filterLectures);

    // Link search
    document.getElementById('linkSearch').addEventListener('input', filterLinks);
    document.getElementById('linkTagFilter').addEventListener('change', filterLinks);

    // Snippet search
    document.getElementById('snippetSearch').addEventListener('input', filterSnippets);
}

document.addEventListener('DOMContentLoaded', function () {
    // Form event listeners
    document.getElementById('assignmentForm').addEventListener('submit', addAssignment);
    document.getElementById('lectureForm').addEventListener('submit', addLecture);
    document.getElementById('linkForm').addEventListener('submit', addLink);
    document.getElementById('snippetForm').addEventListener('submit', addSnippet);

    // Setup search and filter functionality
    setupSearchAndFilter();

    // Load initial data
    loadAssignments();

    // Enhanced error handling
    window.addEventListener('unhandledrejection', function (event) {
        console.error('Unhandled promise rejection:', event.reason);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '4') {
            event.preventDefault();
            const tabs = ['assignments', 'lectures', 'links', 'snippets'];
            const tabIndex = parseInt(event.key) - 1;
            if (tabs[tabIndex]) {
                showTab(tabs[tabIndex]);
                document.querySelector(`button[onclick="showTab('${tabs[tabIndex]}')"]`).click();
            }
        }
    });

    // Auto-refresh data every 5 minutes
    setInterval(() => {
        const activeTab = document.querySelector('.tab-content.active').id;
        loadData(activeTab);
    }, 300000); // 5 minutes

    console.log('KNNY Utils Frontend loaded successfully!');
});