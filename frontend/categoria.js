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

// Variáveis globais
let imagensAtuais = [];
let paginaAtual = 1;
const itensPorPagina = 20;

// =======================================================
// Função para listar arquivos do Blob de uma pasta real
// =======================================================
async function listarImagensBlob(pasta) {
    const url = `${BLOB_BASE_URL}?restype=container&comp=list&prefix=${pasta}/`;

    const resp = await fetch(url);
    if (!resp.ok) {
        console.error("Erro ao listar Blob:", resp.status, url);
        return [];
    }

    const xml = await resp.text();
    const nomes = [...xml.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]);

    return nomes.map(name => `${BLOB_BASE_URL}/${name}`);
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
                <img src="${url}" class="w-full h-48 object-cover"/>
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
// Aplicar Filtros
// =======================================================
async function aplicarFiltros() {
    mostrarLoading(true);

    let selecionadas = [];

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

    // Se "Tudo" está marcado
    const tudo = document.getElementById("tudo");
    if (tudo && tudo.checked) {
        selecionadas = Object.values(pastaPorCategoria);
    }
    
    // Se nada estiver selecionado e "Tudo" estiver desmarcado, lista todas as pastas por padrão
    // OU simplesmente não lista nada se for o caso
    if (selecionadas.length === 0 && (!tudo || !tudo.checked)) {
        // Neste caso, você pode decidir se quer mostrar TUDO ou NADA. 
        // Vou manter a lógica original: se nada foi marcado, não faça nada (imagensAtuais = []).
    }


    imagensAtuais = [];

    // Carregar todas pastas selecionadas
    for (const pasta of selecionadas) {
        const imgs = await listarImagensBlob(pasta);
        imagensAtuais.push(...imgs);
    }

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


// NOVO: Adicione esta função para alternar as subcategorias
// =======================================================
// Alternar Visibilidade das Subcategorias e Rotacionar Seta
// =======================================================
function toggleSubcategories(subContainerId, arrowId) {
    const subContainer = document.getElementById(subContainerId);
    const arrow = document.getElementById(arrowId);

    if (subContainer) {
        subContainer.classList.toggle("hidden");
    }

    if (arrow) {
        // Assume que 'rotate-180' é uma classe CSS que rotaciona o ícone
        arrow.classList.toggle("rotate-180");
    }
}


// NOVO: Altere esta seção para incluir Listeners de 'change'
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
    
    // Aplica os filtros iniciais (para carregar o estado padrão da galeria)
    aplicarFiltros();
});