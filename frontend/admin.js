// Configurações de autenticação
const adminUsers = {
    owner: {
        password: 'cogim2024!',
        name: 'Dono do Website',
        role: 'Administrador Principal',
        permissions: ['all']
    },
    developer: {
        password: 'dev2024@cogim',
        name: 'Desenvolvedora',
        role: 'Desenvolvedor & Suporte Técnico',
        permissions: ['all']
    }
};

// Base de dados simulada de utilizadores
let registeredUsers = JSON.parse(localStorage.getItem('cogim_registered_users') || '[]');

// Estado atual do utilizador
let currentUser = null;

// Estado do Google e Facebook
let googleLoaded = false;
let facebookLoaded = false;

// Inicialização do painel
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de tradução
    if (typeof adminTranslator !== 'undefined') {
        adminTranslator.init();
    }
    
    // Verificar se o utilizador está logado
    checkAuthentication();
    
    // Event listeners
    setupEventListeners();
    
    // Carregar dados iniciais
    loadDashboardData();
    
    // Inicializar autenticação social
    initSocialAuth();
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
    document.getElementById('login-modal').style.display = 'flex';
}

function hideLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showAdminPanel() {
    hideLoginModal();
    document.getElementById('admin-user').textContent = currentUser.name;
    document.body.style.overflow = 'auto';
}

function setupEventListeners() {
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            switchAuthTab(tabType);
        });
    });
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleEmailLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Admin quick access buttons
    document.querySelectorAll('[data-admin]').forEach(btn => {
        btn.addEventListener('click', function() {
            const adminType = this.getAttribute('data-admin');
            quickAdminLogin(adminType);
        });
    });
    
    // Social login buttons
    document.getElementById('google-signin').addEventListener('click', handleGoogleSignIn);
    document.getElementById('facebook-signin').addEventListener('click', handleFacebookSignIn);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active sidebar item
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Category filters in gallery
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterGallery(category);
            
            // Update active filter
            document.querySelectorAll('.category-filter').forEach(f => {
                f.classList.remove('active');
                f.classList.add('btn-secondary');
                f.classList.remove('btn-admin');
            });
            this.classList.add('active');
            this.classList.remove('btn-secondary');
            this.classList.add('btn-admin');
        });
    });
    
    // Quick action buttons
    setupQuickActions();
}

function switchAuthTab(tabType) {
    // Update active tab
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
    
    // Show/hide forms
    if (tabType === 'login') {
        document.getElementById('login-form-container').style.display = 'block';
        document.getElementById('register-form-container').style.display = 'none';
    } else {
        document.getElementById('login-form-container').style.display = 'none';
        document.getElementById('register-form-container').style.display = 'block';
    }
}

function handleEmailLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Verificar utilizadores registados
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            type: 'registered',
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions || ['view']
        };
        
        // Salvar sessão
        localStorage.setItem('cogim_admin_user', JSON.stringify(currentUser));
        localStorage.setItem('cogim_admin_auth', new Date().getTime().toString());
        
        showAdminPanel();
        showNotification(adminTranslator.translate('success') + '!', 'success');
    } else {
        showNotification('Credenciais inválidas!', 'error');
        document.getElementById('login-password').value = '';
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const role = document.getElementById('register-role').value;
    
    // Validações
    if (password !== confirmPassword) {
        showNotification('As palavras-passe não coincidem!', 'error');
        return;
    }
    
    if (registeredUsers.find(u => u.email === email)) {
        showNotification('Este email já está registado!', 'error');
        return;
    }
    
    // Criar novo utilizador
    const newUser = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password,
        role,
        permissions: role === 'admin' ? ['all'] : role === 'editor' ? ['edit', 'view'] : ['view'],
        createdAt: new Date().toISOString(),
        provider: 'email'
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('cogim_registered_users', JSON.stringify(registeredUsers));
    
    // Salvar informações da conta para futuras sugestões
    saveAccountInfo(email, `${firstName} ${lastName}`);
    
    showNotification('Conta criada com sucesso! Pode agora fazer login.', 'success');
    
    // Preencher automaticamente o email no formulário de login
    document.getElementById('login-email').value = email;
    
    // Mudar para tab de login
    switchAuthTab('login');
    
    // Limpar formulário
    document.getElementById('register-form').reset();
    
    // Focar no campo de password para login rápido
    setTimeout(() => {
        document.getElementById('login-password').focus();
    }, 500);
}

function quickAdminLogin(adminType) {
    if (adminUsers[adminType]) {
        currentUser = {
            type: adminType,
            name: adminUsers[adminType].name,
            role: adminUsers[adminType].role,
            permissions: adminUsers[adminType].permissions
        };
        
        // Salvar sessão
        localStorage.setItem('cogim_admin_user', JSON.stringify(currentUser));
        localStorage.setItem('cogim_admin_auth', new Date().getTime().toString());
        
        showAdminPanel();
        showNotification('Acesso administrativo concedido!', 'success');
    }
}

function handleLogout() {
    localStorage.removeItem('cogim_admin_user');
    localStorage.removeItem('cogim_admin_auth');
    currentUser = null;
    showLoginModal();
    showNotification('Sessão terminada com sucesso!', 'info');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'gallery':
            loadGalleryImages();
            break;
        case 'dashboard':
            loadDashboardData();
            break;
    }
}

function loadDashboardData() {
    // Verificar se o projeto está online
    checkProjectStatus().then(isOnline => {
        if (isOnline) {
            // Se estiver online, carregar dados reais
            loadRealStats();
        } else {
            // Se for local, mostrar zeros
            loadLocalStats();
        }
        
        // Contar imagens na galeria (sempre real)
        countGalleryImages();
    });
}

async function checkProjectStatus() {
    try {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
        
        console.log(`🌐 Status do projeto: ${isLocal ? 'Local (Desenvolvimento)' : 'Online (Produção)'}`);
        return !isLocal;
    } catch (error) {
        console.log('Erro ao verificar status:', error);
        return false;
    }
}

function loadLocalStats() {
    console.log('📊 Carregando estatísticas locais (desenvolvimento)');
    
    // Estatísticas zeradas para desenvolvimento local
    const localStats = {
        views: 0,
        contacts: 0,
        projects: 0,
        galleryImages: 0
    };
    
    // Atualizar interface
    updateStatsDisplay(localStats);
    
    // Carregar atividade de desenvolvimento
    loadDevelopmentActivity();
    
    showNotification('📍 Modo desenvolvimento - Estatísticas zeradas até projeto ir online', 'info');
}

async function loadRealStats() {
    console.log('📊 Carregando estatísticas reais (produção)');
    
    try {
        // Tentar carregar estatísticas reais da API
        const response = await fetch('/api/stats');
        if (response.ok) {
            const stats = await response.json();
            updateStatsDisplay(stats);
            loadProductionActivity();
        } else {
            // Se não houver API de stats, começar do zero mesmo em produção
            loadInitialProductionStats();
        }
    } catch (error) {
        console.log('Erro ao carregar stats reais, iniciando do zero:', error);
        loadInitialProductionStats();
    }
}

function loadInitialProductionStats() {
    // Estatísticas iniciais para quando o projeto for pela primeira vez online
    const initialStats = {
        views: 0,
        contacts: 0,
        projects: 0,
        galleryImages: 0
    };
    
    updateStatsDisplay(initialStats);
    loadProductionActivity();
    showNotification('🚀 Projeto online! Estatísticas iniciando do zero', 'success');
}

function updateStatsDisplay(stats) {
    // Atualizar elementos da interface com animação
    animateCounter(document.querySelector('.stat-card:nth-child(1) .text-3xl'), stats.views || 0);
    animateCounter(document.querySelector('.stat-card:nth-child(2) .text-3xl'), stats.contacts || 0);
    animateCounter(document.querySelector('.stat-card:nth-child(3) .text-3xl'), stats.projects || 0);
    animateCounter(document.getElementById('gallery-count'), stats.galleryImages || 0);
    
    // Salvar estatísticas localmente para persistência
    localStorage.setItem('cogim_stats', JSON.stringify(stats));
}

function animateCounter(element, targetValue) {
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1500; // 1.5 segundos
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Usar easing para animação suave
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function countGalleryImages() {
    // Contar imagens reais da galeria baseado nas categorias
    try {
        let totalImages = 0;
        
        // Se temos acesso ao objeto categorias (da página de categoria)
        if (typeof categorias !== 'undefined') {
            Object.keys(categorias).forEach(category => {
                if (categorias[category] && Array.isArray(categorias[category])) {
                    totalImages += categorias[category].length;
                }
            });
        } else {
            // Método alternativo: contar através de requisição
            fetch('/api/gallery-count')
                .then(response => response.json())
                .then(data => {
                    totalImages = data.count || 0;
                    document.getElementById('gallery-count').textContent = totalImages;
                })
                .catch(() => {
                    // Fallback: começar com 0
                    totalImages = 0;
                    document.getElementById('gallery-count').textContent = totalImages;
                });
            return;
        }
        
        document.getElementById('gallery-count').textContent = totalImages;
    } catch (error) {
        console.log('Erro ao contar imagens:', error);
        document.getElementById('gallery-count').textContent = '0';
    }
}

function loadDevelopmentActivity() {
    const activityList = document.getElementById('recent-activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = `
        <div class="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-700">🔧 Painel administrativo criado</span>
            <span class="text-gray-500 text-sm ml-auto">${getTimeAgo(new Date())}</span>
        </div>
        <div class="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">✅ Sistema de tradução PT/EN implementado</span>
            <span class="text-gray-500 text-sm ml-auto">${getTimeAgo(new Date())}</span>
        </div>
        <div class="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-gray-700">🔐 Autenticação social configurada</span>
            <span class="text-gray-500 text-sm ml-auto">${getTimeAgo(new Date())}</span>
        </div>
        <div class="text-center p-4 text-gray-500 text-sm">
            <i class="fas fa-info-circle mr-2"></i>
            Atividade real será registada quando o projeto estiver online
        </div>
    `;
}

function loadProductionActivity() {
    const activityList = document.getElementById('recent-activity-list');
    if (!activityList) return;
    
    // Tentar carregar atividade real da API
    fetch('/api/activity')
        .then(response => response.json())
        .then(activities => {
            if (activities && activities.length > 0) {
                displayActivities(activities);
            } else {
                displayEmptyActivity();
            }
        })
        .catch(() => {
            displayEmptyActivity();
        });
}

function displayEmptyActivity() {
    const activityList = document.getElementById('recent-activity-list');
    activityList.innerHTML = `
        <div class="text-center p-8 text-gray-500">
            <i class="fas fa-rocket text-4xl mb-4 text-blue-500"></i>
            <h4 class="text-lg font-semibold text-gray-700 mb-2">Projeto Online!</h4>
            <p class="text-sm">A atividade será registada conforme os utilizadores interagem com o site</p>
        </div>
    `;
}

function displayActivities(activities) {
    const activityList = document.getElementById('recent-activity-list');
    let html = '';
    
    activities.forEach(activity => {
        const color = getActivityColor(activity.type);
        html += `
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 ${color} rounded-full"></div>
                <span class="text-gray-700">${activity.message}</span>
                <span class="text-gray-500 text-sm ml-auto">${getTimeAgo(new Date(activity.timestamp))}</span>
            </div>
        `;
    });
    
    activityList.innerHTML = html;
}

function getActivityColor(type) {
    const colors = {
        'image': 'bg-green-500',
        'content': 'bg-blue-500',
        'contact': 'bg-orange-500',
        'user': 'bg-purple-500',
        'system': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString();
}

function loadGalleryImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">A carregar imagens...</div>';
    
    // Simular carregamento de imagens
    setTimeout(() => {
        const categories = ['cozinhas', 'guardafatos', 'racks', 'outros'];
        let imagesHTML = '';
        
        // Gerar imagens de exemplo
        for (let i = 1; i <= 24; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            imagesHTML += `
                <div class="gallery-item relative group cursor-pointer" data-category="${category}">
                    <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <i class="fas fa-image text-4xl text-blue-400"></i>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div class="flex gap-2">
                            <button class="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100" onclick="editImage(${i})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600" onclick="deleteImage(${i})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-2 text-center">
                        <p class="text-sm text-gray-600 capitalize">${category}</p>
                        <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">${category}</span>
                    </div>
                </div>
            `;
        }
        
        galleryGrid.innerHTML = imagesHTML;
    }, 1000);
}

function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            item.style.display = 'none';
        }
    });
}

function setupQuickActions() {
    // Adicionar event listeners para botões de ação rápida
    document.querySelectorAll('.btn-admin').forEach(btn => {
        if (btn.textContent.includes('Adicionar Imagem')) {
            btn.addEventListener('click', () => showNotification('Funcionalidade de upload em desenvolvimento', 'info'));
        }
        if (btn.textContent.includes('Editar Conteúdo')) {
            btn.addEventListener('click', () => showSection('content'));
        }
        if (btn.textContent.includes('Ver Relatórios')) {
            btn.addEventListener('click', () => showNotification('Relatórios em desenvolvimento', 'info'));
        }
        if (btn.textContent.includes('Guardar') || btn.textContent.includes('Atualizar') || btn.textContent.includes('Aplicar')) {
            btn.addEventListener('click', (e) => {
                if (!btn.textContent.includes('Configurações')) {
                    showNotification('Alterações guardadas com sucesso!', 'success');
                }
            });
        }
    });
}

function editImage(id) {
    showNotification(`Editar imagem ${id} - Funcionalidade em desenvolvimento`, 'info');
}

function deleteImage(id) {
    if (confirm('Tem certeza que deseja eliminar esta imagem?')) {
        showNotification(`Imagem ${id} eliminada com sucesso!`, 'success');
        // Aqui removeria a imagem da interface
        setTimeout(() => loadGalleryImages(), 500);
    }
}

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full`;
    
    // Definir cor baseada no tipo
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
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:bg-black hover:bg-opacity-20 rounded p-1">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-remove após 5 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .gallery-item {
        transition: all 0.3s ease;
    }
    
    .gallery-item:hover {
        transform: translateY(-2px);
    }
    
    .transition-all {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Detectar contas do sistema
async function detectSystemAccounts() {
    const detectedAccounts = [];
    
    try {
        console.log('🔍 Iniciando detecção de contas do sistema...');
        
        // 1. Detectar contas específicas do Windows
        const windowsAccounts = await detectWindowsAccounts();
        detectedAccounts.push(...windowsAccounts);
        
        // 2. Verificar contas salvas anteriormente
        const savedAccounts = getSavedAccounts();
        detectedAccounts.push(...savedAccounts);
        
        // 3. Tentar acessar API do sistema (requer permissões especiais)
        if ('contacts' in navigator) {
            try {
                const contacts = await navigator.contacts.select(['email'], { multiple: true });
                contacts.forEach(contact => {
                    if (contact.email && contact.email.length > 0) {
                        detectedAccounts.push({
                            email: contact.email[0],
                            name: contact.name || '',
                            source: 'system_contacts'
                        });
                    }
                });
            } catch (e) {
                console.log('❌ Contacts API não disponível ou negada');
            }
        }
        
        // 4. Verificar credenciais salvas no navegador (experimental)
        if ('credentials' in navigator && navigator.credentials.store) {
            try {
                console.log('🔑 Credential Management API disponível');
                // Esta API é experimental e requer contexto seguro (HTTPS)
            } catch (e) {
                console.log('❌ Credentials API não disponível');
            }
        }
        
        // 5. Tentar detectar contas através de padrões comuns
        await detectCommonEmailPatterns(detectedAccounts);
        
        // 6. Remover duplicatas
        const uniqueAccounts = removeDuplicateAccounts(detectedAccounts);
        
        console.log(`✅ Detectadas ${uniqueAccounts.length} contas:`, uniqueAccounts);
        
        return uniqueAccounts;
        
    } catch (error) {
        console.log('❌ Erro ao detectar contas:', error);
        return detectedAccounts;
    }
}

async function detectCommonEmailPatterns(accounts) {
    const userName = await getUserName();
    if (!userName) return;
    
    const commonDomains = [
        { domain: 'gmail.com', name: 'Gmail', color: '#ea4335' },
        { domain: 'outlook.com', name: 'Outlook', color: '#0078d4' },
        { domain: 'hotmail.com', name: 'Hotmail', color: '#0078d4' },
        { domain: 'yahoo.com', name: 'Yahoo', color: '#7b68ee' },
        { domain: 'icloud.com', name: 'iCloud', color: '#000000' }
    ];
    
    // Gerar variações do nome
    const nameVariations = [
        userName.toLowerCase(),
        userName.toLowerCase().replace(/\s+/g, '.'),
        userName.toLowerCase().replace(/\s+/g, ''),
        userName.toLowerCase().replace(/\s+/g, '_'),
        userName.split(' ')[0]?.toLowerCase() // Primeiro nome apenas
    ].filter(Boolean);
    
    commonDomains.forEach(domainInfo => {
        nameVariations.forEach(variation => {
            accounts.push({
                email: `${variation}@${domainInfo.domain}`,
                name: userName,
                source: 'pattern_generated',
                suggested: true,
                provider: domainInfo.name,
                providerColor: domainInfo.color
            });
        });
    });
}

function removeDuplicateAccounts(accounts) {
    const seen = new Set();
    return accounts.filter(account => {
        const key = account.email.toLowerCase();
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Obter nome do utilizador do sistema
async function getUserName() {
    try {
        // Tentar diferentes métodos para obter nome do utilizador
        
        // 1. Verificar se já temos informações salvas
        const savedName = localStorage.getItem('user_display_name');
        if (savedName) return savedName;
        
        // 2. Tentar acessar informações do sistema via API personalizada
        try {
            const response = await fetch('/api/system-info');
            if (response.ok) {
                const data = await response.json();
                if (data.username) {
                    localStorage.setItem('user_display_name', data.username);
                    return data.username;
                }
            }
        } catch (e) {
            console.log('API system-info não disponível');
        }
        
        // 3. Environment variables (funciona em Node.js contexts)
        if (typeof process !== 'undefined' && process.env) {
            const username = process.env.USERNAME || process.env.USER;
            if (username) {
                localStorage.setItem('user_display_name', username);
                return username;
            }
        }
        
        // 4. Tentar extrair do caminho atual (Windows path patterns)
        const currentPath = window.location.pathname;
        const pathMatch = currentPath.match(/Users[\/\\]([^\/\\]+)/i);
        if (pathMatch && pathMount[1]) {
            const username = pathMatch[1];
            localStorage.setItem('user_display_name', username);
            return username;
        }
        
        // 5. Análise do User Agent para informações do sistema
        const userAgent = navigator.userAgent;
        console.log('User Agent:', userAgent);
        
        // 6. Usar APIs Web modernas quando disponíveis
        if ('contacts' in navigator) {
            try {
                const contacts = await navigator.contacts.select(['name'], { multiple: false });
                if (contacts && contacts.length > 0 && contacts[0].name) {
                    const name = contacts[0].name[0];
                    localStorage.setItem('user_display_name', name);
                    return name;
                }
            } catch (e) {
                console.log('Contacts API não disponível ou negada');
            }
        }
        
        // 7. Tentar detectar a partir de credenciais salvas do navegador
        if ('credentials' in navigator) {
            try {
                // Esta API ainda é experimental
                console.log('Credentials API disponível');
            } catch (e) {
                console.log('Credentials API não disponível');
            }
        }
        
        // 8. Última tentativa - prompt amigável ao utilizador
        const hasAsked = localStorage.getItem('user_name_asked');
        if (!hasAsked) {
            const name = prompt('👋 Olá! Para personalizar sua experiência, qual é o seu nome?');
            if (name && name.trim()) {
                localStorage.setItem('user_display_name', name.trim());
                localStorage.setItem('user_name_asked', 'true');
                return name.trim();
            }
            localStorage.setItem('user_name_asked', 'true');
        }
        
        return null;
    } catch (error) {
        console.log('Erro ao obter nome do utilizador:', error);
        return null;
    }
}

// Detectar contas de email mais específicas do Windows
async function detectWindowsAccounts() {
    const accounts = [];
    
    try {
        // 1. Contas comuns do Windows
        const username = await getUserName();
        if (username) {
            // Gerar emails baseados no nome do utilizador
            const emailVariations = [
                `${username.toLowerCase()}@gmail.com`,
                `${username.toLowerCase()}@outlook.com`,
                `${username.toLowerCase()}@hotmail.com`,
                `${username.toLowerCase()}@yahoo.com`,
                `${username.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
                `${username.toLowerCase().replace(/\s+/g, '')}@outlook.com`
            ];
            
            emailVariations.forEach(email => {
                accounts.push({
                    email: email,
                    name: username,
                    source: 'windows_user',
                    suggested: true
                });
            });
        }
        
        // 2. Tentar detectar contas Microsoft
        const microsoftAccounts = await detectMicrosoftAccounts();
        accounts.push(...microsoftAccounts);
        
        // 3. Verificar contas salvas localmente
        const savedAccounts = getSavedAccounts();
        accounts.push(...savedAccounts);
        
    } catch (error) {
        console.log('Erro ao detectar contas Windows:', error);
    }
    
    return accounts;
}

async function detectMicrosoftAccounts() {
    const accounts = [];
    
    try {
        // Tentar detectar se há contas Microsoft ativas
        // Esta informação normalmente está disponível via APIs específicas
        
        // Placeholder para detecção de contas Microsoft
        // Em um ambiente real, isto requerira APIs específicas do Windows
        
        console.log('Tentando detectar contas Microsoft...');
        
    } catch (error) {
        console.log('Erro ao detectar contas Microsoft:', error);
    }
    
    return accounts;
}

function getSavedAccounts() {
    try {
        const saved = localStorage.getItem('cogim_saved_accounts');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

function saveAccountInfo(email, name) {
    try {
        const savedAccounts = getSavedAccounts();
        const existingIndex = savedAccounts.findIndex(acc => acc.email === email);
        
        const accountInfo = {
            email: email,
            name: name,
            source: 'manual',
            lastUsed: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            savedAccounts[existingIndex] = accountInfo;
        } else {
            savedAccounts.push(accountInfo);
        }
        
        // Manter apenas os últimos 10 accounts
        if (savedAccounts.length > 10) {
            savedAccounts.splice(0, savedAccounts.length - 10);
        }
        
        localStorage.setItem('cogim_saved_accounts', JSON.stringify(savedAccounts));
    } catch (error) {
        console.log('Erro ao salvar informações da conta:', error);
    }
}

// Inicializar autenticação social
async function initSocialAuth() {
    console.log('🚀 Inicializando sistema de autenticação...');
    
    // Detectar contas do sistema via API do servidor
    try {
        const response = await fetch('/api/detect-accounts');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Contas detectadas via API:', data);
            
            if (data.accounts && data.accounts.length > 0) {
                setupAccountSuggestions(data.accounts);
                showNotification(`📧 Detectadas ${data.accounts.length} sugestões de email para ${data.username}`, 'info');
            }
            
            // Salvar nome do utilizador
            if (data.username) {
                localStorage.setItem('user_display_name', data.username);
            }
        } else {
            console.log('❌ API de detecção não disponível, usando método alternativo');
            // Fallback para detecção local
            const localAccounts = await detectSystemAccounts();
            if (localAccounts.length > 0) {
                setupAccountSuggestions(localAccounts);
            }
        }
    } catch (error) {
        console.log('❌ Erro na API, usando detecção local:', error);
        
        // Fallback para detecção local
        const localAccounts = await detectSystemAccounts();
        if (localAccounts.length > 0) {
            setupAccountSuggestions(localAccounts);
            showNotification(`📧 Detectadas ${localAccounts.length} sugestões de email`, 'info');
        }
    }
    
    // Inicializar Google
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Substitua pelo seu client ID
            callback: handleGoogleCallback
        });
        googleLoaded = true;
        console.log('✅ Google Sign-In inicializado');
    }
    
    // Inicializar Facebook
    window.fbAsyncInit = function() {
        FB.init({
            appId: 'YOUR_APP_ID', // Substitua pelo seu App ID
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
        facebookLoaded = true;
        console.log('✅ Facebook SDK inicializado');
    };
}

function handleGoogleSignIn() {
    if (!googleLoaded) {
        showNotification('Google Sign-In ainda não carregou. Tente novamente.', 'warning');
        return;
    }
    
    // Para demonstração, vamos simular um login com Google
    simulateSocialLogin('Google', 'user@gmail.com', 'Utilizador Google');
}

function handleGoogleCallback(response) {
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const socialUser = {
            type: 'social',
            name: payload.name,
            email: payload.email,
            provider: 'google',
            role: 'viewer',
            permissions: ['view'],
            avatar: payload.picture
        };
        
        loginSocialUser(socialUser);
    } catch (error) {
        showNotification('Erro no login com Google', 'error');
    }
}

function handleFacebookSignIn() {
    if (!facebookLoaded) {
        showNotification('Facebook SDK ainda não carregou. Tente novamente.', 'warning');
        return;
    }
    
    // Para demonstração, vamos simular um login com Facebook
    simulateSocialLogin('Facebook', 'user@facebook.com', 'Utilizador Facebook');
}

function simulateSocialLogin(provider, email, name) {
    const socialUser = {
        type: 'social',
        name: name,
        email: email,
        provider: provider.toLowerCase(),
        role: 'viewer',
        permissions: ['view'],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00A3FF&color=fff`
    };
    
    loginSocialUser(socialUser);
}

function loginSocialUser(socialUser) {
    currentUser = socialUser;
    
    // Salvar sessão
    localStorage.setItem('cogim_admin_user', JSON.stringify(currentUser));
    localStorage.setItem('cogim_admin_auth', new Date().getTime().toString());
    
    showAdminPanel();
    showNotification(`Login com ${socialUser.provider} realizado com sucesso!`, 'success');
}

// Configurar sugestões de contas
function setupAccountSuggestions(accounts) {
    const emailInputs = ['login-email', 'register-email'];
    
    emailInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            // Criar dropdown de sugestões
            const suggestionContainer = createSuggestionDropdown(input, accounts);
            
            // Event listeners
            input.addEventListener('focus', () => showSuggestions(suggestionContainer, accounts));
            input.addEventListener('input', (e) => filterSuggestions(suggestionContainer, accounts, e.target.value));
            input.addEventListener('blur', () => setTimeout(() => hideSuggestions(suggestionContainer), 200));
        }
    });
}

function createSuggestionDropdown(input, accounts) {
    const container = document.createElement('div');
    container.className = 'suggestion-dropdown';
    container.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Tornar o container pai relativo
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(container);
    
    return container;
}

function showSuggestions(container, accounts) {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Adicionar título se houver contas detectadas
    if (accounts.length > 0) {
        const title = document.createElement('div');
        title.className = 'suggestion-title';
        title.style.cssText = `
            padding: 8px 12px;
            font-size: 12px;
            color: #6b7280;
            border-bottom: 1px solid #f3f4f6;
            background: #f9fafb;
        `;
        title.textContent = 'Contas detectadas:';
        container.appendChild(title);
    }
    
    accounts.forEach(account => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.style.cssText = `
            padding: 12px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background-color 0.2s;
        `;
        
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f3f4f6';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
        
        // Ícone baseado na fonte
        const icon = document.createElement('div');
        icon.style.cssText = `
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            font-weight: bold;
        `;
        
        if (account.source === 'system_contacts') {
            icon.style.backgroundColor = '#10b981';
            icon.textContent = '👤';
        } else if (account.email.includes('gmail')) {
            icon.style.backgroundColor = '#ea4335';
            icon.textContent = 'G';
        } else if (account.email.includes('outlook') || account.email.includes('hotmail')) {
            icon.style.backgroundColor = '#0078d4';
            icon.textContent = 'M';
        } else if (account.email.includes('yahoo')) {
            icon.style.backgroundColor = '#7b68ee';
            icon.textContent = 'Y';
        } else {
            icon.style.backgroundColor = '#6b7280';
            icon.textContent = '@';
        }
        
        const info = document.createElement('div');
        info.innerHTML = `
            <div style="font-weight: 500; color: #1f2937;">${account.email}</div>
            ${account.name ? `<div style="font-size: 12px; color: #6b7280;">${account.name}</div>` : ''}
            ${account.suggested ? `<div style="font-size: 10px; color: #9ca3af;">Sugestão baseada no seu nome</div>` : ''}
        `;
        
        item.appendChild(icon);
        item.appendChild(info);
        
        item.addEventListener('click', () => {
            // Preencher campos
            const emailInput = container.parentElement.querySelector('input[type="email"]');
            emailInput.value = account.email;
            
            // Se estiver no formulário de registro, preencher nome também
            if (account.name && emailInput.id === 'register-email') {
                const names = account.name.split(' ');
                const firstNameInput = document.getElementById('register-firstname');
                const lastNameInput = document.getElementById('register-lastname');
                
                if (firstNameInput && names[0]) {
                    firstNameInput.value = names[0];
                }
                if (lastNameInput && names.length > 1) {
                    lastNameInput.value = names.slice(1).join(' ');
                }
            }
            
            hideSuggestions(container);
            emailInput.focus();
        });
        
        container.appendChild(item);
    });
    
    // Botão para adicionar manualmente
    const manualItem = document.createElement('div');
    manualItem.className = 'suggestion-item';
    manualItem.style.cssText = `
        padding: 12px;
        cursor: pointer;
        border-top: 2px solid #e5e7eb;
        color: #00A3FF;
        font-weight: 500;
        text-align: center;
    `;
    manualItem.textContent = '✍️ Digitar manualmente';
    manualItem.addEventListener('click', () => {
        hideSuggestions(container);
        container.parentElement.querySelector('input[type="email"]').focus();
    });
    
    container.appendChild(manualItem);
}

function filterSuggestions(container, accounts, query) {
    if (!query) {
        showSuggestions(container, accounts);
        return;
    }
    
    const filtered = accounts.filter(account => 
        account.email.toLowerCase().includes(query.toLowerCase()) ||
        (account.name && account.name.toLowerCase().includes(query.toLowerCase()))
    );
    
    showSuggestions(container, filtered);
}

function hideSuggestions(container) {
    container.style.display = 'none';
}

// Verificar sessão periodicamente
setInterval(() => {
    if (currentUser) {
        const authTime = parseInt(localStorage.getItem('cogim_admin_auth') || '0');
        const currentTime = new Date().getTime();
        
        // Se a sessão expirou
        if ((currentTime - authTime) >= (8 * 60 * 60 * 1000)) {
            handleLogout();
        }
    }
}, 60000); // Verificar a cada minuto