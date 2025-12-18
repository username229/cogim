// ============================================
// SISTEMA DE GERENCIAMENTO DE COOKIES - COGIM
// ============================================

/**
 * TIPOS DE COOKIES UTILIZADOS:
 * 
 * 1. cookies_accepted (essencial) - Armazena se o usuário aceitou a política
 * 2. preferredLanguage (funcionalidade) - Idioma preferido do usuário
 * 3. _ga, _gid (analytics) - Google Analytics (opcional, requer consentimento)
 * 4. user_session (funcionalidade) - ID de sessão do usuário
 */

// ============================================
// FUNÇÕES AUXILIARES DE COOKIES
// ============================================

/**
 * Define um cookie com nome, valor e dias de expiração
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor do cookie
 * @param {number} days - Dias até expiração
 * @param {boolean} secure - Se deve usar conexão segura (HTTPS)
 */
function setCookie(name, value, days, secure = false) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    
    // Adiciona flag Secure se estiver em HTTPS
    if (secure && window.location.protocol === 'https:') {
        cookieString += ';Secure';
    }
    
    document.cookie = cookieString;
    console.log(`🍪 Cookie definido: ${name} = ${value}`);
}

/**
 * Obtém o valor de um cookie pelo nome
 * @param {string} name - Nome do cookie
 * @returns {string|null} - Valor do cookie ou null
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

/**
 * Remove um cookie
 * @param {string} name - Nome do cookie a ser removido
 */
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    console.log(`🗑️ Cookie removido: ${name}`);
}

// ============================================
// GERENCIAMENTO DO MODAL DE COOKIES
// ============================================

/**
 * Aceita os cookies e salva a preferência
 */
function acceptCookies() {
    // 1. Salva consentimento de cookies essenciais
    setCookie('cookies_accepted', 'true', 365, true);
    
    // 2. Salva idioma padrão se não existir
    if (!getCookie('preferredLanguage')) {
        setCookie('preferredLanguage', 'pt', 365, true);
    }
    
    // 3. Gera ID de sessão único
    if (!getCookie('user_session')) {
        const sessionId = generateSessionId();
        setCookie('user_session', sessionId, 30, true);
    }
    
    // 4. Inicializa Google Analytics (se configurado)
    initializeAnalytics();
    
    // 5. Fecha o modal
    const cookieModal = document.getElementById("cookie-modal");
    if (cookieModal) {
        cookieModal.classList.add('hidden');
    }
    
    console.log('✅ Cookies aceitos e inicializados');
}

/**
 * Recusa cookies não essenciais
 */
function rejectCookies() {
    // Salva apenas que o usuário viu o aviso
    setCookie('cookies_accepted', 'essential_only', 365, true);
    
    // Remove cookies de analytics se existirem
    deleteCookie('_ga');
    deleteCookie('_gid');
    deleteCookie('_gat');
    
    // Fecha o modal
    const cookieModal = document.getElementById("cookie-modal");
    if (cookieModal) {
        cookieModal.classList.add('hidden');
    }
    
    console.log('⚠️ Apenas cookies essenciais aceitos');
}

/**
 * Gera um ID único de sessão
 * @returns {string} - ID de sessão
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// INICIALIZAÇÃO DO GOOGLE ANALYTICS
// ============================================

/**
 * Inicializa o Google Analytics se o usuário consentiu
 */
function initializeAnalytics() {
    // Substitua 'G-XXXXXXXXXX' pelo seu ID real do Google Analytics
    const GA_ID = 'G-XXXXXXXXXX';
    
    // Verifica se já foi carregado
    if (window.gtag) {
        console.log('📊 Google Analytics já inicializado');
        return;
    }
    
    // Carrega o script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    
    // Inicializa o gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_ID, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=Lax;Secure'
    });
    
    console.log('📊 Google Analytics inicializado');
}

// ============================================
// VERIFICAÇÃO E EXIBIÇÃO DO MODAL
// ============================================

/**
 * Verifica se deve mostrar o modal de cookies
 */
function checkCookieConsent() {
    const cookiesAccepted = getCookie('cookies_accepted');
    const cookieModal = document.getElementById("cookie-modal");
    
    if (!cookieModal) {
        console.warn('⚠️ Modal de cookies não encontrado no DOM');
        return;
    }
    
    // Se não aceitou, mostra o modal
    if (!cookiesAccepted) {
        cookieModal.classList.remove('hidden');
        console.log('🍪 Modal de cookies exibido');
    } else {
        console.log('✅ Consentimento de cookies já registrado:', cookiesAccepted);
        
        // Se aceitou todos os cookies, inicializa analytics
        if (cookiesAccepted === 'true') {
            initializeAnalytics();
        }
    }
}

// ============================================
// FUNÇÕES DE GERENCIAMENTO DE PREFERÊNCIAS
// ============================================

/**
 * Salva preferências do usuário em cookies
 * @param {object} preferences - Objeto com preferências
 */
function saveUserPreferences(preferences) {
    Object.keys(preferences).forEach(key => {
        setCookie(`pref_${key}`, preferences[key], 365, true);
    });
    console.log('💾 Preferências salvas:', preferences);
}

/**
 * Carrega preferências do usuário dos cookies
 * @returns {object} - Objeto com preferências
 */
function loadUserPreferences() {
    const preferences = {};
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name.startsWith('pref_')) {
            const prefName = name.replace('pref_', '');
            preferences[prefName] = value;
        }
    });
    
    return preferences;
}

// ============================================
// RASTREAMENTO DE EVENTOS (OPCIONAL)
// ============================================

/**
 * Envia evento para o Google Analytics
 * @param {string} eventName - Nome do evento
 * @param {object} eventParams - Parâmetros do evento
 */
function trackEvent(eventName, eventParams = {}) {
    if (window.gtag && getCookie('cookies_accepted') === 'true') {
        gtag('event', eventName, eventParams);
        console.log('📊 Evento rastreado:', eventName, eventParams);
    }
}

/**
 * Rastreia visualização de página
 * @param {string} pagePath - Caminho da página
 */
function trackPageView(pagePath) {
    if (window.gtag && getCookie('cookies_accepted') === 'true') {
        gtag('config', 'G-XXXXXXXXXX', {
            'page_path': pagePath
        });
        console.log('📄 Página rastreada:', pagePath);
    }
}

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de cookies inicializado');
    
    // Verifica consentimento e mostra modal se necessário
    checkCookieConsent();
    
    // Carrega idioma preferido se existir
    const savedLanguage = getCookie('preferredLanguage');
    if (savedLanguage && typeof changeLanguage === 'function') {
        changeLanguage(savedLanguage);
    }
    
    // Log de cookies ativos
    console.log('🍪 Cookies ativos:', document.cookie);
});

// ============================================
// EXPORTAÇÃO DE FUNÇÕES (PARA USO GLOBAL)
// ============================================

// Torna funções disponíveis globalmente
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;
window.trackEvent = trackEvent;
window.trackPageView = trackPageView;
window.saveUserPreferences = saveUserPreferences;
window.loadUserPreferences = loadUserPreferences;

console.log('✅ Funções de cookies disponíveis globalmente');