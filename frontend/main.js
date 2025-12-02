
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
    