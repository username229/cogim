document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. FUNCIONALIDADE DO MENU MOBILE
    // =======================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileMenuContainer && menuIcon) {
        mobileMenuBtn.addEventListener('click', function() {
            // Alterna a classe 'hidden' para mostrar/esconder o menu
            const isHidden = mobileMenuContainer.classList.toggle('hidden');
            
            // Alterna o ícone (hamburguer <-> X)
            if (isHidden) {
                menuIcon.classList.remove('ri-close-line');
                menuIcon.classList.add('ri-menu-line');
            } else {
                menuIcon.classList.remove('ri-menu-line');
                menuIcon.classList.add('ri-close-line');
            }
        });
        
        // Fechar o menu ao clicar em um link (para rolagem suave)
        mobileMenuContainer.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuContainer.classList.add('hidden');
                menuIcon.classList.remove('ri-close-line');
                menuIcon.classList.add('ri-menu-line');
            });
        });
    }

    // =======================================================
    // 2. ATUALIZAÇÃO AUTOMÁTICA DO ANO DE COPYRIGHT
    // =======================================================
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }


    // =======================================================
    // 3. FUNCIONALIDADE DE CONTROLE DE MODAL REUTILIZÁVEL
    // =======================================================
    function setupModal(openBtnId, closeModalBtnId, modalId) {
        const openButton = document.getElementById(openBtnId);
        const closeModalButton = document.getElementById(closeModalBtnId);
        const modal = document.getElementById(modalId);

        if (!openButton || !modal) return;

        const openModal = (e) => {
            e.preventDefault(); 
            modal.classList.remove('hidden'); 
            document.body.classList.add('overflow-hidden'); // Bloqueia a rolagem do corpo
        };

        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        openButton.addEventListener('click', openModal);

        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        }

        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Fechar modal ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Ativação dos Modals
    setupModal('open-terms', 'close-modal-termos', 'modal-termos');
    setupModal('open-privacy', 'close-modal-privacy', 'modal-privacidade');


    // =======================================================
    // 4. FUNCIONALIDADE DO BANNER DE COOKIES
    // =======================================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesButton = document.getElementById('accept-cookies');
    const COOKIE_NAME = 'cogim_cookie_accepted';

    // Mostrar o banner se o cookie não estiver definido
    if (cookieBanner && !localStorage.getItem(COOKIE_NAME)) {
        setTimeout(() => {
            cookieBanner.classList.remove('opacity-0', 'pointer-events-none');
            // Opcional: remover classe de transformação se estiver usando scale-90
            const innerDiv = cookieBanner.querySelector('div');
            if (innerDiv) {
                innerDiv.classList.remove('scale-90'); 
            }
        }, 500); // Aparece após 0.5 segundo
    }

    // Definir o cookie e fechar o banner ao aceitar
    if (acceptCookiesButton && cookieBanner) {
        acceptCookiesButton.addEventListener('click', () => {
            localStorage.setItem(COOKIE_NAME, 'true');
            cookieBanner.classList.add('opacity-0', 'pointer-events-none');
            // Opcional: adicionar classe de transformação de volta
            const innerDiv = cookieBanner.querySelector('div');
            if (innerDiv) {
                innerDiv.classList.add('scale-90');
            }
        });
    }


    // =======================================================
    // 5. FUNCIONALIDADE BÁSICA DO CHATBOT FLUTUANTE
    // =======================================================
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const closeChatbotButton = document.getElementById('close-chatbot');
    const faqOptions = document.querySelectorAll('.faq-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Funções de Utilitário do Chatbot
    const createMessage = (text, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const bubble = document.createElement('div');
        bubble.className = `p-3 rounded-lg max-w-xs ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`;
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a mensagem mais recente
    };

    const getAnswer = (questionId) => {
        const answers = {
            "horarios": "Nosso horário de funcionamento é: Segunda a Sexta: 8h às 17h e Sábado: 9h às 13h.",
            "localizacao": "Estamos localizados na Av. 25 de Setembro, Maputo, Moçambique. Visite a seção 'Nossa Localização' para o mapa!",
            "produtos": "Trabalhamos com cozinhas, guarda-roupas, tetos falsos, móveis de casa de banho, e racks. Fazemos tudo sob medida!",
            "orcamento": "Para um orçamento preciso, clique no link do WhatsApp abaixo ou ligue para nós. Precisamos entender o seu projeto primeiro!",
            "prazo": "O prazo de entrega e montagem varia conforme a complexidade e tamanho do projeto, mas geralmente é informado após o projeto ser definido.",
            "whatsapp": "Pode contactar-nos diretamente pelo WhatsApp: +258 82 728 8888. Clique no botão de contato na página!",
        };
        return answers[questionId] || "Desculpe, não entendi a sua pergunta. Pode reformular?";
    };

    // Alternar visibilidade do chatbot
    const toggleChatbot = () => {
        const isHidden = chatbotWidget.classList.toggle('chatbot-hidden');
        chatbotWidget.classList.toggle('chatbot-visible', !isHidden);

        // Alterna o ícone
        const icon = chatbotButton.querySelector('i');
        if (icon) {
            icon.classList.toggle('ri-close-line', !isHidden);
            icon.classList.toggle('ri-message-3-line', isHidden);
        }
    };

    // Event Listeners
    if (chatbotButton) {
        chatbotButton.addEventListener('click', toggleChatbot);
    }
    
    if (closeChatbotButton) {
        closeChatbotButton.addEventListener('click', toggleChatbot);
    }

    if (faqOptions.length > 0) {
        faqOptions.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.textContent.trim();
                const questionId = button.getAttribute('data-question');
                
                // Exibe a pergunta do usuário no chat
                createMessage(question, true); 
                
                // Obtém e exibe a resposta
                setTimeout(() => {
                    const answer = getAnswer(questionId);
                    createMessage(answer, false);
                }, 500); // Pequeno atraso para simular o "pensamento"
            });
        });
    }

}); // Fim do DOMContentLoaded