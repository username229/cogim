﻿document.addEventListener('DOMContentLoaded', () => {
 
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('header');
    
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a[href^="#"], a[href$=".html"]') : []; 
    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
    };

  
    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    };
    
    // Liga os botões ao menu mobile
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMenu);
    }
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMenu);
    }

    // Fechar o menu ao clicar em um link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 300); 
        });
    });

    // Fechar o menu se a janela for redimensionada para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // =========================================================
    // 2. SCROLL SPY E NAVEGAÇÃO ATIVA
    // =========================================================

    // O link "Galeria" aponta para "categoria.html" ou "#galeria"
    const sections = document.querySelectorAll('#inicio, #galeria, #sobre, #localizacao');
    
    // 2.1 Função para marcar link ativo na navbar
    const setActiveNavLink = (sectionId = null) => {
        const allLinks = document.querySelectorAll('nav a:not(.language-btn)');
        allLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (sectionId) {
            let activeLink;
            if (sectionId === 'galeria') {
                // Marca o link "Galeria" (que pode ser para categoria.html)
                activeLink = document.querySelector('a[data-translate="nav-gallery"]');
            } else {
                // Para outras seções, marca o link correspondente
                activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            }
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    };
    
    // 2.2 Função para detectar qual seção está mais visível
    const getCurrentSection = () => {
        const scrollPosition = window.scrollY + 150; 
        let currentSection = null;
        
        if (window.scrollY < 200) {
            return 'inicio';
        }
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        return currentSection;
    };
    
    // 2.3 Função principal chamada no scroll
    const updateNavbarOnScroll = () => {
        if (window.location.pathname.includes('categoria.html')) return; // Ignora se estiver na página de galeria
        const currentSection = getCurrentSection();
        setActiveNavLink(currentSection);
    };

    // 2.4 Adicionar sombra ao header ao rolar e iniciar o Scroll Spy
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 10) {
                header.classList.add('shadow-lg');
            } else {
                header.classList.remove('shadow-lg');
            }
        }
        updateNavbarOnScroll();
    });
    
    // 2.5 Configurar link ativo na carga inicial (baseado na URL)
    const setActiveNavBasedOnPage = () => {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('categoria.html')) {
            const galeriaLink = document.querySelector('a[data-translate="nav-gallery"]');
            if (galeriaLink) galeriaLink.classList.add('active');
            return;
        }
        
        // Se estiver na página principal, checa o hash e o scroll
        if (!window.location.hash || window.location.hash === '#inicio' || window.location.hash === '#') {
            const inicioLink = document.querySelector('a[href="#inicio"]');
            if (inicioLink) inicioLink.classList.add('active');
        }
        updateNavbarOnScroll();
    };

    // Chamada inicial
    setActiveNavBasedOnPage();
    
    


});

