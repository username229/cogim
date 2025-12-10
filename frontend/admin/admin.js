// =======================================================
// SISTEMA DE AUTENTICAÇÃO COM 2FA (Two-Factor Authentication)
// =======================================================

// Configurações de autenticação - APENAS ROLES
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

// Estado atual do utilizador
let currentUser = null;
let pendingUser = null; // Utilizador aguardando 2FA

// =======================================================
// 🆕 GERADOR DE CÓDIGOS 2FA
// =======================================================
class TwoFactorAuth {
    constructor() {
        this.codeLength = 6;
        this.expirationTime = 5 * 60 * 1000; // 5 minutos
        this.maxAttempts = 3;
    }

    // Gerar código de 6 dígitos
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Criar sessão 2FA
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
        console.log(`🔐 Código 2FA gerado: ${code} (válido por 5 minutos)`);
        console.log(`📋 Método: ${method}`);
        console.log(`👤 Usuário: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`📱 Telefone: ${user.phone}`);
        
        return session;
    }

    // Obter sessão ativa
    getSession() {
        const sessionData = localStorage.getItem('cogim_2fa_session');
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        
        // Verificar se expirou
        if (Date.now() - session.timestamp > this.expirationTime) {
            this.clearSession();
            return null;
        }

        return session;
    }

    // Verificar código
    verifyCode(inputCode) {
        const session = this.getSession();
        
        if (!session) {
            return { success: false, error: 'Sessão expirada. Por favor, faça login novamente.' };
        }

        // Incrementar tentativas
        session.attempts++;
        localStorage.setItem('cogim_2fa_session', JSON.stringify(session));

        // Verificar número de tentativas
        if (session.attempts > session.maxAttempts) {
            this.clearSession();
            return { 
                success: false, 
                error: 'Número máximo de tentativas excedido. Por favor, faça login novamente.',
                maxAttemptsReached: true 
            };
        }

        // Verificar código
        if (inputCode === session.code) {
            return { 
                success: true, 
                user: session.user 
            };
        }

        const remainingAttempts = session.maxAttempts - session.attempts;
        return { 
            success: false, 
            error: `Código incorreto. ${remainingAttempts} tentativa${remainingAttempts !== 1 ? 's' : ''} restante${remainingAttempts !== 1 ? 's' : ''}.`,
            remainingAttempts: remainingAttempts
        };
    }

    // Limpar sessão
    clearSession() {
        localStorage.removeItem('cogim_2fa_session');
    }

    // Enviar código por email (REAL COM BACKEND)
    async sendCodeByEmail(email, code, userName) {
        console.log(`📧 ========================================`);
        console.log(`📧 ENVIANDO CÓDIGO 2FA POR EMAIL`);
        console.log(`📧 ========================================`);
        console.log(`👤 Nome: ${userName}`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔐 Código: ${code}`);
        console.log(`⏰ Válido por: 5 minutos`);
        console.log(`📧 ========================================`);
        
        try {
            // Fazer chamada ao backend
            const response = await fetch('http://localhost:3000/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                    userName: userName
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Email enviado com sucesso via backend');
                return { success: true };
            } else {
                console.error('❌ Erro ao enviar email:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            // Em caso de erro, simular envio
            console.log('⚠️ Usando modo simulado (backend indisponível)');
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('✅ Email enviado com sucesso (simulado)');
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    // Enviar código por SMS (REAL COM BACKEND)
    async sendCodeBySMS(phone, code, userName) {
        console.log(`📱 ========================================`);
        console.log(`📱 ENVIANDO CÓDIGO 2FA POR SMS`);
        console.log(`📱 ========================================`);
        console.log(`👤 Nome: ${userName}`);
        console.log(`📱 Telefone: ${phone}`);
        console.log(`🔐 Código: ${code}`);
        console.log(`⏰ Válido por: 5 minutos`);
        console.log(`📱 ========================================`);
        
        try {
            // Fazer chamada ao backend
            const response = await fetch('http://localhost:3000/api/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    code: code,
                    userName: userName
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ SMS enviado com sucesso via backend');
                console.log(`📱 Message SID: ${result.messageSid}`);
                return { success: true };
            } else {
                console.error('❌ Erro ao enviar SMS:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            // Em caso de erro, simular envio
            console.log('⚠️ Usando modo simulado (backend indisponível)');
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('✅ SMS enviado com sucesso (simulado)');
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    // Gerar código QR para autenticador (Google Authenticator, Authy, etc.)
    generateAuthenticatorQR(user) {
        const secret = this.generateSecret();
        const otpauth = `otpauth://totp/Cogim:${user.email}?secret=${secret}&issuer=Cogim`;
        
        console.log(`📲 ========================================`);
        console.log(`📲 CÓDIGO PARA AUTENTICADOR`);
        console.log(`📲 ========================================`);
        console.log(`👤 Nome: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Secret: ${secret}`);
        console.log(`📲 QR Code URL: ${otpauth}`);
        console.log(`📲 ========================================`);
        
        return {
            secret: secret,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
        };
    }

    generateSecret() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 32; i++) {
            secret += chars[Math.floor(Math.random() * chars.length)];
        }
        return secret;
    }
}

const twoFactorAuth = new TwoFactorAuth();

// =======================================================
// INICIALIZAÇÃO DO PAINEL
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
    loadDashboardData();
    
    // Listener para o sistema de 2FA com input de dados
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
        
        // Sessão válida por 8 horas
        if ((currentTime - authTime) < (8 * 60 * 60 * 1000)) {
            currentUser = user;
            showAdminPanel();
            return;
        }
    }
    
    showLoginModal();
}

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'flex';
    
    // Pré-preencher dados salvos se existirem
    setTimeout(() => {
        const savedOwnerEmail = localStorage.getItem('cogim_admin_owner_email');
        const savedOwnerPhone = localStorage.getItem('cogim_admin_owner_phone');
        const savedDevEmail = localStorage.getItem('cogim_admin_developer_email');
        const savedDevPhone = localStorage.getItem('cogim_admin_developer_phone');
        
        // Configurar listener para auto-preencher
        if (savedOwnerEmail || savedDevEmail) {
            document.querySelectorAll('[data-admin]').forEach(btn => {
                const originalListener = btn.onclick;
                btn.addEventListener('click', function() {
                    const adminType = this.getAttribute('data-admin');
                    const emailInput = document.getElementById('admin-email');
                    const phoneInput = document.getElementById('admin-phone');
                    
                    setTimeout(() => {
                        if (adminType === 'owner' && savedOwnerEmail) {
                            emailInput.value = savedOwnerEmail;
                            phoneInput.value = savedOwnerPhone || '';
                        } else if (adminType === 'developer' && savedDevEmail) {
                            emailInput.value = savedDevEmail;
                            phoneInput.value = savedDevPhone || '';
                        }
                    }, 100);
                });
            });
        }
    }, 100);
}

function hideLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showAdminPanel() {
    hideLoginModal();
    hide2FAModal();
    document.getElementById('admin-user').textContent = currentUser.name;
    document.body.style.overflow = 'auto';
}

// =======================================================
// 🆕 MODAL DE 2FA
// =======================================================
function show2FAModal(method = 'email') {
    // Criar modal se não existir
    let modal = document.getElementById('2fa-modal');
    if (!modal) {
        modal = create2FAModal();
        document.body.appendChild(modal);
    }
    
    // Atualizar conteúdo baseado no método
    const title = modal.querySelector('.modal-title');
    const description = modal.querySelector('.modal-description');
    const methodInfo = modal.querySelector('.method-info');
    
    if (method === 'email') {
        title.textContent = 'Verificação de Email';
        description.textContent = `Enviámos um código de 6 dígitos para ${maskEmail(pendingUser.email)}`;
        methodInfo.innerHTML = '<i class="fas fa-envelope text-blue-500 text-2xl"></i>';
    } else if (method === 'sms') {
        title.textContent = 'Verificação por SMS';
        description.textContent = `Enviámos um código de 6 dígitos para ${maskPhone(pendingUser.phone)}`;
        methodInfo.innerHTML = '<i class="fas fa-mobile-alt text-green-500 text-2xl"></i>';
    } else if (method === 'authenticator') {
        title.textContent = 'Autenticador';
        description.textContent = 'Digite o código do seu aplicativo autenticador';
        methodInfo.innerHTML = '<i class="fas fa-shield-alt text-purple-500 text-2xl"></i>';
    }
    
    modal.style.display = 'flex';
    
    // Focar no primeiro input
    setTimeout(() => {
        const firstInput = modal.querySelector('.code-input');
        if (firstInput) firstInput.focus();
    }, 100);
    
    // Iniciar contador de tempo
    startCodeTimer();
}

function hide2FAModal() {
    const modal = document.getElementById('2fa-modal');
    if (modal) {
        modal.style.display = 'none';
        // Limpar inputs
        modal.querySelectorAll('.code-input').forEach(input => input.value = '');
    }
}

function create2FAModal() {
    const modal = document.createElement('div');
    modal.id = '2fa-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <!-- Cabeçalho -->
            <div class="text-center mb-6">
                <div class="method-info mb-4">
                    <i class="fas fa-envelope text-blue-500 text-2xl"></i>
                </div>
                <h2 class="modal-title text-2xl font-bold text-gray-800 mb-2">
                    Verificação de Email
                </h2>
                <p class="modal-description text-gray-600 text-sm">
                    Enviámos um código de 6 dígitos para o seu email
                </p>
            </div>
            
            <!-- Inputs de código -->
            <div class="flex justify-center gap-2 mb-6">
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="0">
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="1">
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="2">
                <span class="flex items-center text-2xl text-gray-400">-</span>
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="3">
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="4">
                <input type="text" maxlength="1" class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" data-index="5">
            </div>
            
            <!-- Mensagem de erro -->
            <div id="2fa-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            </div>
            
            <!-- Timer -->
            <div class="text-center mb-6">
                <p class="text-sm text-gray-600">
                    Código válido por: <span id="code-timer" class="font-bold text-blue-600">5:00</span>
                </p>
            </div>
            
            <!-- Botões -->
            <div class="space-y-3">
                <button onclick="verify2FACode()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                    <i class="fas fa-check-circle mr-2"></i>Verificar Código
                </button>
                
                <button onclick="resend2FACode()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                    <i class="fas fa-redo mr-2"></i>Reenviar Código
                </button>
                
                <button onclick="cancel2FA()" class="w-full text-gray-500 py-2 hover:text-gray-700 transition">
                    Cancelar
                </button>
            </div>
            
            <!-- Métodos alternativos -->
            <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-center text-sm text-gray-600 mb-3">Usar outro método:</p>
                <div class="flex justify-center gap-3">
                    <button onclick="change2FAMethod('email')" class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition" title="Email">
                        <i class="fas fa-envelope text-gray-600"></i>
                    </button>
                    <button onclick="change2FAMethod('sms')" class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition" title="SMS">
                        <i class="fas fa-mobile-alt text-gray-600"></i>
                    </button>
                    <button onclick="change2FAMethod('authenticator')" class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition" title="Autenticador">
                        <i class="fas fa-shield-alt text-gray-600"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners para os inputs
    setupCodeInputs(modal);
    
    return modal;
}

function setupCodeInputs(container) {
    const inputs = container.querySelectorAll('.code-input');
    
    inputs.forEach((input, index) => {
        // Auto-avançar para próximo input
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Aceitar apenas números
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            if (value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            // Auto-verificar quando todos preenchidos
            if (index === inputs.length - 1 && value.length === 1) {
                const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
                if (allFilled) {
                    setTimeout(() => verify2FACode(), 500);
                }
            }
        });
        
        // Backspace volta para input anterior
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        // Colar código completo
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            
            pastedData.split('').forEach((char, i) => {
                if (inputs[i]) {
                    inputs[i].value = char;
                }
            });
            
            if (pastedData.length === 6) {
                setTimeout(() => verify2FACode(), 500);
            }
        });
    });
}

// =======================================================
// 🆕 FUNÇÕES DE 2FA
// =======================================================
function verify2FACode() {
    const inputs = document.querySelectorAll('.code-input');
    const code = Array.from(inputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
        show2FAError('Por favor, digite o código completo de 6 dígitos');
        return;
    }
    
    const result = twoFactorAuth.verifyCode(code);
    
    if (result.success) {
        // Login bem-sucedido!
        currentUser = result.user;
        
        // Salvar sessão
        localStorage.setItem('cogim_admin_user', JSON.stringify(currentUser));
        localStorage.setItem('cogim_admin_auth', new Date().getTime().toString());
        
        // Limpar sessão 2FA
        twoFactorAuth.clearSession();
        
        showAdminPanel();
        showNotification('✅ Login realizado com sucesso!', 'success');
    } else {
        show2FAError(result.error);
        
        if (result.maxAttemptsReached) {
            setTimeout(() => {
                hide2FAModal();
                showLoginModal();
            }, 3000);
        } else {
            // Limpar inputs
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
            
            // Adicionar shake animation
            const modal = document.getElementById('2fa-modal');
            modal.querySelector('.bg-white').classList.add('shake');
            setTimeout(() => {
                modal.querySelector('.bg-white').classList.remove('shake');
            }, 500);
        }
    }
}

function show2FAError(message) {
    const errorDiv = document.getElementById('2fa-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function resend2FACode() {
    if (!pendingUser) return;
    
    const session = twoFactorAuth.getSession();
    const method = session ? session.method : 'email';
    
    initiate2FA(pendingUser, method);
    showNotification('📧 Novo código enviado!', 'info');
}

function cancel2FA() {
    twoFactorAuth.clearSession();
    pendingUser = null;
    hide2FAModal();
    showLoginModal();
}

function change2FAMethod(method) {
    if (!pendingUser) return;
    
    initiate2FA(pendingUser, method);
}

let timerInterval;

function startCodeTimer() {
    clearInterval(timerInterval);
    
    const session = twoFactorAuth.getSession();
    if (!session) return;
    
    const endTime = session.timestamp + twoFactorAuth.expirationTime;
    
    timerInterval = setInterval(() => {
        const remaining = endTime - Date.now();
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            show2FAError('Código expirado. Por favor, solicite um novo código.');
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const timerElement = document.getElementById('code-timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Mudar cor quando tempo estiver acabando
            if (remaining < 60000) {
                timerElement.classList.add('text-red-600');
                timerElement.classList.remove('text-blue-600');
            }
        }
    }, 1000);
}

// =======================================================
// FUNÇÕES DE AUTENTICAÇÃO - APENAS 2FA COM INPUT
// =======================================================
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function quickAdminLogin(adminType, method = 'sms', userEmail = '', userPhone = '') {
    if (!adminUsers[adminType]) {
        showNotification('❌ Tipo de administrador inválido', 'error');
        return;
    }
    
    // Validar que os dados foram fornecidos
    if (!userEmail || !userPhone) {
        showNotification('❌ Por favor, preencha email e telefone', 'error');
        return;
    }
    
    // Criar perfil do usuário com os dados fornecidos
    pendingUser = {
        type: adminType,
        name: adminUsers[adminType].name,
        email: userEmail, // Email digitado pelo usuário
        phone: userPhone, // Telefone digitado pelo usuário
        role: adminUsers[adminType].role,
        permissions: adminUsers[adminType].permissions,
        twoFactorEnabled: true,
        preferred2FAMethod: method
    };
    
    // Salvar dados do usuário para próximos acessos
    localStorage.setItem(`cogim_admin_${adminType}_email`, userEmail);
    localStorage.setItem(`cogim_admin_${adminType}_phone`, userPhone);
    
    console.log(`🎯 Iniciando autenticação 2FA para ${pendingUser.name}`);
    
    // Sempre usar 2FA
    hideLoginModal();
    initiate2FA(pendingUser, method);
}

// =======================================================
// 🆕 INICIAR PROCESSO 2FA
// =======================================================
async function initiate2FA(user, method = 'email') {
    const session = twoFactorAuth.createSession(user, method);
    
    // Enviar código baseado no método escolhido
    if (method === 'email') {
        await twoFactorAuth.sendCodeByEmail(user.email, session.code, user.name);
        showNotification(`📧 Código enviado para ${maskEmail(user.email)}`, 'info');
    } else if (method === 'sms') {
        if (!user.phone) {
            showNotification('❌ Número de telefone não configurado', 'error');
            return;
        }
        await twoFactorAuth.sendCodeBySMS(user.phone, session.code, user.name);
        showNotification(`📱 Código enviado via SMS para ${maskPhone(user.phone)}`, 'info');
    } else if (method === 'authenticator') {
        // Gerar QR code para autenticador
        twoFactorAuth.generateAuthenticatorQR(user);
        showNotification('🔐 Digite o código do seu autenticador', 'info');
    }
    
    show2FAModal(method);
}

// =======================================================
// FUNÇÕES AUXILIARES
// =======================================================
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

function handleLogout() {
    localStorage.removeItem('cogim_admin_user');
    localStorage.removeItem('cogim_admin_auth');
    twoFactorAuth.clearSession();
    currentUser = null;
    pendingUser = null;
    showLoginModal();
    showNotification('✅ Sessão terminada com sucesso!', 'info');
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
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// =======================================================
// FUNÇÕES DO DASHBOARD
// =======================================================
function loadDashboardData() {
    updateUserStats();
    loadRecentActivity();
}

function updateUserStats() {
    const totalUsers = Object.keys(adminUsers).length;
    const activeUsers = totalUsers;
    
    const totalUsersEl = document.getElementById('total-users');
    const activeUsersEl = document.getElementById('active-users');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (activeUsersEl) activeUsersEl.textContent = activeUsers;
}

function loadRecentActivity() {
    // Carregar atividade recente
    // Implementar conforme necessário
}

// =======================================================
// CSS ADICIONAL PARA ANIMAÇÕES
// =======================================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.5s;
    }
    
    .code-input {
        transition: all 0.2s ease;
    }
    
    .code-input:focus {
        transform: scale(1.05);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .code-input.error {
        border-color: #ef4444;
        animation: shake 0.3s;
    }
    
    #2fa-modal {
        backdrop-filter: blur(5px);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    #2fa-modal > div {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// =======================================================
// EXPORTAR FUNÇÕES GLOBAIS
// =======================================================
window.verify2FACode = verify2FACode;
window.resend2FACode = resend2FACode;
window.cancel2FA = cancel2FA;
window.change2FAMethod = change2FAMethod;

console.log('✅ Sistema de Autenticação 2FA inicializado com sucesso!');
console.log('📋 Sistema pronto para uso');
console.log('👉 Selecione Proprietário ou Desenvolvedora para começar');