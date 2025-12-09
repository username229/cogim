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
// Listar imagens do Blob Storage via API
// =======================================================
async function listarImagensBlob(pasta) {
    try {
        const url = `${BLOB_BASE_URL}?restype=container&comp=list&prefix=${pasta}/`;
        
        console.log(`🔍 Listando imagens da pasta: ${pasta}`);
        console.log(`📡 URL da requisição: ${url}`);
        
        const resp = await fetch(url);
        
        if (!resp.ok) {
            console.error(`❌ Erro HTTP ${resp.status}: ${resp.statusText}`);
            console.error(`💡 Verifique se o CORS está configurado corretamente no Azure`);
            return [];
        }

        const xml = await resp.text();
        
        // Parse do XML usando DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        
        // Busca todos os elementos <Name> no XML
        const nameElements = xmlDoc.getElementsByTagName("Name");
        const nomes = Array.from(nameElements).map(el => el.textContent);
        
        // Filtra apenas arquivos de imagem
        const imagensValidas = nomes.filter(nome => {
            const ext = nome.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        });

        console.log(`✅ Encontradas ${imagensValidas.length} imagens na pasta ${pasta}`);
        
        return imagensValidas.map(name => `${BLOB_BASE_URL}/${name}`);
        
    } catch (error) {
        console.error(`❌ Erro ao listar pasta ${pasta}:`, error);
        
        if (error.message.includes('CORS')) {
            console.error(`
🚫 ERRO DE CORS DETECTADO!

Para resolver:
1. Entre no Portal do Azure (portal.azure.com)
2. Vá até Storage Account → cogimfotos
3. No menu lateral: Settings → CORS
4. Aba "Blob service", adicione:
   - Allowed origins: *
   - Allowed methods: GET, HEAD, OPTIONS
   - Allowed headers: *
   - Exposed headers: *
   - Max age: 3600
5. Salve e aguarde 5-15 minutos
            `);
        }
        
        return [];
    }
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
    if (!grid) {
        console.error("❌ Elemento 'galeria-grid' não encontrado!");
        return;
    }

    // Limpa a galeria mas mantém o spinner
    const spinner = document.getElementById("loading-spinner");
    grid.innerHTML = "";
    if (spinner) {
        grid.appendChild(spinner);
    }

    if (imagensAtuais.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <i class="ri-image-line text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg font-semibold">Nenhuma imagem encontrada</p>
                <p class="text-gray-400 text-sm mt-2">Verifique se o CORS está configurado no Azure</p>
                <button onclick="aplicarFiltros()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    🔄 Tentar Novamente
                </button>
            </div>`;
        return;
    }

    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    const slice = imagensAtuais.slice(start, end);

    console.log(`📸 Mostrando ${slice.length} imagens (${start + 1} a ${Math.min(end, imagensAtuais.length)} de ${imagensAtuais.length})`);

    slice.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 border border-gray-200 cursor-pointer';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagem ${start + index + 1}`;
        img.className = 'w-full h-48 object-cover';
        img.loading = 'lazy';
        
        img.onerror = function() {
            console.warn(`⚠️ Erro ao carregar imagem: ${url}`);
            this.parentElement.innerHTML = `
                <div class='flex items-center justify-center h-48 bg-gray-100'>
                    <i class='ri-image-line text-4xl text-gray-300'></i>
                </div>`;
        };
        
        div.appendChild(img);
        grid.appendChild(div);
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

    if (total <= 1) return;

    // Botão Anterior
    if (paginaAtual > 1) {
        const btnPrev = document.createElement('button');
        btnPrev.onclick = () => irParaPagina(paginaAtual - 1);
        btnPrev.className = "px-4 py-2 rounded-lg border bg-white text-gray-700 shadow hover:bg-gray-100 transition";
        btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i> Anterior';
        pag.appendChild(btnPrev);
    }

    // Números das páginas
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
            const btn = document.createElement('button');
            btn.onclick = () => irParaPagina(i);
            btn.className = `px-4 py-2 rounded-lg border shadow transition ${
                i === paginaAtual 
                    ? "bg-indigo-600 text-white font-semibold" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
            }`;
            btn.textContent = i;
            pag.appendChild(btn);
        } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
            const span = document.createElement('span');
            span.className = "px-2 text-gray-400";
            span.textContent = "...";
            pag.appendChild(span);
        }
    }

    // Botão Próximo
    if (paginaAtual < total) {
        const btnNext = document.createElement('button');
        btnNext.onclick = () => irParaPagina(paginaAtual + 1);
        btnNext.className = "px-4 py-2 rounded-lg border bg-white text-gray-700 shadow hover:bg-gray-100 transition";
        btnNext.innerHTML = 'Próximo <i class="ri-arrow-right-s-line"></i>';
        pag.appendChild(btnNext);
    }
}

function irParaPagina(p) {
    paginaAtual = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderGaleria();
}

// =======================================================
// Aplicar Filtros
// =======================================================
async function aplicarFiltros() {
    console.log("🔄 Aplicando filtros...");
    mostrarLoading(true);

    let selecionadas = [];

    // Verifica se "Tudo" está marcado
    const tudo = document.getElementById("tudo");
    const tudoMarcado = tudo && tudo.checked;

    if (tudoMarcado) {
        console.log("✅ Filtro 'Tudo' selecionado - carregando todas as categorias");
        selecionadas = Object.values(pastaPorCategoria);
    } else {
        // Categorias gerais
        document.querySelectorAll(".filtro-categoria:checked").forEach(c => {
            if (pastaPorCategoria[c.value]) {
                console.log(`✅ Categoria: ${c.value} → pasta: ${pastaPorCategoria[c.value]}`);
                selecionadas.push(pastaPorCategoria[c.value]);
            }
        });

        // Subcategorias
        document.querySelectorAll(".filtro-subcategoria:checked").forEach(s => {
            if (pastaPorCategoria[s.value]) {
                console.log(`✅ Subcategoria: ${s.value} → pasta: ${pastaPorCategoria[s.value]}`);
                selecionadas.push(pastaPorCategoria[s.value]);
            }
        });
    }

    // Se nada foi selecionado, mostra todas por padrão
    if (selecionadas.length === 0) {
        console.log("ℹ️ Nenhum filtro selecionado - mostrando todas as categorias por padrão");
        selecionadas = Object.values(pastaPorCategoria);
    }

    // Remove duplicatas
    selecionadas = [...new Set(selecionadas)];
    console.log(`📁 Carregando ${selecionadas.length} pasta(s):`, selecionadas);

    imagensAtuais = [];

    // Carregar todas pastas selecionadas
    for (const pasta of selecionadas) {
        const imgs = await listarImagensBlob(pasta);
        imagensAtuais.push(...imgs);
    }

    console.log(`✅ TOTAL: ${imagensAtuais.length} imagens carregadas`);

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

    if (!sidebar || !backdrop) return;

    sidebar.classList.toggle("-translate-x-full");
    backdrop.classList.toggle("hidden");
    backdrop.classList.toggle("opacity-0");
    
    if (backdrop.classList.contains("hidden")) {
        backdrop.classList.add("pointer-events-none");
    } else {
        backdrop.classList.remove("pointer-events-none");
    }
    
    document.body.classList.toggle("overflow-hidden");
}

function toggleDesktopSidebar() {
    const sidebar = document.getElementById("sidebar-menu");
    if (!sidebar) return;
    
    sidebar.classList.toggle("collapsed");
    
    const toggleBtn = document.querySelector("#toggle-desktop-btn i");
    if (toggleBtn) {
        toggleBtn.classList.toggle("rotate-180");
    }
}

// =======================================================
// Alternar Subcategorias
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
// Fechar menu ao clicar no backdrop
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const backdrop = document.getElementById("menu-backdrop");
    if (backdrop) {
        backdrop.addEventListener("click", toggleMenu);
    }
});

// =======================================================
// Inicialização
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Sistema de galeria Cogim iniciado");
    console.log("📍 Blob Storage URL:", BLOB_BASE_URL);

    // Seleciona todos os checkboxes de filtro
    const filterCheckboxes = document.querySelectorAll(
        ".filtro-categoria, .filtro-subcategoria, #tudo"
    );

    console.log(`📋 ${filterCheckboxes.length} filtros encontrados`);

    // Anexa evento aos checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", aplicarFiltros);
    });
    
    // Carrega as imagens iniciais
    console.log("⏳ Carregando galeria inicial...");
    aplicarFiltros();
});