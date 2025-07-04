let currentUser = null;

// Check and validate JWT token
function checkAuthToken() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const base64Payload = token.split('.')[1];
            if (!base64Payload) throw new Error('Invalid token format');

            const payload = JSON.parse(atob(base64Payload));
            const now = Math.floor(Date.now() / 1000);

            // Check if token is expired
            if (payload.exp && payload.exp < now) {
                throw new Error('Token expired');
            }

            currentUser = payload;
            updateAuthUI();
        } catch (error) {
            console.error('Invalid or expired token:', error);
            localStorage.removeItem('token');
            currentUser = null;
            updateAuthUI();
            showToast('Session expired, please log in again', 'error');
        }
    } else {
        currentUser = null;
        updateAuthUI();
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (currentUser && currentUser.username) {
        userInfo.style.display = 'flex';
        loginBtn.style.display = 'none';
        userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        userName.textContent = currentUser.username;
    } else {
        userInfo.style.display = 'none';
        loginBtn.style.display = 'block';
        userAvatar.textContent = '';
        userName.textContent = '';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    // Reload current section to refresh data
    const activeSection = document.querySelector('.section.active').id;
    showSection(activeSection);
}

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        localStorage.setItem('token', data.token);
        checkAuthToken();
        closeModal('loginModal');
        showToast('Login successful', 'success');
        // Reload current section
        const activeSection = document.querySelector('.section.active').id;
        showSection(activeSection);
    } catch (error) {
        let message = 'Login failed';
        if (error.message.includes('Invalid credentials') || error.message.includes('Incorrect password')) {
            message = 'Invalid email or password';
        } else if (error.message.includes('Network Error')) {
            message = 'Unable to connect to server';
        }
        showToast(`${message}: ${error.message}`, 'error');
    }
});

// Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !email || !password) {
        showToast('All fields are required', 'error');
        return;
    }

    // Basic client-side validation
    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        closeModal('registerModal');
        showToast('Registration successful, please login', 'success');
        showLoginModal();
    } catch (error) {
        let message = 'Registration failed';
        if (error.message.includes('Username already exists')) {
            message = 'Username is already taken';
        } else if (error.message.includes('Email already exists')) {
            message = 'Email is already registered';
        } else if (error.message.includes('Network Error')) {
            message = 'Unable to connect to server';
        }
        showToast(`${message}: ${error.message}`, 'error');
    }
});