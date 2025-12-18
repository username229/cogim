// =======================================================
// SISTEMA DE AUTENTICAÇÃO 2FA
// =======================================================

class TwoFactorAuth {
    constructor() {
        this.codeLength = 6;
        this.expirationTime = 5 * 60 * 1000; // 5 minutos
        this.maxAttempts = 3;
        this.apiUrl = 'http://localhost:3000/api';
    }

    // Gerar código aleatório de 6 dígitos
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
        console.log(`🔐 Código 2FA Gerado: ${code}`);
        console.log(`📋 Método: ${method.toUpperCase()}`);
        console.log(`👤 Usuário: ${user.name}`);
        
        return session;
    }

    // Obter sessão atual
    getSession() {
        const sessionData = localStorage.getItem('cogim_2fa_session');
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        
        // Verificar expiração
        if (Date.now() - session.timestamp > this.expirationTime) {
            this.clearSession();
            return null;
        }

        return session;
    }

    // Verificar código 2FA
    verifyCode(inputCode) {
        const session = this.getSession();
        
        if (!session) {
            return { 
                success: false, 
                error: 'Sessão expirada. Por favor, faça login novamente.' 
            };
        }

        session.attempts++;
        localStorage.setItem('cogim_2fa_session', JSON.stringify(session));

        // Verificar tentativas máximas
        if (session.attempts > session.maxAttempts) {
            this.clearSession();
            return { 
                success: false, 
                error: 'Número máximo de tentativas excedido.',
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
            error: `Código incorreto. ${remainingAttempts} tentativa(s) restante(s).`,
            remainingAttempts: remainingAttempts
        };
    }

    // Limpar sessão
    clearSession() {
        localStorage.removeItem('cogim_2fa_session');
    }

    // Enviar código por email
    async sendCodeByEmail(email, code, userName) {
        try {
            console.log(`📧 Enviando email para: ${email}`);
            console.log(`🔑 Código: ${code}`);
            
            const response = await fetch(`${this.apiUrl}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, userName })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Email enviado com sucesso!');
            } else {
                console.error('❌ Erro ao enviar email:', result.error);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            // Simular sucesso em desenvolvimento
            return { 
                success: true, 
                message: 'Código enviado (modo desenvolvimento)' 
            };
        }
    }

    // Enviar código por SMS
    async sendCodeBySMS(phone, code, userName) {
        try {
            console.log(`📱 Enviando SMS para: ${phone}`);
            console.log(`🔑 Código: ${code}`);
            
            const response = await fetch(`${this.apiUrl}/send-sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code, userName })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ SMS enviado com sucesso!');
            } else {
                console.error('❌ Erro ao enviar SMS:', result.error);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Erro ao enviar SMS:', error);
            // Simular sucesso em desenvolvimento
            return { 
                success: true, 
                message: 'Código enviado (modo desenvolvimento)' 
            };
        }
    }

    // Verificar se usuário tem senha
    async checkUserHasPassword(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/check-password/${userId}`);
            const result = await response.json();
            return result.hasPassword;
        } catch (error) {
            console.error('❌ Erro ao verificar senha:', error);
            // Em desenvolvimento, assumir que não tem senha
            return false;
        }
    }

    // Validar senha do usuário
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
            // Em desenvolvimento, simular validação
            const savedPassword = localStorage.getItem(`cogim_admin_${userId}_password`);
            return savedPassword === password;
        }
    }

    // Criar/salvar senha do usuário
    async setPassword(userId, password, savePassword) {
        try {
            const response = await fetch(`${this.apiUrl}/set-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password, savePassword })
            });

            const result = await response.json();
            
            if (result.success && savePassword) {
                // Salvar localmente também (modo desenvolvimento)
                localStorage.setItem(`cogim_admin_${userId}_password`, password);
                localStorage.setItem(`cogim_admin_${userId}_has_password`, 'true');
            }
            
            return result.success;
        } catch (error) {
            console.error('❌ Erro ao criar senha:', error);
            // Em desenvolvimento, salvar localmente
            if (savePassword) {
                localStorage.setItem(`cogim_admin_${userId}_password`, password);
                localStorage.setItem(`cogim_admin_${userId}_has_password`, 'true');
            }
            return true;
        }
    }
}

// =======================================================
// FUNÇÕES DE INTERFACE 2FA
// =======================================================

function show2FAModal(method) {
    let modal = document.getElementById('2fa-modal');
    
    if (!modal) {
        modal = create2FAModal();
        document.body.appendChild(modal);
    }
    
    update2FAModalContent(method);
    modal.style.display = 'flex';
    
    // Focar no primeiro input
    setTimeout(() => {
        const firstInput = modal.querySelector('.code-input');
        if (firstInput) firstInput.focus();
    }, 100);
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
        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Verificação 2FA</h2>
                <p id="2fa-method-description" class="text-gray-600"></p>
            </div>

            <div class="space-y-6 mb-6">
                <!-- Inputs de código -->
                <div class="flex justify-center gap-2">
                    ${Array(6).fill(0).map((_, i) => `
                        <input 
                            type="text" 
                            maxlength="1" 
                            class="code-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            data-index="${i}">
                    `).join('')}
                </div>
                
                <!-- Mensagem de erro -->
                <div id="2fa-error" class="hidden p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center"></div>
                
                <!-- Info sobre código -->
                <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p class="text-sm text-blue-800 text-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        <strong>Código no Console:</strong> Verifique o console do navegador (F12) para ver o código gerado
                    </p>
                </div>
            </div>

            <div class="space-y-3">
                <button onclick="verify2FACode()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                    <i class="fas fa-check-circle mr-2"></i>Verificar Código
                </button>
                
                <button onclick="resend2FACode()" class="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                    <i class="fas fa-redo mr-2"></i>Reenviar Código
                </button>
                
                <button onclick="cancel2FA()" class="w-full text-gray-500 py-2 hover:text-gray-700 transition">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    // Configurar navegação entre inputs
    setupCodeInputs(modal);
    
    return modal;
}

function update2FAModalContent(method) {
    const session = window.twoFactorAuth?.getSession();
    if (!session) return;
    
    const descriptions = {
        'email': `Digite o código de 6 dígitos enviado para ${maskEmail(session.user.email)}`,
        'sms': `Digite o código de 6 dígitos enviado via SMS para ${maskPhone(session.user.phone)}`
    };
    
    const descEl = document.getElementById('2fa-method-description');
    if (descEl) {
        descEl.textContent = descriptions[method] || 'Digite o código de 6 dígitos';
    }
}

function setupCodeInputs(modal) {
    const inputs = modal.querySelectorAll('.code-input');
    
    inputs.forEach((input, index) => {
        // Auto-avançar para o próximo input
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            if (value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            // Limpar erro quando digitar
            hide2FAError();
            
            // Auto-verificar quando preencher todos
            if (index === inputs.length - 1 && value.length === 1) {
                const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
                if (allFilled) {
                    setTimeout(() => verify2FACode(), 300);
                }
            }
        });
        
        // Backspace para voltar
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        // Colar código
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
            
            if (pastedData.length === 6) {
                pastedData.split('').forEach((digit, i) => {
                    if (inputs[i]) inputs[i].value = digit;
                });
                inputs[5].focus();
                setTimeout(() => verify2FACode(), 300);
            }
        });
    });
}

function show2FAError(message) {
    const errorDiv = document.getElementById('2fa-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

function hide2FAError() {
    const errorDiv = document.getElementById('2fa-error');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function resend2FACode() {
    const session = window.twoFactorAuth?.getSession();
    if (!session) {
        showNotification('❌ Sessão expirada. Faça login novamente.', 'error');
        cancel2FA();
        return;
    }
    
    // Reenviar código
    if (window.initiate2FA) {
        window.initiate2FA(session.user, session.method);
        showNotification('✅ Código reenviado!', 'success');
    }
}

function cancel2FA() {
    hide2FAModal();
    if (window.showLoginModal) {
        window.showLoginModal();
    } else {
        location.reload();
    }
}

// Funções auxiliares
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

// Exportar instância global
if (typeof window !== 'undefined') {
    window.TwoFactorAuth = TwoFactorAuth;
    window.twoFactorAuth = new TwoFactorAuth();
    window.show2FAModal = show2FAModal;
    window.hide2FAModal = hide2FAModal;
    window.show2FAError = show2FAError;
    window.hide2FAError = hide2FAError;
    window.resend2FACode = resend2FACode;
    window.cancel2FA = cancel2FA;
}

console.log('✅ Sistema 2FA carregado com sucesso!');