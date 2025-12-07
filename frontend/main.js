<<<<<<< HEAD
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
=======

        // Função para marcar link ativo na navbar baseado na seção visível
        function setActiveNavLink(sectionId = null) {
            // Remove classe active de todos os links da navegação (exceto PT/EN)
            document.querySelectorAll('nav a:not(.language-btn)').forEach(link => {
                link.classList.remove('active');
            });
            
            if (sectionId) {
                // Se for seção galeria, marca o link da galeria como ativo
                if (sectionId === 'galeria') {
                    const galeriaLink = document.querySelector('a[data-translate="nav-gallery"]');
                    if (galeriaLink) {
                        galeriaLink.classList.add('active');
                        console.log('Link Galeria marcado como ativo na seção Nossos Trabalhos');
                    }
                } else {
                    // Para outras seções, marca o link correspondente à seção como ativo
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        }
        
        // Função para detectar qual seção está mais visível na tela
        function getCurrentSection() {
            const sections = document.querySelectorAll('#inicio, #galeria, #sobre, #localizacao');
            const scrollPosition = window.scrollY + 150; // Offset para detecção mais precisa
            
            let currentSection = null;
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                // Calcula distância do topo da seção ao ponto de scroll atual
                const distanceFromTop = Math.abs(scrollPosition - sectionTop);
                
                // Se o scroll está dentro desta seção
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.id;
                }
                
                // Encontra a seção mais próxima
                if (distanceFromTop < closestDistance) {
                    closestDistance = distanceFromTop;
                    closestSection = section.id;
                }
            });
            
            // Se está no topo da página ou na seção hero (primeiros 200px), marca início
            if (window.scrollY < 200) {
                return 'inicio';
            }
            
            // Retorna seção atual ou mais próxima
            return currentSection || closestSection;
        }
        
        // Função para atualizar navbar baseada no scroll
        function updateNavbarOnScroll() {
            const currentSection = getCurrentSection();
            setActiveNavLink(currentSection);
        }
        
        // Função para definir link ativo baseado na página atual
        function setActiveNavBasedOnPage() {
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;
            
            // Remove active de todos os links (exceto botões de idioma)
            document.querySelectorAll('nav a:not(.language-btn)').forEach(link => {
                link.classList.remove('active');
            });
            
            // Se estiver na página da galeria, marca link Galeria como ativo
            if (currentPath.includes('categoria.html')) {
                const galeriaLink = document.querySelector('a[data-translate="nav-gallery"]');
                if (galeriaLink) {
                    galeriaLink.classList.add('active');
                    console.log('Link Galeria marcado como ativo');
                }
                return;
            }
            
            // Se estiver na página principal
            if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '' || currentPath.endsWith('/')) {
                // Se tem hash específico, trata conforme a seção
                if (currentHash && currentHash !== '#inicio' && currentHash !== '#') {
                    // Se hash é galeria, marca link da galeria
                    if (currentHash === '#galeria') {
                        const galeriaLink = document.querySelector('a[data-translate="nav-gallery"]');
                        if (galeriaLink) {
                            galeriaLink.classList.add('active');
                            console.log('Link Galeria marcado como ativo via hash');
                            return;
                        }
                    } else {
                        // Para outros hashes, marca o link correspondente
                        const targetLink = document.querySelector(`a[href="${currentHash}"]`);
                        if (targetLink) {
                            targetLink.classList.add('active');
                            console.log(`Link ${currentHash} marcado como ativo`);
                            return;
                        }
                    }
                }
                
                // Se está no topo ou hash é início, marca início como ativo
                if (!currentHash || currentHash === '#inicio' || currentHash === '#' || window.scrollY < 200) {
                    const inicioLink = document.querySelector('a[href="#inicio"]');
                    if (inicioLink) {
                        inicioLink.classList.add('active');
                        console.log('Link Início marcado como ativo');
                        return;
                    }
                }
                
                // Caso contrário, detecta baseado no scroll
                updateNavbarOnScroll();
            }
        }
        
        // Adiciona event listeners para links da navegação
        document.addEventListener('DOMContentLoaded', function() {
            // Define link ativo baseado na página atual
            setActiveNavBasedOnPage();
            
            // Controle do menu mobile
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mainNav = document.getElementById('main-nav');
            
            if (mobileMenuBtn && mainNav) {
                mobileMenuBtn.addEventListener('click', function() {
                    mainNav.classList.toggle('mobile-open');
                });
                
                // Fechar menu ao clicar em um link
                mainNav.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', function() {
                        mainNav.classList.remove('mobile-open');
                    });
                });
                
                // Fechar menu ao clicar fora dele
                document.addEventListener('click', function(e) {
                    if (!mobileMenuBtn.contains(e.target) && !mainNav.contains(e.target)) {
                        mainNav.classList.remove('mobile-open');
                    }
                });
            }
            
            // Controle da navbar no scroll - esconde tudo após 100px
            let scrollTimeout;
            
            window.addEventListener('scroll', function() {
                // A lógica de auto-hide da navbar foi removida para mantê-la sempre visível.
                
                // Atualiza navbar ativa apenas se estiver na página principal
                const currentPath = window.location.pathname;
                if (!currentPath.includes('categoria.html')) {
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    scrollTimeout = setTimeout(function() {
                        updateNavbarOnScroll();
                    }, 10);
                }
            });
            
            // Adiciona listeners para todos os links da navegação com âncoras
            document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Permite navegação normal, mas força atualização após scroll
                    setTimeout(() => {
                        setActiveNavBasedOnPage();
                    }, 100);
                });
            });
            
            // Adiciona listener para link da galeria
            const galeriaLink = document.querySelector('a[data-translate="nav-gallery"]');
            if (galeriaLink) {
                galeriaLink.addEventListener('click', function(e) {
                    // Se for um clique com Ctrl ou botão do meio, permite navegação normal
                    if (e.ctrlKey || e.metaKey || e.button === 1) {
                        return;
                    }
                    
                    // Para clique normal, primeiro mostra seção na página atual
                    e.preventDefault();
                    
                    // Navega para seção galeria na página atual
                    const galeriaSection = document.getElementById('galeria');
                    if (galeriaSection) {
                        galeriaSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Marca link como ativo
                        document.querySelectorAll('nav a:not(.language-btn)').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Atualiza URL sem recarregar página
                        history.pushState(null, null, '#galeria');
                    }
                });
                
                // Listener para clique direito ou modificadores - vai direto para página
                galeriaLink.addEventListener('contextmenu', function() {
                    // Permite clique direito normal
                });
            }
            
            // Listener para mudanças na URL (botão voltar do navegador)
            window.addEventListener('popstate', function() {
                setTimeout(() => {
                    setActiveNavBasedOnPage();
                }, 50);
            });
            
            // Listener para links que levam de volta à página principal
            document.querySelectorAll('a[href="index.html"], a[href="/"], a[href=""], .logo a').forEach(link => {
                link.addEventListener('click', function() {
                    // Quando voltar para página principal, marca Início como ativo
                    setTimeout(() => {
                        document.querySelectorAll('nav a:not(.language-btn)').forEach(l => l.classList.remove('active'));
                        const inicioLink = document.querySelector('a[href="#inicio"]');
                        if (inicioLink) inicioLink.classList.add('active');
                    }, 100);
                });
            });
            
            // Detecta quando página é carregada via navegação (botão voltar)
            if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
                setTimeout(() => {
                    setActiveNavBasedOnPage();
                }, 200);
            }
            
            // Listener para quando a página ganha foco (usuário volta para a aba)
            window.addEventListener('focus', function() {
                setTimeout(() => {
                    setActiveNavBasedOnPage();
                }, 100);
            });
            
            // Observer para detectar seções visíveis com maior precisão
            const observer = new IntersectionObserver((entries) => {
                let mostVisibleSection = null;
                let maxVisibilityRatio = 0;
                
                entries.forEach(entry => {
                    // Encontra a seção mais visível
                    if (entry.intersectionRatio > maxVisibilityRatio) {
                        maxVisibilityRatio = entry.intersectionRatio;
                        mostVisibleSection = entry.target.id;
                    }
                });
                
                // Só atualiza se alguma seção estiver pelo menos 30% visível
                if (maxVisibilityRatio > 0.3) {
                    setActiveNavLink(mostVisibleSection);
                }
            }, {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Múltiplos thresholds
                rootMargin: '-10% 0px -10% 0px' // Margem para detecção mais precisa
            });
            
            // Observa as seções principais
            const sections = document.querySelectorAll('#inicio, #galeria, #sobre, #localizacao');
            sections.forEach(section => {
                if (section) observer.observe(section);
            });
        });
    
>>>>>>> 6333dcf848ae64fd7587074f35a06b22539f9781
