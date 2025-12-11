// =======================================================
// SISTEMA DE AUTENTICAÇÃO COM 2FA E GERENCIAMENTO DE SENHAS
// =======================================================

const adminUsers = {
    owner: {
        name: 'Dono do Website',
        role: 'Administrador Principal',
        permissions: ['all']
    },
    developer: {
        name: 'Desenvolvedora',
        role: 'Desenvolvedor & Suporte Técnico',
        permissions: ['all']
    }
};

let currentUser = null;
let pendingUser = null;

// =======================================================
// 🆕 CLASSE DE AUTENTICAÇÃO 2FA
// =======================================================
class TwoFactorAuth {
    constructor() {
        this.codeLength = 6;
        this.expirationTime = 5 * 60 * 1000;
        this.maxAttempts = 3;
        this.apiUrl = 'http://localhost:3000/api';
    }

    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    createSession(user, method = 'email') {
        const code = this.generateCode();
        const session = {
            code: code,
            user: user,
            method: method,
            timestamp: Date.now(),
            attempts: 0,
            maxAttempts: this.maxAttempts
        };

        localStorage.setItem('cogim_2fa_session', JSON.stringify(session));
        console.log(`🔐 Código 2FA: ${code}`);
        
        return session;
    }

    getSession() {
        const sessionData = localStorage.getItem('cogim_2fa_session');
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        
        if (Date.now() - session.timestamp > this.expirationTime) {
            this.clearSession();
            return null;
        }

        return session;
    }

    verifyCode(inputCode) {
        const session = this.getSession();
        
        if (!session) {
            return { success: false, error: 'Sessão expirada. Por favor, faça login novamente.' };
        }

        session.attempts++;
        localStorage.setItem('cogim_2fa_session', JSON.stringify(session));

        if (session.attempts > session.maxAttempts) {
            this.clearSession();
            return { 
                success: false, 
                error: 'Número máximo de tentativas excedido.',
                maxAttemptsReached: true 
            };
        }

        if (inputCode === session.code) {
            return { 
                success: true, 
                user: session.user 
            };
        }

        const remainingAttempts = session.maxAttempts - session.attempts;
        return { 
            success: false, 
            error: `Código incorreto. ${remainingAttempts} tentativa(s) restante(s).`,
            remainingAttempts: remainingAttempts
        };
    }

    clearSession() {
        localStorage.removeItem('cogim_2fa_session');
    }

    async sendCodeByEmail(email, code, userName) {
        try {
            const response = await fetch(`${this.apiUrl}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, userName })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendCodeBySMS(phone, code, userName) {
        try {
            const response = await fetch(`${this.apiUrl}/send-sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code, userName })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('❌ Erro ao enviar SMS:', error);
            return { success: false, error: error.message };
        }
    }

    async checkUserHasPassword(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/check-password/${userId}`);
            const result = await response.json();
            return result.hasPassword;
        } catch (error) {
            console.error('❌ Erro ao verificar senha:', error);
            return false;
        }
    }

    async validatePassword(userId, password) {
        try {
            const response = await fetch(`${this.apiUrl}/validate-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Erro ao validar senha:', error);
            return false;
        }
    }

    async setPassword(userId, password, savePassword) {
        try {
            const response = await fetch(`${this.apiUrl}/set-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password, savePassword })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Erro ao criar senha:', error);
            return false;
        }
    }
}

const twoFactorAuth = new TwoFactorAuth();

// =======================================================
// INICIALIZAÇÃO
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
    loadActivities();
    
    document.addEventListener('admin2FALogin', function(e) {
        const { adminType, method, email, phone } = e.detail;
        quickAdminLogin(adminType, method, email, phone);
    });
});

function checkAuthentication() {
    const savedUser = localStorage.getItem('cogim_admin_user');
    const savedAuth = localStorage.getItem('cogim_admin_auth');
    
    if (savedUser && savedAuth) {
        const user = JSON.parse(savedUser);
        const authTime = parseInt(savedAuth);
        const currentTime = new Date().getTime();
        
        if ((currentTime - authTime) < (8 * 60 * 60 * 1000)) {
            currentUser = user;
            showAdminPanel();
            return;
        }
    }
    
    showLoginModal();
}

// =======================================================
// 🆕 MODAL DE CRIAÇÃO DE SENHA
// =======================================================
function showPasswordCreationModal() {
    let modal = document.getElementById('password-creation-modal');
    if (!modal) {
        modal = createPasswordCreationModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
        document.getElementById('new-password').focus();
    }, 100);
}

function hidePasswordCreationModal() {
    const modal = document.getElementById('password-creation-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.querySelectorAll('input').forEach(input => input.value = '');
    }
}

function createPasswordCreationModal() {
    const modal = document.createElement('div');
    modal.id = 'password-creation-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-key text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Criar Senha</h2>
                <p class="text-gray-600 text-sm">Configure uma senha para facilitar futuros acessos</p>
            </div>
            
            <div class="space-y-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="new-password" 
                            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Mínimo 8 caracteres"
                            minlength="8">
                        <button type="button" onclick="togglePasswordVisibility('new-password')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="password-strength" class="mt-2 text-sm"></div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="confirm-password" 
                            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Digite a senha novamente">
                        <button type="button" onclick="togglePasswordVisibility('confirm-password')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" id="save-password-check" class="w-5 h-5 text-blue-600 rounded" checked>
                        <span class="ml-3 text-sm text-gray-700">
                            <i class="fas fa-save text-blue-500 mr-1"></i>
                            Salvar senha para próximos acessos
                        </span>
                    </label>
                    <p class="text-xs text-gray-500 mt-2 ml-8">Se desmarcado, você precisará usar 2FA sempre</p>
                </div>
            </div>
            
            <div id="password-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>
            
            <div class="space-y-3">
                <button onclick="createUserPassword()" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg">
                    <i class="fas fa-check-circle mr-2"></i>Criar Senha
                </button>
                
                <button onclick="skipPasswordCreation()" class="w-full text-gray-500 py-2 hover:text-gray-700 transition">
                    Pular (usar apenas 2FA)
                </button>
            </div>
        </div>
    `;
    
    // Event listeners para validação em tempo real
    const newPasswordInput = modal.querySelector('#new-password');
    newPasswordInput.addEventListener('input', updatePasswordStrength);
    
    return modal;
}

function updatePasswordStrength() {
    const password = document.getElementById('new-password').value;
    const strengthDiv = document.getElementById('password-strength');
    
    if (!password) {
        strengthDiv.innerHTML = '';
        return;
    }
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
    const texts = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'];
    
    strengthDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-${colors[strength - 1]}-500 transition-all" style="width: ${strength * 20}%"></div>
            </div>
            <span class="text-${colors[strength - 1]}-600 font-semibold">${texts[strength - 1]}</span>
        </div>
    `;
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

async function createUserPassword() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const savePassword = document.getElementById('save-password-check').checked;
    
    // Validações
    if (!password || password.length < 8) {
        showPasswordError('A senha deve ter no mínimo 8 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showPasswordError('As senhas não coincidem');
        return;
    }
    
    try {
        const success = await twoFactorAuth.setPassword(
            pendingUser.type,
            password,
            savePassword
        );
        
        if (success) {
            hidePasswordCreationModal();
            completeLogin();
            showNotification('✅ Senha criada com sucesso!', 'success');
            
            // Registrar atividade
            await logActivity({
                type: 'password_created',
                user: pendingUser.name,
                saved: savePassword
            });
        } else {
            showPasswordError('Erro ao criar senha. Tente novamente.');
        }
    } catch (error) {
        showPasswordError('Erro ao criar senha. Tente novamente.');
    }
}

function skipPasswordCreation() {
    hidePasswordCreationModal();
    completeLogin();
    showNotification('✅ Login realizado! Use 2FA nos próximos acessos.', 'info');
}

function showPasswordError(message) {
    const errorDiv = document.getElementById('password-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function completeLogin() {
    currentUser = pendingUser;
    localStorage.setItem('cogim_admin_user', JSON.stringify(currentUser));
    localStorage.setItem('cogim_admin_auth', new Date().getTime().toString());
    twoFactorAuth.clearSession();
    showAdminPanel();
    
    // Registrar atividade de login
    logActivity({
        type: 'successful_login',
        user: currentUser.name,
        role: currentUser.role
    });
}

// =======================================================
// VERIFICAÇÃO 2FA
// =======================================================
async function verify2FACode() {
    const inputs = document.querySelectorAll('.code-input');
    const code = Array.from(inputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
        show2FAError('Por favor, digite o código completo de 6 dígitos');
        return;
    }
    
    const result = twoFactorAuth.verifyCode(code);
    
    if (result.success) {
        hide2FAModal();
        
        // Verificar se usuário já tem senha
        const hasPassword = await twoFactorAuth.checkUserHasPassword(result.user.type);
        
        if (hasPassword) {
            completeLogin();
            showNotification('✅ Login realizado com sucesso!', 'success');
        } else {
            // Mostrar modal para criar senha
            showPasswordCreationModal();
        }
    } else {
        show2FAError(result.error);
        
        if (result.maxAttemptsReached) {
            setTimeout(() => {
                hide2FAModal();
                showLoginModal();
            }, 3000);
        } else {
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        }
    }
}

// =======================================================
// LOGIN COM SENHA (SE DISPONÍVEL)
// =======================================================
async function quickAdminLogin(adminType, method = 'sms', userEmail = '', userPhone = '') {
    if (!adminUsers[adminType]) {
        showNotification('❌ Tipo de administrador inválido', 'error');
        return;
    }
    
    pendingUser = {
        type: adminType,
        name: adminUsers[adminType].name,
        email: userEmail,
        phone: userPhone,
        role: adminUsers[adminType].role,
        permissions: adminUsers[adminType].permissions,
        twoFactorEnabled: true,
        preferred2FAMethod: method
    };
    
    // Salvar dados
    localStorage.setItem(`cogim_admin_${adminType}_email`, userEmail);
    localStorage.setItem(`cogim_admin_${adminType}_phone`, userPhone);
    
    // Verificar se tem senha salva
    const hasPassword = await twoFactorAuth.checkUserHasPassword(adminType);
    
    if (hasPassword) {
        showPasswordLoginModal();
    } else {
        hideLoginModal();
        initiate2FA(pendingUser, method);
    }
}

function showPasswordLoginModal() {
    const modal = document.getElementById('login-modal');
    const content = modal.querySelector('.bg-white');
    
    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-key text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Digite sua Senha</h2>
            <p class="text-gray-600 text-sm">${pendingUser.name}</p>
        </div>
        
        <div class="space-y-4 mb-6">
            <div class="relative">
                <input 
                    type="password" 
                    id="login-password" 
                    class="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Digite sua senha">
                <button type="button" onclick="togglePasswordVisibility('login-password')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            
            <div id="login-password-error" class="hidden p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>
        </div>
        
        <div class="space-y-3">
            <button onclick="loginWithPassword()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                <i class="fas fa-sign-in-alt mr-2"></i>Entrar
            </button>
            
            <button onclick="useCodeInstead()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                <i class="fas fa-mobile-alt mr-2"></i>Usar Código 2FA
            </button>
            
            <button onclick="backToAdminSelection()" class="w-full text-gray-500 py-2 hover:text-gray-700 transition">
                Voltar
            </button>
        </div>
    `;
    
    setTimeout(() => {
        document.getElementById('login-password').focus();
    }, 100);
}

async function loginWithPassword() {
    const password = document.getElementById('login-password').value;
    
    if (!password) {
        showLoginPasswordError('Digite sua senha');
        return;
    }
    
    const isValid = await twoFactorAuth.validatePassword(pendingUser.type, password);
    
    if (isValid) {
        hideLoginModal();
        completeLogin();
        showNotification('✅ Login realizado com sucesso!', 'success');
    } else {
        showLoginPasswordError('Senha incorreta');
        document.getElementById('login-password').value = '';
        document.getElementById('login-password').focus();
        
        // Registrar tentativa falha
        await logActivity({
            type: 'failed_login',
            user: pendingUser.name,
            method: 'password'
        });
    }
}

function showLoginPasswordError(message) {
    const errorDiv = document.getElementById('login-password-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function useCodeInstead() {
    const method = pendingUser.preferred2FAMethod || 'sms';
    initiate2FA(pendingUser, method);
    hideLoginModal();
}

function backToAdminSelection() {
    location.reload();
}

// =======================================================
// SISTEMA DE ATIVIDADES
// =======================================================
async function logActivity(activity) {
    try {
        await fetch('http://localhost:3000/api/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
    } catch (error) {
        console.error('Erro ao registrar atividade:', error);
    }
}

async function loadActivities() {
    try {
        const response = await fetch('http://localhost:3000/api/activities?limit=50');
        const data = await response.json();
        
        displayActivities(data.activities);
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

function displayActivities(activities) {
    const container = document.getElementById('recent-activity-list');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhuma atividade recente</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => {
        const icon = getActivityIcon(activity.type);
        const color = getActivityColor(activity.type);
        const time = formatTimeAgo(activity.timestamp);
        
        return `
            <div class="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition">
                <div class="w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-${icon} text-${color}-600"></i>
                </div>
                <div class="flex-1">
                    <p class="text-gray-800 font-medium">${getActivityDescription(activity)}</p>
                    <p class="text-gray-500 text-sm">${time}</p>
                </div>
            </div>
        `;
    }).join('');
}

function getActivityIcon(type) {
    const icons = {
        'successful_login': 'sign-in-alt',
        'failed_login': 'times-circle',
        'password_created': 'key',
        'sms_sent': 'mobile-alt',
        'email_sent': 'envelope',
        'logout': 'sign-out-alt',
        'page_view': 'eye',
        'contact_form': 'envelope-open',
        'gallery_view': 'images'
    };
    return icons[type] || 'circle';
}

function getActivityColor(type) {
    const colors = {
        'successful_login': 'green',
        'failed_login': 'red',
        'password_created': 'blue',
        'sms_sent': 'purple',
        'email_sent': 'blue',
        'logout': 'gray',
        'page_view': 'indigo',
        'contact_form': 'yellow',
        'gallery_view': 'pink'
    };
    return colors[type] || 'gray';
}

function getActivityDescription(activity) {
    const descriptions = {
        'successful_login': `${activity.user} fez login com sucesso`,
        'failed_login': `Tentativa de login falha - ${activity.user}`,
        'password_created': `${activity.user} criou uma senha`,
        'sms_sent': `Código SMS enviado para ${activity.user}`,
        'email_sent': `Código email enviado para ${activity.user}`,
        'logout': `${activity.user} fez logout`,
        'page_view': `Página visualizada: ${activity.page}`,
        'contact_form': `Novo contato recebido de ${activity.name}`,
        'gallery_view': `Galeria visualizada: ${activity.category}`
    };
    return descriptions[activity.type] || 'Atividade registrada';
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
    return `Há ${Math.floor(diff / 86400)} dias`;
}

// Atualizar atividades a cada minuto
setInterval(loadActivities, 60000);

// =======================================================
// OUTRAS FUNÇÕES (mantidas do código original)
// =======================================================
// [... resto do código mantém-se igual ...]

function setupEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    logActivity({
        type: 'logout',
        user: currentUser.name
    });
    
    localStorage.removeItem('cogim_admin_user');
    localStorage.removeItem('cogim_admin_auth');
    twoFactorAuth.clearSession();
    currentUser = null;
    pendingUser = null;
    showLoginModal();
    showNotification('✅ Sessão terminada com sucesso!', 'info');
}

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'flex';
}

function hideLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showAdminPanel() {
    hideLoginModal();
    hide2FAModal();
    hidePasswordCreationModal();
    document.getElementById('admin-user').textContent = currentUser.name;
    document.body.style.overflow = 'auto';
}

async function initiate2FA(user, method = 'email') {
    const session = twoFactorAuth.createSession(user, method);
    
    if (method === 'email') {
        await twoFactorAuth.sendCodeByEmail(user.email, session.code, user.name);
        showNotification(`📧 Código enviado para ${maskEmail(user.email)}`, 'info');
    } else if (method === 'sms') {
        await twoFactorAuth.sendCodeBySMS(user.phone, session.code, user.name);
        showNotification(`📱 Código enviado via SMS`, 'info');
    }
    
    show2FAModal(method);
}

function maskEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
}

function maskPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 8) return phone;
    return phone.replace(/(\d{3})\d{5}(\d{4})/, '$1*****$2');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full shadow-lg`;
    
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500');
            break;
        case 'error':
            notification.classList.add('bg-red-500');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500');
            break;
        default:
            notification.classList.add('bg-blue-500');
    }
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">