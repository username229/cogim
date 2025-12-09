// generate_gallery_data.js

const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "cogim-gallery";
const OUTPUT_FILE = "gallery_data.json";

// Este mapeamento é CRÍTICO! Ele define como o script infere a categoria
// a partir do nome do ficheiro (ex: "cozinha_01.jpg" -> "cozinhas").
const CATEGORY_MAP = [
    { prefix: "cozinha", slug: "cozinhas" },
    { prefix: "guarda", slug: "guardafatos" },
    { prefix: "teto", slug: "tetofalso" },
    { prefix: "casa-de-banho", slug: "casa-de-banho" },
    { prefix: "rack", slug: "racks" },
    { prefix: "cama", slug: "camas" },
    // Adicione mais prefixos aqui se precisar
];

const AZURE_BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net/cogim-gallery";

async function generateGalleryData() {
    if (!CONNECTION_STRING) {
        console.error("Erro: AZURE_STORAGE_CONNECTION_STRING não está definida.");
        return;
    }

    try {
        console.log(`A ligar ao contentor ${CONTAINER_NAME}...`);
        
        const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
        
        let imagesData = [];
        
        for await (const blob of containerClient.listBlobsFlat()) {
            const fileName = blob.name;

            // Filtra por extensões de imagem comuns
            if (!fileName.match(/\.(jpe?g|png|gif)$/i)) {
                continue;
            }

            const primaryCategory = findPrimaryCategory(fileName);
            
            // Assume que a categoria primária é o único slug de filtro.
            const categoriesSlugs = primaryCategory ? [primaryCategory] : [];

            imagesData.push({
                file: fileName,
                categoria: primaryCategory || 'desconhecida',
                photoUrl: AZURE_BLOB_BASE_URL + encodeURIComponent(fileName),
                categorias: categoriesSlugs
            });
        }
        
        // Escreve o JSON gerado no ficheiro de saída
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagesData, null, 2));
        console.log(`\n✅ Sucesso! ${imagesData.length} imagens listadas e salvas em ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("\n❌ ERRO CRÍTICO ao gerar gallery_data.json:", error.message);
    }
}

function findPrimaryCategory(fileName) {
    const nameLower = fileName.toLowerCase();
    for (const map of CATEGORY_MAP) {
        if (nameLower.startsWith(map.prefix)) {
            return map.slug;
        }
    }
    // Retorno de fallback: usa a primeira palavra do nome do ficheiro
    return nameLower.split(/[-_\.]/)[0]; 
}

generateGalleryData();