function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Load data for the selected tab
    loadData(tabName);
}

function loadData(tabName) {
    switch (tabName) {
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