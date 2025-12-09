// =======================================================
// CONFIGURAÇÃO
// =======================================================
const BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery";

// Mapa de categorias/subcategorias → pastas no Blob
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

  "customizado": "customizado",
  "diverso": "diverso"
};

let imagensAtuais = [];
let paginaAtual = 1;
const itensPorPagina = 20;

// =======================================================
// LISTAR ARQUIVOS DO BLOB (SEM / NO FINAL!)
// =======================================================
async function listarImagensBlob(pasta) {
  const url = `${BLOB_BASE_URL}?restype=container&comp=list&prefix=${pasta}`;

  console.log("🔎 Buscando Blob:", url);

  const resp = await fetch(url);

  if (!resp.ok) {
    console.error("❌ Erro Blob", resp.status, url);
    return [];
  }

  const xml = await resp.text();

  // Captura todos os nomes <Name>FOLDER/arquivo.jpg</Name>
  const nomes = [...xml.matchAll(/<Name>(.*?)<\/Name>/g)].map(m => m[1]);

  // Mantém apenas os arquivos dentro dessa pasta
  const filtrados = nomes.filter(n => n.startsWith(pasta + "/"));

  // Retorna URLs completas
  return filtrados.map(name => `${BLOB_BASE_URL}/${name}`);
}

// =======================================================
// Loading
// =======================================================
function mostrarLoading(show) {
  const spinner = document.getElementById("loading-spinner");
  if (!spinner) return;
  spinner.classList.toggle("hidden", !show);
}

// =======================================================
// Render da galeria
// =======================================================
function renderGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (imagensAtuais.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Nenhuma imagem encontrada.</p>`;
    return;
  }

  const start = (paginaAtual - 1) * itensPorPagina;
  const end = start + itensPorPagina;
  const slice = imagensAtuais.slice(start, end);

  slice.forEach(url => {
    grid.innerHTML += `
      <div class="rounded-lg shadow-md overflow-hidden hover:scale-105 transition border border-gray-200">
        <img src="${url}" class="w-full h-48 object-cover"/>
      </div>
    `;
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
      </button>
    `;
  }
}

function irParaPagina(p) {
  paginaAtual = p;
  renderGaleria();
}

// =======================================================
// Aplicar filtros
// =======================================================
async function aplicarFiltros() {
  mostrarLoading(true);

  const selecionadas = [];

  document.querySelectorAll(".filtro-categoria:checked").forEach(c => {
    if (pastaPorCategoria[c.value]) {
      selecionadas.push(pastaPorCategoria[c.value]);
    }
  });

  document.querySelectorAll(".filtro-subcategoria:checked").forEach(s => {
    if (pastaPorCategoria[s.value]) {
      selecionadas.push(pastaPorCategoria[s.value]);
    }
  });

  const tudo = document.getElementById("tudo");

  imagensAtuais = [];

  if (tudo && tudo.checked) {
    const pastas = Object.values(pastaPorCategoria);
    for (const p of pastas) {
      const imgs = await listarImagensBlob(p);
      imagensAtuais.push(...imgs);
    }
  } else {
    for (const p of selecionadas) {
      const imgs = await listarImagensBlob(p);
      imagensAtuais.push(...imgs);
    }
  }

  paginaAtual = 1;
  mostrarLoading(false);
  renderGaleria();
}

// =======================================================
// Inicialização
// =======================================================
document.addEventListener("DOMContentLoaded", async () => {
  await aplicarFiltros();
});
