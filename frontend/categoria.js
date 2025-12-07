// URL Base do seu Azure Blob Storage Container.
const AZURE_BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery/";

// ENDPOINT SEGURO DO SEU BACKEND
const AZURE_API_ENDPOINT = "https://listfotoscogim-hwa0hegmfcd7hrh0.southafricanorth-01.azurewebsites.net/api/gallery-data";
// Variável global para armazenar todos os dados de imagem (a lista PLANA de URLs e metadados)
let galleryImages = [];

// ==================================================================================================================================
// FUNÇÕES DE CONTROLE DE LAYOUT
// ==================================================================================================================================

/**
 * Alterna a visibilidade do menu lateral (Sidebar) em dispositivos móveis.
 * Manipula o backdrop e a visibilidade da sidebar.
 */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const backdrop = document.getElementById('menu-backdrop');
    
    // Alterna a classe que move a sidebar para dentro/fora do ecrã
    sidebar.classList.toggle('translate-x-0');
    sidebar.classList.toggle('-translate-x-full');
    
    // Alterna a visibilidade do backdrop e permite/impede cliques
    backdrop.classList.toggle('hidden');
    backdrop.classList.toggle('pointer-events-auto');
    backdrop.classList.toggle('opacity-0');
    
    // Trava o scroll no body enquanto o menu estiver aberto
    document.body.classList.toggle('overflow-hidden');
}

/**
 * Alterna entre o estado expandido e recolhido da sidebar em desktop.
 */
function toggleDesktopSidebar() {
    const sidebar = document.getElementById('sidebar-menu');
    const icon = document.querySelector('#toggle-desktop-btn i');
    const titles = document.querySelectorAll('.sidebar-title');
    const textElements = document.querySelectorAll('.sidebar-text');

    // 1. Alterna a classe 'collapsed' na sidebar
    sidebar.classList.toggle('collapsed');
    
    // 2. Alterna as larguras via classes Tailwind
    if (sidebar.classList.contains('collapsed')) {
        // Estado Recolhido
        sidebar.style.width = '5rem'; 
        icon.classList.add('rotate-180');
        // Esconde o texto/títulos
        titles.forEach(el => el.classList.add('hidden'));
        textElements.forEach(el => el.classList.add('hidden'));
    } else {
        // Estado Expandido (Padrão)
        sidebar.style.width = '20rem'; 
        icon.classList.remove('rotate-180');
        // Mostra o texto/títulos
        titles.forEach(el => el.classList.remove('hidden'));
        textElements.forEach(el => el.classList.remove('hidden'));
    }
}


// ==================================================================================================================================
// FUNÇÕES DE DADOS E RENDERIZAÇÃO
// ==================================================================================================================================

/**
 * Faz a requisição ao seu Endpoint de Backend, obtém os dados e os achata (flatten).
 * 🔑 IMPLEMENTAÇÃO: Infere TODOS os slugs de pastas (categorias/subcategorias) a partir do URL do blob.
 * @returns {Promise<Array<object>>} Uma promessa que resolve para um array plano de objetos de foto.
 */
/**
 * 从Azure API获取并处理图片数据
 * 该函数异步获取图片数据，将其扁平化处理，并提取相关分类信息
 * @returns {Promise<Array>} 返回一个包含处理后图片数据的Promise，每个图片对象包含URL、分类、主分类和文件名
 */
async function fetchAndPrepareImageData() {
        // 使用fetch API调用Azure API端点获取数据
    try {
        const response = await fetch(AZURE_API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar dados da galeria. Status: ${response.status}`);
        }
        
        const categorizedData = await response.json();
        const flatImages = [];

        categorizedData.forEach(category => {
            const mainCategorySlug = category.slug; // Ex: 'cozinhas'

            category.fotos.forEach(photoUrl => {
                
                // --- LÓGICA ROBUSTA DE EXTRAÇÃO DE SLUGS DE PASTAS DO URL ---
                
                // 1. Remove a URL base (ex: 'cozinhas/modernas/ilhadas/foto.jpg')
                const path = photoUrl.replace(AZURE_BLOB_BASE_URL, '');
                
                // 2. Pega o caminho das pastas (ex: 'cozinhas/modernas/ilhadas')
                const folderPath = path.substring(0, path.lastIndexOf('/'));
                
                // 3. Cria um array de slugs. Filtra vazios.
                let imageSlugs = folderPath.split('/').filter(slug => slug.length > 0);
                
                // 4. Garante que o slug principal do seu backend e os slugs da pasta sejam incluídos
                const allSlugs = new Set([mainCategorySlug, ...imageSlugs]);
                
                // ----------------------------------------------------------------------
                
                flatImages.push({
                    photoUrl: photoUrl,
                    // Novo: array de todos os slugs de pastas/categorias
                    categorias: Array.from(allSlugs), 
                    // Mantém a categoria principal (slug) para placeholders, etc.
                    categoria: mainCategorySlug,
                    file: path.split('/').pop()
                });
            });
        });
        
        return flatImages;
        
    } catch (error) {
        console.error("Erro CRÍTICO ao buscar dados do Azure API. As imagens não serão carregadas.", error);
        return []; 
    }
}


/**
 * Cria o HTML para o card de imagem.
 * @param {object} image - Objeto de dados da imagem (agora deve ter .photoUrl, .categoria, .file e .categorias).
 * @returns {string} HTML do card.
 */
function createImageCard(image) {
    const imageUrl = image.photoUrl; 
    const shortFileName = (image.file || 'projeto-sem-nome').split('.')[0].replace(/_/g, ' '); 
    const placeholder = `https://placehold.co/400x300/e0e7ff/4338ca?text=Projeto+${image.categoria}`;

    return `
        <div class="image-card bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer" 
             data-categoria="${image.categoria}">
            <img 
                src="${imageUrl}" 
                alt="Projeto de ${image.categoria} ${shortFileName}" 
                class="w-full h-40 object-cover" 
                onerror="this.onerror=null; this.src='${placeholder}';"
            >
            <div class="p-3 text-center">
                <p class="text-sm font-semibold text-gray-800 truncate">${shortFileName.charAt(0).toUpperCase() + shortFileName.slice(1)}</p>
                <p class="text-xs text-indigo-500">${image.categoria.toUpperCase().replace('-', ' ')}</p>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------------------------------------------------------------------------------

/**
 * Alterna a visibilidade das subcategorias ao clicar na categoria principal.
 * @param {string} subcategoryId - ID da div das subcategorias (ex: 'cozinhas-sub')
 * @param {string} arrowId - ID do ícone de seta para rotação (ex: 'cozinhas-arrow')
 */
function toggleSubcategories(subcategoryId, arrowId) {
    const submenu = document.getElementById(subcategoryId);
    const arrow = document.getElementById(arrowId);

    if (submenu && arrow) {
        submenu.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    }
}


/**
 * Filtra e renderiza as imagens com base nos checkboxes ativos.
 * 🔑 IMPLEMENTAÇÃO: Usa a lógica OR em relação a todos os slugs inferidos da imagem.
 */
function filterAndRenderImages(allImages) {
    const grid = document.getElementById('galeria-grid');
    if (!grid) return;

    if (allImages.length === 0) {
         grid.innerHTML = '<p class="col-span-full text-center py-10 text-red-500 font-semibold">Falha ao carregar as imagens da galeria. Verifique as permissões do Azure e a conexão da API.</p>';
         return;
    }
    
    const activeFilters = [];
    
    // Obtém os VALORES (slugs) de TODOS os filtros ativos (Categoria e Subcategoria)
    document.querySelectorAll('.filtro-categoria:checked, .filtro-subcategoria:checked').forEach(checkbox => {
        activeFilters.push(checkbox.value);
    });

    const tudoChecked = document.getElementById('tudo')?.checked;
    
    // 1. Lógica para mostrar TUDO: Se "Tudo" estiver marcado
    if (tudoChecked) {
        const html = allImages.map(createImageCard).join('');
        grid.innerHTML = html || '<p class="col-span-full text-center py-10 text-gray-500">Nenhum projeto encontrado.</p>';
        return;
    }

    // 2. Se nenhum filtro estiver ativo (nem 'Tudo')
    if (activeFilters.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-10 text-gray-500">Por favor, selecione uma categoria ou a opção "Todas" para visualizar os projetos.</p>';
        return;
    }

    // 3. Aplica a filtragem com lógica OR (Mostra imagens que correspondam a QUALQUER filtro ativo)
    const filteredImages = allImages.filter(image => {
        // Verifica se PELO MENOS UM dos filtros ativos (filterSlug) 
        // está contido no array 'image.categorias' (que contém todos os slugs de pastas).
        return activeFilters.some(filterSlug => image.categorias.includes(filterSlug));
    });

    // Renderiza o resultado
    const html = filteredImages.map(createImageCard).join('');
    grid.innerHTML = html || '<p class="col-span-full text-center py-10 text-gray-500">Nenhum projeto encontrado para os filtros selecionados.</p>';
}


/**
 * Configura os event listeners para todos os checkboxes de filtro.
 */
function setupFilterListeners() {
    // Escuta mudanças em qualquer checkbox de filtro (Categoria ou Subcategoria)
    document.querySelectorAll('.filtro-categoria, .filtro-subcategoria').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            
            // Lógica para desmarcar 'Tudo' se outra categoria for selecionada, 
            // e vice-versa (melhora a UX)
            if (checkbox.id === 'tudo' && checkbox.checked) {
                // Se 'Tudo' for marcado, desmarque todos os outros
                document.querySelectorAll('.filtro-categoria:not(#tudo), .filtro-subcategoria').forEach(other => {
                    other.checked = false;
                });
            } else if (checkbox.id !== 'tudo' && checkbox.checked) {
                // Se qualquer outra categoria for marcada, desmarque 'Tudo'
                const tudoCheckbox = document.getElementById('tudo');
                if (tudoCheckbox) tudoCheckbox.checked = false;
            }
            
            filterAndRenderImages(galleryImages);
        });
    });

    // Removendo o listener duplicado para o 'tudo' que estava no seu código original, 
    // pois a lógica agora está unificada no listener acima.
}

/**
 * Mostra ou esconde o spinner de carregamento
 * @param {boolean} show - true para mostrar, false para esconder
 */
function toggleLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.toggle('hidden', !show);
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// INICIALIZAÇÃO DA GALERIA
// ----------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicia os Listeners de Filtro ANTES do carregamento dos dados.
    setupFilterListeners();
    
    // 2. Carrega os dados de imagem da API de forma assíncrona
    toggleLoading(true);
    try {
        galleryImages = await fetchAndPrepareImageData();
    } catch (error) {
        console.error("Falha na inicialização da galeria:", error);
    } finally {
        toggleLoading(false);
    }
    
    // 3. Renderiza as imagens iniciais
    // A lógica de filtragem mostrará 'Tudo' se a checkbox 'tudo' estiver marcada por padrão no HTML.
    filterAndRenderImages(galleryImages);
    
    // 4. Inicializa o estado da sidebar (para desktop)
    const sidebar = document.getElementById('sidebar-menu');
    sidebar.style.width = '20rem';
    sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-40', 'w-80', 'transform', '-translate-x-full', 'lg:translate-x-0', 'lg:static', 'lg:w-80', 'transition-all', 'duration-300', 'ease-in-out');
});