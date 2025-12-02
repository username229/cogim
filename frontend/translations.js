// Função para mudar idioma




const translations = {
    pt: {
        // Navegação
        'nav-home': 'Início',
        'nav-gallery': 'Galeria',
        'nav-about': 'Sobre a Cogim Cozinhas',
        'nav-location': 'Localização',
        
        // Página inicial - Hero
        'hero-title': 'Móveis por Medida de Qualidade Superior',
        'hero-subtitle': 'Transformamos os seus sonhos em realidade com móveis únicos e personalizados',
        'hero-cta': 'Ver Galeria',
        'hero-btn-gallery': 'Ver Galeria',
        'hero-btn-contact': 'Entre em Contacto',
        
        // Seções
        'categories-title': 'As Nossas Especialidades',
        'categories-subtitle': 'Criamos móveis únicos para cada ambiente da sua casa',
        
        // Categorias
        'category-kitchens': 'Cozinhas Planejadas',
        'category-kitchens-desc': 'Cozinhas funcionais e elegantes, projetadas para otimizar o espaço',
        'category-closets': 'Guarda-roupas Sob Medida',
        'category-closets-desc': 'Guarda-roupas personalizados com divisórias internas planeadas',
        'category-ceiling': 'Teto Falso em Gesso',
        'category-ceiling-desc': 'Projetos de teto falso que valorizam a iluminação dos ambientes',
        'category-bathroom': 'Casa de Banho',
        'category-bathroom-desc': 'Móveis para casa de banho resistentes à humidade',
        'category-racks': 'Racks',
        'category-racks-desc': 'Racks e estantes que transformam sua sala',
        'category-beds': 'Camas',
        'category-beds-desc': 'Camas sob medida que combinam conforto e design',
        'category-furniture': 'Cadeiras, Sofás e Mesas',
        'category-furniture-desc': 'Móveis que completam os seus espaços com elegância',
        
        // Botões
        'btn-view-more': 'Ver Mais',
        'btn-previous': 'Anterior',
        'btn-next': 'Próximo',
        'view-full-gallery': 'Ver Galeria Completa',
        
        // Galeria
        'gallery-title': 'Galeria de Imagens',
        'gallery-subtitle': 'Explore todos os nossos trabalhos. Use as caixas de seleção para filtrar por categoria.',
        'categories-filter': 'Categorias',
        'filter-all': 'Tudo',
        'filter-kitchens': 'Cozinhas',
        'filter-closets': 'Guarda-roupas',
        'filter-wardrobes': 'Guarda-fato',
        'filter-ceiling': 'Teto Falso',
        'filter-bathroom': 'Casa de Banho',
        'filter-racks': 'Racks',
        'filter-beds': 'Camas',
        'filter-furniture': 'Cadeiras, Sofás e Mesas',
        
        // Subcategorias
        'sub-with-counter': 'Com Bancada',
        'sub-peninsula': 'Península',
        'sub-island': 'Ilha',
        'sub-custom': 'Customizado',
        'sub-with-mirror': 'Com Espelho',
        'sub-sliding-door': 'Porta de Correr',
        'sub-wardrobes': 'Guarda-fatos',
        
        // Paginação
        'page-info': 'Página {current} de {total} - Mostrando {start}-{end} de {total_items} imagens',
        'no-images': 'Nenhuma imagem encontrada para as categorias selecionadas.',
        'select-category': 'Selecione uma categoria para ver as imagens.',
        
        // Footer
        'footer-about': 'Sobre a Cogim',
        'footer-about-text': 'Especialistas em móveis por medida há mais de 10 anos, criando soluções únicas para cada cliente.',
        'footer-services': 'Serviços',
        'footer-location': 'Localização',
        'footer-rights': 'Todos os direitos reservados.',
        
        // Additional content that needs translation
        'whatsapp-contact': 'Entre em contacto',
        'gallery-section-title': 'Nossos Trabalhos',
        'gallery-section-desc': 'Oferecemos uma ampla gama de móveis planejados para todos os ambientes da sua casa ou escritório, com design personalizado e acabamento impecável.',
        'why-choose-title': 'Por Que Escolher a Cogim',
        'why-choose-desc': 'Conheça os diferenciais que fazem da Cogim Cozinhas a melhor escolha para seus móveis planejados em Maputo.',
        'custom-manufacturing': 'Fabricação Sob Medida',
        'custom-manufacturing-desc': 'Todos os nossos móveis são fabricados sob medida, aproveitando cada centímetro do seu espaço.',
        'quality-materials': 'Materiais de Qualidade',
        'quality-materials-desc': 'Utilizamos apenas materiais de alta qualidade, garantindo durabilidade e acabamento impecável.',
        'specialized-team': 'Equipe Especializada',
        'specialized-team-desc': 'Nossa equipe de profissionais é altamente qualificada e experiente em projetos de móveis planejados.',
        'personalized-service': 'Atendimento Personalizado',
        'personalized-service-desc': 'Oferecemos atendimento personalizado desde o projeto até a instalação dos móveis.',
        'about-cogim-title': 'Sobre a Cogim Cozinhas',
        'about-cogim-p1': 'A Cogim Cozinhas é uma empresa especializada na fabricação de móveis planejados sob medida em Maputo, Moçambique. Com anos de experiência no mercado, nos destacamos pela qualidade dos nossos produtos e excelência no atendimento.',
        'about-cogim-p2': 'Nossa missão é transformar ambientes através de móveis funcionais e esteticamente agradáveis, sempre respeitando as necessidades e preferências dos nossos clientes.',
        '3d-projects': 'Projetos 3D',
        'quality-guarantee': 'Garantia de Qualidade',
        'professional-installation': 'Instalação Profissional',
        'specialized-aftersales': 'Pós-venda Especializado',
        'contact-us-btn': 'Fale Conosco',
        'location-title': 'Nossa Localização',
        'location-desc': 'Visite nossa loja em Maputo e conheça pessoalmente nossos produtos e serviços.',
        'how-to-get-there': 'Como Chegar',
        'company-desc': 'Especialistas em móveis planejados sob medida para todos os ambientes da sua casa ou escritório.',
        'footer-kitchen': 'Cozinha',
        'footer-bathroom': 'Casa de Banho',
        'footer-wardrobe': 'Guarda-roupa',
        'footer-ceiling': 'Teto Falso',
        'footer-racks': 'Racks',
        'footer-diverse': 'Diversos',
        'footer-home': 'Início',
        'footer-products': 'Produtos',
        'footer-quick-links': 'Links Rápidos',
        'footer-gallery': 'Galeria',
        'footer-contact-link': 'Contacto',
        'working-hours-mon-fri': 'Segunda a Sexta: 8h às 17h',
        'working-hours-sat': 'Sábado: 9h às 13h',
        'footer-copyright': '© 2025 Cogim Cozinhas. Todos os direitos reservados.',
        'footer-terms': 'Termos de Serviço',
        'footer-privacy': 'Política de Privacidade'
    },
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-gallery': 'Gallery',
        'nav-about': 'About Cogim Kitchens',
        'nav-location': 'Location',
        
        // Homepage - Hero
        'hero-title': 'Superior Quality Custom Furniture',
        'hero-subtitle': 'We turn your dreams into reality with unique and personalized furniture',
        'hero-cta': 'View Gallery',
        'hero-btn-gallery': 'View Gallery',
        'hero-btn-contact': 'Get in Touch',
        
        // Sections
        'categories-title': 'Our Specialties',
        'categories-subtitle': 'We create unique furniture for every room in your home',
        
        // Categories
        'category-kitchens': 'Planned Kitchens',
        'category-kitchens-desc': 'Functional and elegant kitchens, designed to optimize space',
        'category-closets': 'Custom Wardrobes',
        'category-closets-desc': 'Personalized wardrobes with planned internal divisions',
        'category-ceiling': 'False Plaster Ceiling',
        'category-ceiling-desc': 'False ceiling projects that enhance ambient lighting',
        'category-bathroom': 'Bathroom',
        'category-bathroom-desc': 'Bathroom furniture resistant to humidity',
        'category-racks': 'Racks',
        'category-racks-desc': 'Racks and shelves that transform your living room',
        'category-beds': 'Beds',
        'category-beds-desc': 'Custom beds that combine comfort and design',
        'category-furniture': 'Chairs, Sofas and Tables',
        'category-furniture-desc': 'Furniture that completes your spaces with elegance',
        
        // Buttons
        'btn-view-more': 'View More',
        'btn-previous': 'Previous',
        'btn-next': 'Next',
        'view-full-gallery': 'View Full Gallery',
        
        // Gallery
        'gallery-title': 'Image Gallery',
        'gallery-subtitle': 'Explore all our work. Use the checkboxes to filter by category.',
        'categories-filter': 'Categories',
        'filter-all': 'All',
        'filter-kitchens': 'Kitchens',
        'filter-closets': 'Wardrobes',
        'filter-wardrobes': 'Wardrobe',
        'filter-ceiling': 'False Ceiling',
        'filter-bathroom': 'Bathroom',
        'filter-racks': 'Racks',
        'filter-beds': 'Beds',
        'filter-furniture': 'Chairs, Sofas and Tables',
        
        // Subcategories
        'sub-with-counter': 'With Counter',
        'sub-peninsula': 'Peninsula',
        'sub-island': 'Island',
        'sub-custom': 'Custom',
        'sub-with-mirror': 'With Mirror',
        'sub-sliding-door': 'Sliding Door',
        'sub-wardrobes': 'Wardrobes',
        
        // Pagination
        'page-info': 'Page {current} of {total} - Showing {start}-{end} of {total_items} images',
        'no-images': 'No images found for the selected categories.',
        'select-category': 'Select a category to view images.',
        
        // Footer
        'footer-about': 'About Cogim',
        'footer-about-text': 'Specialists in custom furniture for over 10 years, creating unique solutions for each client.',
        'footer-services': 'Services',
        'footer-contact': 'Contact',
        'footer-rights': 'All rights reserved.',
        
        // Additional content that needs translation
        'whatsapp-contact': 'Contact us',
        'gallery-section-title': 'Our Work',
        'gallery-section-desc': 'We offer a wide range of custom furniture for all environments in your home or office, with personalized design and impeccable finishing.',
        'why-choose-title': 'Why Choose Cogim',
        'why-choose-desc': 'Learn about the advantages that make Cogim Kitchens the best choice for your custom furniture in Maputo.',
        'custom-manufacturing': 'Custom Manufacturing',
        'custom-manufacturing-desc': 'All our furniture is custom-made, making the most of every inch of your space.',
        'quality-materials': 'Quality Materials',
        'quality-materials-desc': 'We use only high-quality materials, ensuring durability and impeccable finishing.',
        'specialized-team': 'Specialized Team',
        'specialized-team-desc': 'Our team of professionals is highly qualified and experienced in custom furniture projects.',
        'personalized-service': 'Personalized Service',
        'personalized-service-desc': 'We offer personalized service from design to furniture installation.',
        'about-cogim-title': 'About Cogim Kitchens',
        'about-cogim-p1': 'Cogim Kitchens is a company specialized in manufacturing custom furniture in Maputo, Mozambique. With years of experience in the market, we stand out for the quality of our products and excellence in service.',
        'about-cogim-p2': 'Our mission is to transform environments through functional and aesthetically pleasing furniture, always respecting the needs and preferences of our clients.',
        '3d-projects': '3D Projects',
        'quality-guarantee': 'Quality Guarantee',
        'professional-installation': 'Professional Installation',
        'specialized-aftersales': 'Specialized After-sales',
        'contact-us-btn': 'Contact Us',
        'location-title': 'Our Location',
        'location-desc': 'Visit our store in Maputo and personally get to know our products and services.',
        'how-to-get-there': 'How to Get There',
        'company-desc': 'Specialists in custom furniture for all environments in your home or office.',
        'footer-kitchen': 'Kitchen',
        'footer-bathroom': 'Bathroom',
        'footer-wardrobe': 'Wardrobe',
        'footer-ceiling': 'False Ceiling',
        'footer-racks': 'Racks',
        'footer-diverse': 'Miscellaneous',
        'footer-home': 'Home',
        'footer-products': 'Products',
        'footer-quick-links': 'Quick Links',
        'footer-gallery': 'Gallery',
        'footer-contact-link': 'Contact',
        'working-hours-mon-fri': 'Monday to Friday: 8am to 5pm',
        'working-hours-sat': 'Saturday: 9am to 1pm',
        'footer-copyright': '© 2025 Cogim Kitchens. All rights reserved.',
        'footer-terms': 'Terms of Service',
        'footer-privacy': 'Privacy Policy'
    }
};

// Idioma atual
let currentLanguage = 'pt';

// Função para traduzir texto
function translate(key, params = {}) {
    let text = translations[currentLanguage][key] || key;
    
    // Substituir parâmetros se existirem
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// Função para traduzir toda a página
function translatePage() {
    // Traduzir elementos com data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    // Traduzir placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Atualizar URL das páginas se necessário
    updatePageContent();
}

// Função para atualizar conteúdo específico da página
function updatePageContent() {
    // Se estivermos na página da galeria, atualizar conteúdo específico
    if (document.getElementById('galeria-categoria')) {
        updateGalleryContent();
    }
}

// Função para atualizar conteúdo da galeria
function updateGalleryContent() {
    // Atualizar título e descrição da galeria
    const tituloGaleria = document.getElementById('categoria-titulo');
    const descricaoGaleria = document.getElementById('categoria-descricao');
    
    if (tituloGaleria) {
        tituloGaleria.textContent = translate('gallery-title');
    }
    
    if (descricaoGaleria) {
        descricaoGaleria.textContent = translate('gallery-subtitle');
    }
    
    // Refiltrar imagens para atualizar paginação em novo idioma
    if (typeof filtrarImagens === 'function') {
        filtrarImagens();
    }
}

// Função para mudar idioma
// Função para mudar idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang; // Linha adicionada anteriormente

    // 1. Remove classes 'active' de TODOS os botões
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active', 'underline', 'font-bold');
    });
    
    // 2. CORREÇÃO: Encontra o botão e verifica se ele existe antes de adicionar a classe
    const activeBtn = document.querySelector(`.language-btn[onclick="changeLanguage('${lang}')"]`);
    
    // O erro anterior era aqui. Agora só executamos se o botão for encontrado:
    if (activeBtn) {
        activeBtn.classList.add('active', 'underline', 'font-bold');
    }

    // Traduzir página
    translatePage();
    
    // Salvar preferência no localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Inicializar idioma
document.addEventListener('DOMContentLoaded', function() {
    // Carregar idioma salvo ou usar português por padrão
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'pt';
    changeLanguage(savedLanguage);
});