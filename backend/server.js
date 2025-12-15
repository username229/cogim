// server.js (Versão Integrada ao Azure)
require('dotenv').config(); // Carrega o .env localmente
const express = require('express');
const path = require('path');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');
const PORT = process.env.PORT || 3000;
// ------------------------------------------
// 1. CONFIGURAÇÃO AZURE BLOB CLIENT
// ------------------------------------------
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// O URL base para as imagens (usado no frontend)
const AZURE_BLOB_BASE_URL = `https://${accountName}.blob.core.windows.net/${containerName}/`; 

let containerClient;

if (accountName && accountKey && containerName) {
    try {
        const sharedKeyCredential = new (require('@azure/storage-blob').StorageSharedKeyCredential)(
            accountName, 
            accountKey
        );
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        containerClient = blobServiceClient.getContainerClient(containerName);
        console.log('☁️ Conexão com Azure Blob Storage estabelecida.');
    } catch (error) {
        console.error("❌ ERRO: Falha ao inicializar o Azure Blob Client:", error.message);
        // Não encerra o servidor, mas a API do Azure falhará
    }
} else {
    console.warn("⚠️ Variáveis do Azure não configuradas. A API de Galeria (Azure) não funcionará.");
}

// ------------------------------------------
// 2. CONFIGURAÇÃO EXPRESS
// ------------------------------------------
const app = express();
app.use(cors()); // Permite acesso do frontend
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public'))); // Mantido para ativos locais não-Azure

// ------------------------------------------
// 3. ROTAS DE NAVEGAÇÃO
// ------------------------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'admin.html')));

// ------------------------------------------
// 4. API PARA OBTER DADOS DA GALERIA (AZURE)
// ------------------------------------------

/**
 * Mapeia o caminho do blob (categoria/subpasta/imagem.jpg) para o formato de resposta do frontend.
 * @param {string} filePath - Caminho do blob (ex: cozinhas/modernas/cozinha_ilha_1.jpg)
 * @returns {object|null} Objeto de dados da foto ou null se for um diretório.
 */
function mapBlobToPhoto(filePath) {
    if (filePath.endsWith('/') || !/\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)) {
        return null; // Ignorar diretórios e arquivos não-imagem
    }

    const parts = filePath.split('/');
    let categorySlug = parts[0]; 
    let photoUrl = AZURE_BLOB_BASE_URL + filePath;

    // Você precisará de uma lógica mais complexa para inferir 'subcategorias' 
    // ou passá-las diretamente do Azure, mas por enquanto, vamos simplificar:
    let subcategorySlug = parts.length > 2 ? parts[1] : categorySlug;
    
    // ATENÇÃO: Se as fotos estiverem DENTRO de uma subpasta, o categorySlug será o nome da primeira pasta.
    
    return {
        id: filePath, // Usar o path como ID único
        file: filePath,
        categoria: categorySlug,
        subcategorias: [subcategorySlug], // Use o nome da subpasta como subcategoria
        photoUrl: photoUrl
    };
}


app.get('/api/gallery-data', async (req, res) => {
    if (!containerClient) {
        return res.status(500).json({ error: 'Servidor Azure Blob não inicializado.' });
    }
    
    try {
        let photos = [];
        // listBlobsFlat lista todos os blobs, incluindo subpastas.
        const iter = containerClient.listBlobsFlat();

        for await (const blob of iter) {
            const photoData = mapBlobToPhoto(blob.name);
            if (photoData) {
                photos.push(photoData);
            }
        }
        
        // Formato final: Agrupa fotos por categoria para corresponder ao seu frontend
        const galleryData = {};
        
        photos.forEach(photo => {
            const slug = photo.categoria;
            if (!galleryData[slug]) {
                // Aqui você pode adicionar as informações de exibição da categoria
                galleryData[slug] = {
                    nome: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '), // Capitaliza a primeira letra para exibição
                    slug: slug,
                    fotos: []
                };
            }
            // Adiciona a URL completa da foto
            galleryData[slug].fotos.push(photo); 
        });


        // Transforma o objeto em um array de categorias
        const result = Object.values(galleryData);

        console.log(`🖼️ Sucesso: Carregadas ${photos.length} imagens do Azure.`);
        res.json(result);

    } catch (error) {
        console.error('❌ Erro ao listar blobs do Azure:', error);
        res.status(500).json({ error: 'Não foi possível carregar os dados da galeria do Azure.' });
    }
});


// ------------------------------------------
// 5. ROTAS DE INFORMAÇÃO E ESTATÍSTICAS (MANTIDAS)
// * Nota: Você deve reescrever /api/gallery-count para usar o Azure
// ------------------------------------------

// ... (Mantenha as rotas /api/system-info, /api/detect-accounts, /api/stats, /api/gallery-count)

// ATENÇÃO: Você precisa REESCREVER /api/gallery-count para usar a lógica do Azure
app.get('/api/gallery-count', async (req, res) => {
    if (!containerClient) return res.json({ count: 0 });
    
    try {
        const iter = containerClient.listBlobsFlat();
        let totalImages = 0;
        for await (const blob of iter) {
             if (mapBlobToPhoto(blob.name)) {
                totalImages++;
             }
        }
        res.json({ count: totalImages });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao contar imagens do Azure' });
    }
});
// ... (outras rotas)

// ------------------------------------------
// 6. INICIALIZAÇÃO DO SERVIDOR
// ------------------------------------------
app.listen(PORT, () => {
    // É CRÍTICO imprimir este log para saber que o servidor iniciou
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});