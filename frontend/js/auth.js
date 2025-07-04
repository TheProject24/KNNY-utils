let currentUser = null;

function checkAuthToken() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const base64Payload = token.split('.')[1];
            if (!base64Payload) throw new Error('Invalid token format');

            const payload = JSON.parse(atob(base64Payload));
            currentUser = payload;
            updateAuthUI();
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token');
            currentUser = null;
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
        userAvatar.textContent = currentUser.username
            ? currentUser.username.charAt(0).toUpperCase()
            : 'U';
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

// 🔐 Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    try {
        const response = await fetch('https://knny-utils-api.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);

        checkAuthToken();
        closeModal('loginModal');
        showToast('Login successful', 'success');

    } catch (error) {
        showToast('Login failed: ' + error.message, 'error');
    }
});

// 📝 Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!username || !email || !password) {
        showToast('All fields are required', 'error');
        return;
    }

    try {
        const response = await fetch('https://knny-utils-api.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        closeModal('registerModal');
        showToast('Registration successful, please login', 'success');
        showLoginModal();

    } catch (error) {
        showToast('Registration failed: ' + error.message, 'error');
    }
});

// Example of authenticated request to a protected route
async function fetchProtectedData() {
    const token = localStorage.getItem('token');

    if (!token) {
        showToast('You must be logged in', 'error');
        return;
    }

    try {
        const response = await fetch('https://knny-utils-api.onrender.com/api/assignments', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}
