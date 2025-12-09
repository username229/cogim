// =======================================================
// CONFIGURAÇÃO: Mapeamento de categorias → pastas do Blob
// =======================================================

const blobBaseUrl = "YOUR_BLOB_URL"; 
// EXEMPLO: "https://cogimfotos.blob.core.windows.net/imagens"

// Mapa de categorias e subcategorias para pastas reais
const pastaPorCategoria = {
    "cozinhas": "cozinha",
    "cozinha-bancada": "bancada",
    "cozinha-peninsula": "peninsula",
    "cozinha-ilha": "ilha",

    "guardafatos": "closet",
    "guardafato-portas-correr": "closetdoorcorrer",
    "guardafato-espelho": "closetdoorespelho",

    "tetofalso": "teto-falso",
    "casa-de-banho": "bathroom",
    "racks": "rack",
    "camas": "cama",
    "cadeiras-sofas-e-mesas": "cadeirasofacama",

    "diverso": "diverso",
    "customizado": "customizado"
};

let imagensAtuais = [];
let paginaAtual = 1;
const imagensPorPagina = 20;

// ================================================
// 1. CLIQUE NAS CATEGORIAS
// ================================================

document.addEventListener("change", async function (e) {
    if (e.target.classList.contains("filtro-categoria") || 
        e.target.classList.contains("filtro-subcategoria") || 
        e.target.id === "tudo") {

        await aplicarFiltros();
    }
});

// ================================================
// 2. APLICAR FILTROS
// ================================================

async function aplicarFiltros() {
    mostrarLoading(true);

    const filtros = obterCategoriasSelecionadas();
    imagensAtuais = [];

    if (filtros.length === 0 || filtros.includes("tudo")) {
        imagensAtuais = await carregarTodasImagens();
    } else {
        for (const categoria of filtros) {
            const pasta = pastaPorCategoria[categoria];
            if (pasta) {
                const imagens = await listarImagensBlob(pasta);
                imagensAtuais.push(...imagens);
            }
        }
    }

    paginaAtual = 1;
    renderizarGaleria();
    mostrarLoading(false);
}

// ================================================
// 3. OBTER CATEGORIAS SELECIONADAS
// ================================================

function obterCategoriasSelecionadas() {
    const selecionadas = [];

    if (document.getElementById("tudo").checked) {
        return ["tudo"];
    }

    document.querySelectorAll(".filtro-categoria:checked").forEach(c => {
        selecionadas.push(c.value);
    });

    document.querySelectorAll(".filtro-subcategoria:checked").forEach(s => {
        selecionadas.push(s.value);
    });

    return selecionadas;
}

// ================================================
// 4. LISTAR IMAGENS DO BLOB POR PASTA
// ================================================

async function listarImagensBlob(pasta) {
    const url = `${blobBaseUrl}?restype=container&comp=list&prefix=${pasta}/`;

    const resposta = await fetch(url);
    const xml = await resposta.text();

    const arquivos = [...xml.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]);
    
    return arquivos.map(a => `${blobBaseUrl}/${a}`);
}

// ================================================
// 5. CARREGAR TODAS IMAGENS DE TODAS PASTAS
// ================================================

async function carregarTodasImagens() {
    let todas = [];
    for (const pasta of Object.values(pastaPorCategoria)) {
        const imgs = await listarImagensBlob(pasta);
        todas.push(...imgs);
    }
    return todas;
}

// ================================================
// 6. RENDERIZAR GALERIA COM PAGINAÇÃO
// ================================================

function renderizarGaleria() {
    const galeria = document.getElementById("galeria-grid");
    galeria.innerHTML = "";

    if (imagensAtuais.length === 0) {
        galeria.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Nenhuma imagem encontrada.</p>`;
        return;
    }

    const inicio = (paginaAtual - 1) * imagensPorPagina;
    const fim = inicio + imagensPorPagina;

    const imagensPagina = imagensAtuais.slice(inicio, fim);

    imagensPagina.forEach(url => {
        galeria.innerHTML += `
            <div class="rounded-lg shadow-md overflow-hidden hover:scale-105 transition border border-gray-200">
                <img src="${url}" class="w-full h-48 object-cover"/>
            </div>
        `;
    });

    renderizarPaginacao();
}

function renderizarPaginacao() {
    const totalPaginas = Math.ceil(imagensAtuais.length / imagensPorPagina);
    const pagContainer = document.getElementById("paginacao-container");

    pagContainer.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        pagContainer.innerHTML += `
            <button 
                onclick="mudarPagina(${i})"
                class="px-4 py-2 rounded-lg border ${i === paginaAtual ? "bg-indigo-600 text-white" : "bg-white text-gray-700"} shadow"
            >
                ${i}
            </button>
        `;
    }
}

function mudarPagina(pag) {
    paginaAtual = pag;
    renderizarGaleria();
}

// ================================================
// 7. LOADING SPINNER
// ================================================

function mostrarLoading(mostrar) {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.toggle("hidden", !mostrar);
}

// Inicializar carregando tudo
aplicarFiltros();
