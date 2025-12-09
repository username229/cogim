const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
const CONTAINER_NAME = "cogim-gallery";
const OUTPUT_FILE = "gallery_data.json";
const AZURE_BLOB_BASE_URL = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}`;

async function generateGalleryData() {
    if (!CONNECTION_STRING) return console.error("AZURE_STORAGE_CONNECTION_STRING não definido.");

    const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    const imagesData = [];
    const categoryMap = {}; // { categoriaPrincipal: Set<subcategorias> }

    for await (const blob of containerClient.listBlobsFlat()) {
        const fileName = blob.name;
        if (!fileName.match(/\.(jpe?g|png|gif)$/i)) continue;

        const parts = fileName.split('/');
        const categoria = parts[0] || 'desconhecida';
        const subcategoria = parts.length > 2 ? parts[1] : null;

        // Cria map de categorias/subcategorias
        if (!categoryMap[categoria]) categoryMap[categoria] = new Set();
        if (subcategoria) categoryMap[categoria].add(subcategoria);

        imagesData.push({
            file: fileName,
            categoria: categoria,
            subcategoria: subcategoria,
            photoUrl: AZURE_BLOB_BASE_URL + '/' + encodeURIComponent(fileName),
            categorias: subcategoria ? [categoria, subcategoria] : [categoria]
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagesData, null, 2));
    console.log(`✅ ${imagesData.length} imagens salvas em ${OUTPUT_FILE}`);

    // Gera filtros
    const filters = [{
        id: "tudo",
        nome_exibicao: "Tudo",
        valor_filtro: "",
        icone: "ri-layout-grid-line",
        tipo: "principal",
        cor: "indigo",
        subcategorias: []
    }];

    Object.entries(categoryMap).forEach(([categoria, subs]) => {
        const subcategories = Array.from(subs).map(sub => ({
            nome_exibicao: sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' '),
            valor_filtro: sub
        }));

        filters.push({
            id: categoria,
            nome_exibicao: categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, ' '),
            valor_filtro: categoria,
            icone: "ri-folder-line",
            tipo: "principal",
            cor: "blue",
            subcategorias: subcategories
        });
    });

    fs.writeFileSync('filter_config.json', JSON.stringify(filters, null, 2));
    console.log(`✅ Filtros gerados em filter_config.json`);
}

generateGalleryData();
