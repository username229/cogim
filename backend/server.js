require('dotenv').config(); 
const express = require('express');
const path = require('path');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
// O Render injeta a porta automaticamente, mas usamos 3000 como padrão interno do Docker
const PORT = process.env.PORT || 3000;

// ------------------------------------------
// 1. CONFIGURAÇÃO AZURE BLOB CLIENT
// ------------------------------------------
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const AZURE_BLOB_BASE_URL = `https://${accountName}.blob.core.windows.net/${containerName}/`; 

let containerClient;

if (accountName && accountKey && containerName) {
    try {
        const { StorageSharedKeyCredential } = require('@azure/storage-blob');
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        containerClient = blobServiceClient.getContainerClient(containerName);
        console.log('☁️ Conexão com Azure Blob Storage estabelecida com sucesso.');
    } catch (error) {
        console.error("❌ ERRO: Falha ao inicializar o Azure Blob Client:", error.message);
    }
} else {
    console.warn("⚠️ Variáveis do Azure (ACCOUNT_NAME/KEY/CONTAINER) não encontradas no ambiente.");
}

// ------------------------------------------
// 2. MIDDLEWARES
// ------------------------------------------
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Backup caso o NGINX falhe ou para testes locais)
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ------------------------------------------
// 3. FUNÇÕES AUXILIARES
// ------------------------------------------
function mapBlobToPhoto(filePath) {
    if (filePath.endsWith('/') || !/\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)) {
        return null; 
    }

    const parts = filePath.split('/');
    let categorySlug = parts[0]; 
    let photoUrl = AZURE_BLOB_BASE_URL + filePath;
    let subcategorySlug = parts.length > 2 ? parts[1] : categorySlug;
    
    return {
        id: filePath,
        file: filePath,
        categoria: categorySlug,
        subcategorias: [subcategorySlug],
        photoUrl: photoUrl
    };
}

// ------------------------------------------
// 4. ROTAS DA API
// ------------------------------------------

// Endpoint principal da galeria
app.get('/api/gallery-data', async (req, res) => {
    if (!containerClient) {
        return res.status(503).json({ error: 'Servidor Azure Blob não configurado.' });
    }
    
    try {
        let photos = [];
        const iter = containerClient.listBlobsFlat();

        for await (const blob of iter) {
            const photoData = mapBlobToPhoto(blob.name);
            if (photoData) photos.push(photoData);
        }
        
        const galleryData = {};
        photos.forEach(photo => {
            const slug = photo.categoria;
            if (!galleryData[slug]) {
                galleryData[slug] = {
                    nome: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
                    slug: slug,
                    fotos: []
                };
            }
            galleryData[slug].fotos.push(photo); 
        });

        res.json(Object.values(galleryData));
    } catch (error) {
        console.error('❌ Erro ao listar blobs do Azure:', error);
        res.status(500).json({ error: 'Erro ao carregar galeria do Azure.' });
    }
});

// Endpoint de contagem para o Dashboard
app.get('/api/gallery-count', async (req, res) => {
    if (!containerClient) return res.json({ count: 0 });
    
    try {
        const iter = containerClient.listBlobsFlat();
        let totalImages = 0;
        for await (const blob of iter) {
             if (mapBlobToPhoto(blob.name)) totalImages++;
        }
        res.json({ count: totalImages });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao contar imagens' });
    }
});

// Endpoint de status do sistema (Útil para o Render Health Check)
app.get('/api/system-info', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        azureConnected: !!containerClient,
        timestamp: new Date()
    });
});

// ------------------------------------------
// 5. ROTAS DE NAVEGAÇÃO (Fallback)
// ------------------------------------------
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

// ------------------------------------------
// 6. INICIALIZAÇÃO
// ------------------------------------------
// Importante: '0.0.0.0' permite que o container receba conexões externas ao seu próprio IP
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
     Servidor Express Online!
     Porta: ${PORT}
    🔗URL Interna: http://backend:${PORT}
    __________________________________________
    `);
});