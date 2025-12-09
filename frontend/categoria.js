// URL Base do seu Azure Blob Storage Container.
const AZURE_BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery/";

// --- CONFIGURAÇÃO DE DADOS ---
const GALLERY_DATA_URL = "gallery_data.json";
const FILTER_CONFIG_URL = "filter_config.json";


// Variável global para armazenar todos os dados de imagem (a lista PLANA de URLs e metadados)
let galleryImages = [];

// REMOVIDO: O array FILTER_CONFIG_DATA foi removido, pois agora o conteúdo está no ficheiro JSON.

// ==================================================================================================================================
// FUNÇÕES DE CONTROLE DE LAYOUT
// ==================================================================================================================================

/**
 * Alterna a visibilidade do menu lateral (Sidebar) em dispositivos móveis.
 */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const backdrop = document.getElementById('menu-backdrop');
    
    sidebar.classList.toggle('translate-x-0');
    sidebar.classList.toggle('-translate-x-full');
    
    backdrop.classList.toggle('hidden');
    backdrop.classList.toggle('pointer-events-auto');
    backdrop.classList.toggle('opacity-0');
    
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

    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        sidebar.style.width = '5rem'; 
        icon.classList.add('rotate-180');
        titles.forEach(el => el.classList.add('hidden'));
        textElements.forEach(el => el.classList.add('hidden'));
    } else {
        sidebar.style.width = '20rem'; 
        icon.classList.remove('rotate-180');
        titles.forEach(el => el.classList.remove('hidden'));
        textElements.forEach(el => el.classList.remove('hidden'));
    }
}


// ==================================================================================================================================
// FUNÇÕES DE DADOS E RENDERIZAÇÃO
// ==================================================================================================================================

/**
 * Faz a requisição ao ficheiro JSON estático e obtém a lista plana de imagens.
 */
async function fetchAndPrepareImageData() {
    toggleLoading(true);
    
    try {
        const response = await fetch(GALLERY_DATA_URL);
        
        if (!response.ok) {
             throw new Error(`Falha ao carregar o ficheiro de dados: ${response.status}`);
        }
        
        const flatImages = await response.json(); 
        return flatImages;
        
    } catch (error) {
        console.error("Erro CRÍTICO ao buscar dados do ficheiro JSON.", error);
        return []; 
    } finally {
        toggleLoading(false);
    }
}


/**
 * Cria o HTML para o card de imagem. 
 */
function createImageCard(image) {
    // CORREÇÃO: Garante que image.categoria é uma string para evitar erro .toUpperCase
    const categoryName = image.categoria || 'desconhecida'; 
    const imageUrl = image.photoUrl; 
    const shortFileName = (image.file || 'projeto-sem-nome').split('.')[0].replace(/_/g, ' '); 
    const placeholder = `https://placehold.co/400x300/e0e7ff/4338ca?text=Projeto+${categoryName}`;

    return `
        <div class="image-card bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer" 
             data-categoria="${categoryName}">
            <img 
                src="${imageUrl}" 
                alt="Projeto de ${categoryName} ${shortFileName}" 
                class="w-full h-40 object-cover" 
                onerror="this.onerror=null; this.src='${placeholder}';"
            >
            <div class="p-3 text-center">
                <p class="text-sm font-semibold text-gray-800 truncate">${shortFileName.charAt(0).toUpperCase() + shortFileName.slice(1)}</p>
                <p class="text-xs text-indigo-500">${categoryName.toUpperCase().replace('-', ' ')}</p>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------------------------------------------------------------------------------

/**
 * Alterna a visibilidade das subcategorias ao clicar na categoria principal. 
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
 */
function filterAndRenderImages(allImages) {
    const grid = document.getElementById('galeria-grid');
    if (!grid) return;

    if (allImages.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center py-10 text-red-500 font-semibold">Falha ao carregar os dados da galeria. Verifique se o ficheiro gallery_data.json existe e está formatado corretamente.</p>';
        return;
    }
    
    const activeFilters = [];
    
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

    // 3. Aplica a filtragem com lógica OR
    const filteredImages = allImages.filter(image => {
        // CORREÇÃO: Usa (image.categorias || []) para evitar ReferenceError caso a chave falte
        return activeFilters.some(filterSlug => (image.categorias || []).includes(filterSlug));
    });

    const html = filteredImages.map(createImageCard).join('');
    grid.innerHTML = html || '<p class="col-span-full text-center py-10 text-gray-500">Nenhum projeto encontrado para os filtros selecionados.</p>';
}


/**
 * Configura os event listeners para todos os checkboxes de filtro.
 */
function setupFilterListeners() {
    // É importante chamar esta função SOMENTE DEPOIS que a sidebar for gerada dinamicamente.
    document.querySelectorAll('.filtro-categoria, .filtro-subcategoria').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            
            if (checkbox.id === 'tudo' && checkbox.checked) {
                document.querySelectorAll('.filtro-categoria:not(#tudo), .filtro-subcategoria').forEach(other => {
                    other.checked = false;
                });
            } else if (checkbox.id !== 'tudo' && checkbox.checked) {
                const tudoCheckbox = document.getElementById('tudo');
                if (tudoCheckbox) tudoCheckbox.checked = false;
            }
            
            filterAndRenderImages(galleryImages);
        });
    });
}

/**
 * Mostra ou esconde o spinner de carregamento 
 */
function toggleLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.toggle('hidden', !show);
    }
}

// ==================================================================================================================================
// FUNÇÕES PARA CONSTRUÇÃO DINÂMICA DA SIDEBAR (RESTAURADA)
// ==================================================================================================================================

/**
 * Faz o fetch da configuração dos filtros a partir do ficheiro JSON.
 * RESTAURADO: Usa fetch(FILTER_CONFIG_URL).
 */
async function fetchFilterConfig() {
    try {
        const response = await fetch(FILTER_CONFIG_URL); 
        if (!response.ok) {
            throw new Error(`Falha ao carregar a configuração de filtros: ${response.status}`);
        }
        return await response.json(); 
    } catch (error) {
        console.error("Erro CRÍTICO ao buscar configuração de filtros.", error);
        return [];
    }
}

/**
 * Gera o HTML para uma única subcategoria (checkbox).
 */
function createSubcategoryHtml(sub, categoryId, cor) {
    const corClass = `text-${cor || 'indigo'}-600`;
    return `
        <li class="pl-8 py-1">
            <label class="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 transition duration-150">
                <input type="checkbox" 
                       value="${sub.valor_filtro}" 
                       class="filtro-subcategoria rounded ${corClass} focus:ring-${cor || 'indigo'}-500"
                       data-parent="${categoryId}">
                <span class="text-sm sidebar-text">${sub.nome_exibicao}</span>
            </label>
        </li>
    `;
}

/**
 * Gera o HTML para uma categoria principal e suas subcategorias.
 */
function createCategoryHtml(category) {
    const hasSubcategories = category.subcategorias && category.subcategorias.length > 0;
    const arrowId = `arrow-${category.id}`;
    const submenuId = `submenu-${category.id}`;
    const corClass = `text-${category.cor}-600`;

    let html = `
        <li class="relative">
            <div class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition duration-150 rounded-lg">
                <label class="flex items-center space-x-3 w-full" ${category.id !== 'tudo' ? `for="${category.id}"` : ''}>
                    <i class="${category.icone} text-lg ${corClass}"></i>
                    <span class="font-semibold text-gray-800 sidebar-text sidebar-title">${category.nome_exibicao}</span>
                </label>
    `;

    // Botão de Toggle para subcategorias
    if (hasSubcategories) {
        html += `
            <button onclick="toggleSubcategories('${submenuId}', '${arrowId}')" class="p-1 rounded-full hover:bg-gray-200 transition duration-150" type="button">
                <i id="${arrowId}" class="ri-arrow-down-s-line transform transition-transform duration-300"></i>
            </button>
        `;
    }
    html += `</div>`; // Fim do flex container principal

    // Checkbox (posição absoluta à direita)
    html += `
        <label class="absolute right-3 top-3.5 flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" 
                   id="${category.id}"
                   value="${category.valor_filtro}" 
                   ${category.id === 'tudo' ? 'checked' : ''} 
                   class="filtro-categoria rounded ${corClass} focus:ring-${category.cor}-500">
        </label>
    `;

    // Subcategorias (escondidas por defeito)
    if (hasSubcategories) {
        const subcategoriesHtml = category.subcategorias.map(sub => createSubcategoryHtml(sub, category.id, category.cor)).join('');
        html += `
            <ul id="${submenuId}" class="submenu-list mt-1 space-y-1 hidden">
                ${subcategoriesHtml}
            </ul>
        `;
    }

    html += `</li>`;
    return html;
}

/**
 * Carrega a configuração e renderiza toda a sidebar de filtros.
 */
async function generateSidebarFilters() {
     const filterConfig = await fetchFilterConfig();   

    const ulList = document.getElementById('filter-list');
    
    if (!ulList) {
        console.error("Elemento #filter-list não encontrado no HTML.");
        return;
    }

    if (filterConfig.length > 0) {
        const filtersHtml = filterConfig.map(createCategoryHtml).join('');
        ulList.innerHTML = filtersHtml;
    } else {
        ulList.innerHTML = '<li class="p-3 text-red-500">Falha ao carregar filtros.</li>';
    }
}


// ----------------------------------------------------------------------------------------------------------------------------------
// INICIALIZAÇÃO DA GALERIA
// ----------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Constrói a sidebar de filtros dinamicamente
    await generateSidebarFilters(); 

    // 2. Inicia os Listeners de Filtro (AGORA os elementos existem no DOM)
    setupFilterListeners();
    
    // 3. Carrega os dados de imagem do ficheiro JSON
    toggleLoading(true);
    try {
        galleryImages = await fetchAndPrepareImageData();
    } catch (error) {
        console.error("Falha na inicialização da galeria:", error);
    } finally {
        toggleLoading(false);
    }
    
    // 4. Renderiza as imagens iniciais
    filterAndRenderImages(galleryImages);
    
    // 5. Inicializa o estado da sidebar
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) {
        sidebar.style.width = '20rem';
    }
}); 