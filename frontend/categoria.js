// =======================================================
// CONFIGURAÇÃO
// =======================================================
const BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery";

// Mapa de categorias/subcategorias → pastas REAIS do Blob
const pastaPorCategoria = {
    // Cozinhas
    "cozinhas": "cozinha",
    "cozinha-bancada": "bancada",
    "cozinha-peninsula": "peninsula",
    "cozinha-ilha": "ilha",

    // Guarda-fatos
    "guardafatos": "closet",
    "guardafato-portas-correr": "closetdoorcorrer",
    "guardafato-espelho": "closetdoorespelho",

    // Simples
    "tetofalso": "teto-falso",
    "casa-de-banho": "bathroom",
    "racks": "rack",
    "camas": "cama",
    "cadeiras-sofas-e-mesas": "cadeirasofacama",

    "customizado": "customizado",
    "diverso": "diverso"
};

// Lista manual de imagens por pasta (SOLUÇÃO TEMPORÁRIA)
// Esta é a solução mais simples se você não conseguir listar via API
const imagensPorPasta = {
    "cozinha": [
        `${BLOB_BASE_URL}/cozinha/img1.jpg`,
        `${BLOB_BASE_URL}/cozinha/img2.jpg`,
        // Adicione todas as suas imagens aqui
    ],
    "bancada": [
        `${BLOB_BASE_URL}/bancada/img1.jpg`,
        // Continue para todas as pastas...
    ],
    // ... continue para todas as pastas
};

// Variáveis globais
let imagensAtuais = [];
let paginaAtual = 1;
const itensPorPagina = 20;

// =======================================================
// SOLUÇÃO 1: Listar via API REST (requer CORS configurado)
// =======================================================
async function listarImagensBlob(pasta) {
    try {
        // URL correta da API REST do Azure
        const url = `${BLOB_BASE_URL}?restype=container&comp=list&prefix=${pasta}/`;

        console.log("Tentando listar:", url);

        const resp = await fetch(url);
        
        if (!resp.ok) {
            console.error("Erro ao listar Blob:", resp.status, resp.statusText);
            console.error("URL tentada:", url);
            
            // Se der erro 403 ou CORS, use a lista manual
            console.warn("Usando lista manual de imagens para:", pasta);
            return imagensPorPasta[pasta] || [];
        }

        const xml = await resp.text();
        const nomes = [...xml.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]);

        return nomes.map(name => `${BLOB_BASE_URL}/${name}`);
    } catch (error) {
        console.error("Erro CORS ou de rede:", error);
        console.warn("Usando lista manual de imagens para:", pasta);
        return imagensPorPasta[pasta] || [];
    }
}

// =======================================================
// SOLUÇÃO 2: Lista manual de imagens (SEM necessidade de API)
// =======================================================
function listarImagensManual(pasta) {
    // Retorna as imagens da lista manual
    return imagensPorPasta[pasta] || [];
}

// =======================================================
// Loading Spinner
// =======================================================
function mostrarLoading(show) {
    const spinner = document.getElementById("loading-spinner");
    if (!spinner) return;
    spinner.classList.toggle("hidden", !show);
}

// =======================================================
// Renderizar Galeria
// =======================================================
function renderGaleria() {
    const grid = document.getElementById("galeria-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (imagensAtuais.length === 0) {
        grid.innerHTML = `
            <p class="col-span-full text-center text-gray-500 py-10">
                Nenhuma imagem encontrada.
            </p>`;
        return;
    }

    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    const slice = imagensAtuais.slice(start, end);

    slice.forEach(url => {
        grid.innerHTML += `
            <div class="rounded-lg shadow-md overflow-hidden hover:scale-105 transition border border-gray-200">
                <img src="${url}" 
                     class="w-full h-48 object-cover"
                     onerror="this.parentElement.style.display='none'"
                     loading="lazy"/>
            </div>`;
    });

    renderPaginacao();
}

// =======================================================
// Paginação
// =======================================================
function renderPaginacao() {
    const total = Math.ceil(imagensAtuais.length / itensPorPagina);
    const pag = document.getElementById("paginacao-container");
    if (!pag) return;

    pag.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        pag.innerHTML += `
            <button onclick="irParaPagina(${i})"
                class="px-4 py-2 rounded-lg border ${i === paginaAtual ? "bg-indigo-600 text-white" : "bg-white text-gray-700"} shadow">
                ${i}
            </button>`;
    }
}

function irParaPagina(p) {
    paginaAtual = p;
    renderGaleria();
}

// =======================================================
// Aplicar Filtros (CORRIGIDO)
// =======================================================
async function aplicarFiltros() {
    mostrarLoading(true);

    let selecionadas = [];

    // Verifica se "Tudo" está marcado
    const tudo = document.getElementById("tudo");
    const tudoMarcado = tudo && tudo.checked;

    if (tudoMarcado) {
        // Se "Tudo" estiver marcado, pega todas as pastas
        selecionadas = Object.values(pastaPorCategoria);
    } else {
        // Categorias gerais
        document.querySelectorAll(".filtro-categoria:checked").forEach(c => {
            if (pastaPorCategoria[c.value]) {
                selecionadas.push(pastaPorCategoria[c.value]);
            }
        });

        // Subcategorias
        document.querySelectorAll(".filtro-subcategoria:checked").forEach(s => {
            if (pastaPorCategoria[s.value]) {
                selecionadas.push(pastaPorCategoria[s.value]);
            }
        });
    }

    // Se nada foi selecionado, mostra todas por padrão
    if (selecionadas.length === 0) {
        selecionadas = Object.values(pastaPorCategoria);
    }

    imagensAtuais = [];

    // Carregar todas pastas selecionadas
    for (const pasta of selecionadas) {
        const imgs = await listarImagensBlob(pasta);
        imagensAtuais.push(...imgs);
    }

    console.log("Total de imagens carregadas:", imagensAtuais.length);

    paginaAtual = 1;
    mostrarLoading(false);
    renderGaleria();
}

// =======================================================
// Sidebar (Mobile e Desktop)
// =======================================================
function toggleMenu() {
    const sidebar = document.getElementById("sidebar-menu");
    const backdrop = document.getElementById("menu-backdrop");

    sidebar.classList.toggle("-translate-x-full");
    backdrop.classList.toggle("hidden");
    backdrop.classList.toggle("opacity-0");
    document.body.classList.toggle("overflow-hidden");
}

function toggleDesktopSidebar() {
    const sidebar = document.getElementById("sidebar-menu");
    sidebar.classList.toggle("collapsed");
}

// =======================================================
// Alternar Visibilidade das Subcategorias
// =======================================================
function toggleSubcategories(subContainerId, arrowId) {
    const subContainer = document.getElementById(subContainerId);
    const arrow = document.getElementById(arrowId);

    if (subContainer) {
        subContainer.classList.toggle("hidden");
    }

    if (arrow) {
        arrow.classList.toggle("rotate-180");
    }
}

// =======================================================
// Início e Listeners de Filtro
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os checkboxes de filtro
    const filterCheckboxes = document.querySelectorAll(
        ".filtro-categoria, .filtro-subcategoria, #tudo"
    );

    // Anexa a função aplicarFiltros ao evento 'change' de cada checkbox
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", aplicarFiltros);
    });
    
    // Aplica os filtros iniciais
    aplicarFiltros();
});