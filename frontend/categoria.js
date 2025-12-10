// =======================================================
// CONFIGURAÇÃO
// =======================================================
const BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery";

// Configuração de SAS Token (se disponível)
const SAS_TOKEN = "";

// Cache de imagens para performance
const cacheImagens = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Mapa de categorias/subcategorias → pastas REAIS do Blob
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

// Variáveis globais
let imagensAtuais = [];
let paginaAtual = 1;
const itensPorPagina = 20;
let imagemModalAtual = 0;

// Estatísticas de carregamento
let estatisticas = {
    totalImagens: 0,
    imagensCarregadas: 0,
    errosCarregamento: 0,
    tempoCarregamento: 0
};

// =======================================================
// Sistema de Cache Inteligente
// =======================================================
function obterDoCache(chave) {
    const item = cacheImagens.get(chave);
    if (!item) return null;
    
    const agora = Date.now();
    if (agora - item.timestamp > CACHE_DURATION) {
        cacheImagens.delete(chave);
        return null;
    }
    
    return item.dados;
}

function salvarNoCache(chave, dados) {
    cacheImagens.set(chave, {
        dados,
        timestamp: Date.now()
    });
}

// =======================================================
// 🔧 CORRIGIDO: Listar imagens do Blob Storage
// =======================================================
async function listarImagensBlob(pasta, tentativa = 1) {
    const maxTentativas = 3;
    
    // Verifica cache primeiro
    const chaveCache = `pasta_${pasta}`;
    const dadosCache = obterDoCache(chaveCache);
    if (dadosCache) {
        console.log(`💾 Cache hit para pasta: ${pasta}`);
        return dadosCache;
    }
    
    try {
        let url = `${BLOB_BASE_URL}?restype=container&comp=list&prefix=${pasta}/`;
        if (SAS_TOKEN) {
            url += `&${SAS_TOKEN}`;
        }
        
        console.log(`🔍 [Tentativa ${tentativa}/${maxTentativas}] Listando: ${pasta}`);
        
        const resp = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/xml, text/xml, */*'
            }
        });
        
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }

        const xml = await resp.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        
        // Verifica se houve erro no XML
        const erroXml = xmlDoc.querySelector('Error');
        if (erroXml) {
            const codigo = erroXml.querySelector('Code')?.textContent;
            const mensagem = erroXml.querySelector('Message')?.textContent;
            throw new Error(`Azure Blob Error: ${codigo} - ${mensagem}`);
        }
        
        const nameElements = xmlDoc.getElementsByTagName("Name");
        const nomes = Array.from(nameElements).map(el => el.textContent);
        
        const imagensValidas = nomes.filter(nome => {
            const ext = nome.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
        });

        console.log(`✅ ${imagensValidas.length} imagens em ${pasta}`);
        
        const urls = imagensValidas.map(name => {
            let imageUrl = `${BLOB_BASE_URL}/${name}`;
            if (SAS_TOKEN) {
                imageUrl += SAS_TOKEN;
            }
            return imageUrl;
        });
        
        // Salva no cache
        salvarNoCache(chaveCache, urls);
        
        return urls;
        
    } catch (error) {
        console.error(`❌ Erro na pasta ${pasta} (tentativa ${tentativa}):`, error);
        
        // Retry logic
        if (tentativa < maxTentativas) {
            const delay = Math.pow(2, tentativa) * 1000;
            console.log(`⏳ Aguardando ${delay/1000}s antes de tentar novamente...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return listarImagensBlob(pasta, tentativa + 1);
        }
        
        // Diagnóstico de erro
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            mostrarErroCORS();
        }
        
        return [];
    }
}

// =======================================================
// Modal de erro CORS
// =======================================================
function mostrarErroCORS() {
    const existe = document.getElementById('modal-erro-cors');
    if (existe) return;
    
    const modal = document.createElement('div');
    modal.id = 'modal-erro-cors';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl">
            <div class="flex items-start mb-4">
                <div class="flex-shrink-0 bg-red-100 rounded-full p-3">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">
                        Erro de CORS Detectado
                    </h3>
                    <p class="text-gray-600 mb-4">
                        As imagens não puderam ser carregadas devido a restrições de CORS no Azure Blob Storage.
                    </p>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p class="font-semibold text-blue-900 mb-2">📋 Solução (Azure Portal):</p>
                <ol class="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Acesse <a href="https://portal.azure.com" target="_blank" class="underline">portal.azure.com</a></li>
                    <li>Navegue até: Storage Account → cogimfotos</li>
                    <li>Menu lateral: Settings → Resource sharing (CORS)</li>
                    <li>Na aba "Blob service", configure:
                        <ul class="list-disc list-inside ml-6 mt-1 space-y-0.5">
                            <li>Allowed origins: <code class="bg-blue-100 px-1 rounded">*</code></li>
                            <li>Allowed methods: <code class="bg-blue-100 px-1 rounded">GET,HEAD,OPTIONS</code></li>
                            <li>Allowed headers: <code class="bg-blue-100 px-1 rounded">*</code></li>
                            <li>Exposed headers: <code class="bg-blue-100 px-1 rounded">*</code></li>
                            <li>Max age: <code class="bg-blue-100 px-1 rounded">3600</code></li>
                        </ul>
                    </li>
                    <li>Clique em "Save" e aguarde 5-15 minutos</li>
                </ol>
            </div>
            
            <div class="flex justify-end gap-3">
                <button onclick="document.getElementById('modal-erro-cors').remove()" 
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    Fechar
                </button>
                <button onclick="document.getElementById('modal-erro-cors').remove(); aplicarFiltros();" 
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    🔄 Tentar Novamente
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// =======================================================
// Loading Spinner
// =======================================================
function mostrarLoading(show, progresso = null) {
    let spinner = document.getElementById("loading-spinner");
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            spinner.className = 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50';
            document.body.appendChild(spinner);
        }
        
        spinner.classList.remove("hidden");
        spinner.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-3"></div>
                <p class="text-gray-600 font-medium">${progresso || 'Carregando...'}</p>
            </div>
        `;
    } else {
        if (spinner) {
            spinner.classList.add("hidden");
        }
    }
}

// =======================================================
// 🔧 CORRIGIDO: Renderizar Galeria (problema resolvido aqui!)
// =======================================================
function renderGaleria() {
    const grid = document.getElementById("galeria-grid");
    if (!grid) {
        console.error("❌ Elemento 'galeria-grid' não encontrado!");
        return;
    }

    grid.innerHTML = "";

    if (imagensAtuais.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
                    <svg class="w-24 h-24 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xl font-bold mb-2">Nenhuma imagem encontrada</p>
                <p class="text-gray-500 mb-6">Selecione uma categoria ou verifique as configurações do Azure</p>
                <button onclick="aplicarFiltros()" 
                        class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg">
                    🔄 Tentar Novamente
                </button>
            </div>`;
        return;
    }

    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    const slice = imagensAtuais.slice(start, end);

    console.log(`📸 Página ${paginaAtual}: mostrando ${slice.length} de ${imagensAtuais.length} imagens`);

    slice.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'group relative rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer bg-gray-100';
        div.style.minHeight = '200px';
        
        // Skeleton loader inicial
        const skeleton = document.createElement('div');
        skeleton.className = 'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse';
        div.appendChild(skeleton);
        
        // Cria a imagem
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagem ${start + index + 1}`;
        img.className = 'w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 relative z-10';
        img.loading = 'lazy';
        
        // Overlay com efeito hover
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center z-20';
        overlay.innerHTML = `
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
            </div>
        `;
        
        // Quando a imagem carregar
        img.onload = function() {
            skeleton.remove();
            estatisticas.imagensCarregadas++;
            atualizarBarraProgresso();
            console.log(`✅ Imagem carregada: ${start + index + 1}`);
        };
        
        // Se houver erro no carregamento
        img.onerror = function() {
            console.warn(`⚠️ Erro ao carregar: ${url}`);
            estatisticas.errosCarregamento++;
            skeleton.remove();
            div.innerHTML = `
                <div class='flex flex-col items-center justify-center h-48 bg-gray-100 text-gray-400'>
                    <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <p class="text-xs">Erro ao carregar</p>
                </div>`;
        };
        
        // Click para abrir modal
        div.onclick = () => abrirModal(start + index);
        
        div.appendChild(img);
        div.appendChild(overlay);
        grid.appendChild(div);
    });

    renderPaginacao();
    atualizarEstatisticas();
}

// =======================================================
// Modal de visualização em tela cheia
// =======================================================
function abrirModal(indice) {
    imagemModalAtual = indice;
    const url = imagensAtuais[indice];
    
    const modal = document.createElement('div');
    modal.id = 'modal-imagem';
    modal.className = 'fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) fecharModal();
    };
    
    modal.innerHTML = `
        <button onclick="fecharModal()" 
                class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition z-10">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        
        ${indice > 0 ? `
            <button onclick="navegarModal(-1)" 
                    class="absolute left-4 text-white text-4xl hover:text-gray-300 transition z-10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
        ` : ''}
        
        ${indice < imagensAtuais.length - 1 ? `
            <button onclick="navegarModal(1)" 
                    class="absolute right-4 text-white text-4xl hover:text-gray-300 transition z-10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        ` : ''}
        
        <div class="relative max-w-7xl max-h-full">
            <img src="${url}" 
                 alt="Imagem ${indice + 1}"
                 class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl">
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                ${indice + 1} / ${imagensAtuais.length}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleModalKeyboard);
}

function fecharModal() {
    const modal = document.getElementById('modal-imagem');
    if (modal) modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeyboard);
}

function navegarModal(direcao) {
    const novoIndice = imagemModalAtual + direcao;
    if (novoIndice >= 0 && novoIndice < imagensAtuais.length) {
        fecharModal();
        abrirModal(novoIndice);
    }
}

function handleModalKeyboard(e) {
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowLeft') navegarModal(-1);
    if (e.key === 'ArrowRight') navegarModal(1);
}

// =======================================================
// Barra de progresso
// =======================================================
function atualizarBarraProgresso() {
    let barra = document.getElementById('progress-bar');
    if (!barra) {
        barra = document.createElement('div');
        barra.id = 'progress-bar';
        barra.className = 'fixed top-0 left-0 w-full h-1 bg-gray-200 z-50';
        barra.innerHTML = '<div class="h-full bg-indigo-600 transition-all duration-300"></div>';
        document.body.appendChild(barra);
    }
    
    const progresso = estatisticas.totalImagens > 0 
        ? (estatisticas.imagensCarregadas / estatisticas.totalImagens) * 100 
        : 0;
    const barraInterna = barra.querySelector('div');
    if (barraInterna) {
        barraInterna.style.width = `${progresso}%`;
    }
    
    if (progresso >= 100) {
        setTimeout(() => {
            if (barra.parentNode) barra.remove();
        }, 500);
    }
}

// =======================================================
// Painel de estatísticas
// =======================================================
function atualizarEstatisticas() {
    let painel = document.getElementById('stats-panel');
    if (!painel) {
        painel = document.createElement('div');
        painel.id = 'stats-panel';
        painel.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-sm z-40 border border-gray-200';
        document.body.appendChild(painel);
    }
    
    painel.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="font-semibold">${imagensAtuais.length}</span>
                <span class="text-gray-500">imagens</span>
            </div>
            ${estatisticas.errosCarregamento > 0 ? `
                <div class="flex items-center gap-2 text-red-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>${estatisticas.errosCarregamento} erros</span>
                </div>
            ` : ''}
        </div>
    `;
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

    if (paginaAtual > 1) {
        const btnPrev = document.createElement('button');
        btnPrev.onclick = () => irParaPagina(paginaAtual - 1);
        btnPrev.className = "px-4 py-2 rounded-lg border bg-white text-gray-700 shadow hover:bg-gray-100 transition";
        btnPrev.innerHTML = '← Anterior';
        pag.appendChild(btnPrev);
    }

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

    if (paginaAtual < total) {
        const btnNext = document.createElement('button');
        btnNext.onclick = () => irParaPagina(paginaAtual + 1);
        btnNext.className = "px-4 py-2 rounded-lg border bg-white text-gray-700 shadow hover:bg-gray-100 transition";
        btnNext.innerHTML = 'Próximo →';
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
    const inicioTempo = Date.now();
    
    mostrarLoading(true, "Carregando categorias...");

    let selecionadas = [];
    const tudo = document.getElementById("tudo");
    const tudoMarcado = tudo && tudo.checked;

    if (tudoMarcado) {
        selecionadas = Object.values(pastaPorCategoria);
    } else {
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
    }

    if (selecionadas.length === 0) {
        selecionadas = Object.values(pastaPorCategoria);
    }

    selecionadas = [...new Set(selecionadas)];
    console.log(`📁 Carregando ${selecionadas.length} pasta(s):`, selecionadas);

    imagensAtuais = [];
    estatisticas = {
        totalImagens: 0,
        imagensCarregadas: 0,
        errosCarregamento: 0,
        tempoCarregamento: 0
    };

    // Carrega todas as pastas
    for (let i = 0; i < selecionadas.length; i++) {
        const pasta = selecionadas[i];
        mostrarLoading(true, `Carregando ${i + 1}/${selecionadas.length}: ${pasta}`);
        const imgs = await listarImagensBlob(pasta);
        imagensAtuais.push(...imgs);
        console.log(`📦 Pasta ${pasta}: ${imgs.length} imagens adicionadas`);
    }

    estatisticas.totalImagens = imagensAtuais.length;
    estatisticas.tempoCarregamento = ((Date.now() - inicioTempo) / 1000).toFixed(2);

    console.log(`✅ Total: ${imagensAtuais.length} imagens em ${estatisticas.tempoCarregamento}s`);

    paginaAtual = 1;
    mostrarLoading(false);
    
    // 🔧 CRÍTICO: Força a renderização imediata
    setTimeout(() => {
        renderGaleria();
    }, 100);
}

// =======================================================
// Limpar cache
// =======================================================
function limparCache() {
    cacheImagens.clear();
    console.log("🗑️ Cache limpo");
    aplicarFiltros();
}

// =======================================================
// Sidebar
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
    
    document.body.classList.