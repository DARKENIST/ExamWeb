
async function handleRegistration(formData) {

    const existingUsers = JSON.parse(localStorage.getItem('giveget_users') || '[]');
    
    if (existingUsers.some(user => user.email === formData.email)) {
        return {
            success: false,
            message: 'Пользователь с таким email уже существует'
        };
    }
    
    const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        artworks: 0,
        followers: 0,
        likes: 0
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('giveget_users', JSON.stringify(existingUsers));
    
    saveUserToStorage({
        ...newUser,
        token: 'user_token_' + Date.now(),
        isLoggedIn: true
    });
    
    return {
        success: true,
        user: newUser
    };
}

function isUsernameAvailable(username) {
    const users = JSON.parse(localStorage.getItem('giveget_users') || '[]');
    return !users.some(user => user.username === username);
}

function isEmailAvailable(email) {
    const users = JSON.parse(localStorage.getItem('giveget_users') || '[]');
    return !users.some(user => user.email === email);
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(message, type = 'error') {
    const container = document.getElementById('messageContainer');
    container.className = `p-4 rounded-lg ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
    container.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    container.classList.remove('hidden');
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    const inputElement = document.getElementById(fieldId);
    inputElement.classList.add('border-red-500');
    inputElement.classList.remove('border-gray-300');
}

function hideFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.classList.add('hidden');
    
    const inputElement = document.getElementById(fieldId);
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
}

function saveUserToStorage(userData) {
    localStorage.setItem('giveget_user', JSON.stringify(userData));
}

function getUserFromStorage() {
    const userData = localStorage.getItem('giveget_user');
    return userData ? JSON.parse(userData) : null;
}

function logout() {
    localStorage.removeItem('giveget_user');
    localStorage.removeItem('giveget_remember');
    window.location.href = 'index.html';
}

function checkAuth() {
    const user = getUserFromStorage();
    return user !== null;
}

function getCurrentUser() {
    return getUserFromStorage();
}

function simulateServerRequest(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.email === 'demo@giveget.com' && data.password === 'demo123') {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        email: data.email,
                        name: 'Демо Пользователь',
                        avatar: '',
                        role: 'client',
                        joinDate: '2025-12-25'
                    },
                    token: 'demo_token_123456'
                });
            } else {
                reject({
                    success: false,
                    message: 'Неверный email или пароль'
                });
            }
        }, 1500);
    });
}

async function handleLogin(event) {
    event.preventDefault();
    
    hideFieldError('email');
    hideFieldError('password');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    let isValid = true;
    
    if (!email) {
        showFieldError('email', 'Email обязателен');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError('email', 'Введите корректный email');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('password', 'Пароль обязателен');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'Пароль должен быть не менее 6 символов');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Вход...';
    submitSpinner.classList.remove('hidden');
    
    try {
        const response = await simulateServerRequest({ email, password });
        
        if (response.success) {
            saveUserToStorage({
                ...response.user,
                token: response.token,
                isLoggedIn: true,
                rememberMe: rememberMe
            });
            
            if (rememberMe) {
                localStorage.setItem('giveget_remember', 'true');
            } else {
                localStorage.removeItem('giveget_remember');
            }
            
            showMessage('Вход выполнен успешно! Перенаправление...', 'success');
            
            setTimeout(() => {
                window.location.href = 'personalcabinet.html';
            }, 1500);
            
        } else {
            showMessage(response.message || 'Ошибка входа');
            submitBtn.disabled = false;
            submitText.textContent = 'Войти';
            submitSpinner.classList.add('hidden');
        }
        
    } catch (error) {
        showMessage(error.message || 'Ошибка соединения с сервером');
        submitBtn.disabled = false;
        submitText.textContent = 'Войти';
        submitSpinner.classList.add('hidden');
    }
}

function checkRememberedUser() {
    const remember = localStorage.getItem('giveget_remember');
    const user = getUserFromStorage();
    
    if (remember === 'true' && user) {
        document.getElementById('email').value = user.email;
        document.getElementById('rememberMe').checked = true;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Проверить сохраненного пользователя
    checkRememberedUser();
    
    // Добавить обработчики для валидации в реальном времени
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value.trim()) {
                hideFieldError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value) {
                hideFieldError('password');
            }
        });
    }
    
    // Enter для отправки формы
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && loginForm) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' && activeElement.type !== 'submit') {
                event.preventDefault();
                handleLogin(event);
            }
        }
    });
});