let currentUser = null;

function checkAuthToken() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = payload;
            updateAuthUI();
        } catch (error) {
            localStorage.removeItem('token');
        }
    }
}

function updateAuthUI() {
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (currentUser) {
        userInfo.style.display = 'flex';
        loginBtn.style.display = 'none';
        userAvatar.textContent = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
        userName.textContent = currentUser.username || 'User';
    } else {
        userInfo.style.display = 'none';
        loginBtn.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI();
    showToast('Logged out successfully', 'success');
}

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        localStorage.setItem('token', response.token);
        checkAuthToken();
        closeModal('loginModal');
        showToast('Login successful', 'success');
    } catch (error) {
        showToast('Login failed: ' + error.message, 'error');
    }
});

// Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        closeModal('registerModal');
        showToast('Registration successful, please login', 'success');
        showLoginModal();
    } catch (error) {
        showToast('Registration failed: ' + error.message, 'error');
    }
});