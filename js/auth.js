const API_BASE = 'api/';

function getToken() {
    return localStorage.getItem('flordosol-token');
}

function getUser() {
    const data = localStorage.getItem('flordosol-user');
    return data ? JSON.parse(data) : null;
}

async function login(email, senha) {
    const res = await fetch(API_BASE + 'usuarios/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao fazer login');
    localStorage.setItem('flordosol-token', data.token);
    localStorage.setItem('flordosol-user', JSON.stringify(data.usuario));
    return data.usuario;
}

async function cadastrar(nome, email, senha) {
    const res = await fetch(API_BASE + 'usuarios/cadastrar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao cadastrar');
    return data;
}

function logout() {
    localStorage.removeItem('flordosol-token');
    localStorage.removeItem('flordosol-user');
    fecharLogin();
    updateAuthUI();
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

function updateAuthUI() {
    const user = getUser();
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');

    if (loginBtn && userMenu) {
        if (user) {
            loginBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            if (userName) userName.textContent = user.nome.split(' ')[0];
        } else {
            loginBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }
}

document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('user-dropdown');
    const menu = document.getElementById('user-menu');
    if (dropdown && menu && !menu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

window.getToken = getToken;
window.getUser = getUser;
window.login = login;
window.cadastrar = cadastrar;
window.logout = logout;
window.toggleUserMenu = toggleUserMenu;
window.updateAuthUI = updateAuthUI;
