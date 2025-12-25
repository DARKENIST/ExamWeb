
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('giveget_user'));
    const loginButton = document.getElementById('loginButton');
    const userDropdown = document.getElementById('userDropdown');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const logoutSection = document.getElementById('logoutSection');
    
    if (user && user.isLoggedIn) {
        if (loginButton) {
            loginButton.innerHTML = `
                     class="w-6 h-6 rounded-full mr-2 object-cover">
                <span>${user.name || 'Пользователь'}</span>
                <i class="fas fa-chevron-down ml-2 text-sm"></i>
            `;
        }
        
        if (userInfo && userName && userEmail) {
            userInfo.classList.remove('hidden');
            userName.textContent = user.name || 'Пользователь';
            userEmail.textContent = user.email || '';
        }
        
        if (logoutSection) {
            logoutSection.classList.remove('hidden');
        }
    } else {
        if (loginButton) {
            loginButton.innerHTML = `
                <i class="fas fa-sign-in-alt"></i>
                <span>Войти</span>
            `;
        }
        
        if (logoutSection) {
            logoutSection.classList.add('hidden');
        }
        
        if (userInfo) {
            userInfo.classList.add('hidden');
        }
    }
}

function setupLoginButton() {
    const loginButton = document.getElementById('loginButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            const user = JSON.parse(localStorage.getItem('giveget_user'));
            
            if (user && user.isLoggedIn) {
                const dropdown = document.getElementById('userDropdown');
                dropdown.classList.toggle('hidden');
                e.stopPropagation();
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('giveget_user');
            localStorage.removeItem('giveget_remember');
            
            updateNavigation();
            
            showLogoutMessage();
            
            document.getElementById('userDropdown').classList.add('hidden');
        });
    }
}

function showLogoutMessage() {
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-slide-in';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Вы успешно вышли из системы</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('userDropdown');
    const loginButton = document.getElementById('loginButton');
    
    if (dropdown && !dropdown.contains(event.target) && loginButton && !loginButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    setupLoginButton();
    setupLogoutButton();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
        showLoginSuccessMessage();
    }
});

function showLoginSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-slide-in';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Добро пожаловать в СдамОтдам!</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    window.history.replaceState({}, document.title, window.location.pathname);
}