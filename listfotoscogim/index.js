const { BlobServiceClient } = require("@azure/storage-blob");
// IMPORTAR A CLASSE DE CREDENCIAL PADRÃO
const { DefaultAzureCredential } = require("@azure/identity");

// Função auxiliar para processar cada blob encontrado
function processBlob(blob, prefix) {
    const fullPath = blob.name;
    const name = fullPath.substring(fullPath.lastIndexOf('/') + 1); // Apenas o nome do arquivo final
    
    // Ignora a entrada se for apenas o nome da 'pasta' (prefixo)
    if (name.length === 0) return null;

    // Constrói a URL pública do Blob (IMPORTANTE: SUBSTITUIR PELO SEU ENDPOINT REAL)
    // Se o seu Blob Storage for público ou usar SAS, defina a URL base aqui.
    // Exemplo: https://cogimstorage.blob.core.windows.net
    const BLOB_BASE_URL = "https://cogimfotos.blob.core.windows.net"; 
    
    return {
        // Nome do arquivo (ex: 'minhafoto.jpg')
        name: name, 
        // Caminho completo (ex: 'cozinhas/ilha/minhafoto.jpg')
        fullPath: fullPath, 
        // A 'categoria' é o prefixo que o frontend usará (ex: 'cozinhas/ilha')
        categoria: prefix, 
        // A URL que o frontend usará para carregar a imagem
        url: `${BLOB_BASE_URL}/${process.env.CONTAINER_NAME_BLOB}/${fullPath}`,
        sizeBytes: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
    };
}


module.exports = async function (context, req) {
    context.log('Function Processando Filtros Múltiplos...');

    // O nome do container deve ser lido de uma variável de ambiente, por segurança
    const containerName = process.env.CONTAINER_NAME_BLOB || "cogim-gallery";

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; 
    
    // Certifique-se de que o nome da conta esteja disponível para evitar 500
    if (!accountName) {
        context.res = {
            status: 500,
            body: "O nome da Conta de Armazenamento não está configurado. Verifique o Service Connector."
        };
        return;
    }

    

    // LER OS FILTROS DO PARÂMETRO 'filters' NA QUERY STRING
    // Recebemos uma string separada por vírgulas (ex: "cozinhas,salas-de-estar/sofás")
    const filtersString = req.query.filters || '';
    
    // Divide a string em um array de prefixos ativos
    let activePrefixes = filtersString
        .split(',')
        .map(f => f.trim().toLowerCase())
        .filter(f => f.length > 0);

    // Se não houver filtros, assume-se que deve listar TUDO
    if (activePrefixes.length === 0) {
        // Usa uma string vazia como prefixo para listar todos os blobs do container
        activePrefixes = ['']; 
    }
    
    const allFiles = [];

    try {
        const credential = new DefaultAzureCredential();

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            credential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        // ITERA SOBRE CADA PREFIXO (FILTRO) ATIVO
        for (const prefix of activePrefixes) {
            
            // Assegura que o prefixo, se existir, termine em barra para listar o conteúdo
            const searchPrefix = prefix.length > 0 && !prefix.endsWith('/') ? prefix + '/' : prefix;

            // Listar blobs usando o prefixo
            for await (const blob of containerClient.listBlobsFlat({ prefix: searchPrefix })) {
                const fileData = processBlob(blob, prefix);
                if (fileData) {
                    allFiles.push(fileData);
                }
            }
        }

       context.res = {
            status: 200,
            body: {
                message: `Encontrados ${allFiles.length} arquivos para os filtros: ${activePrefixes.join(', ')}`,
                files: allFiles
            }
        };

    } catch (error) {
        context.log.error(`Erro ao processar blobs: ${error.message}`);
        context.res = {
            status: 500,
            body: `Erro no servidor ao buscar dados: ${error.message}`
        };
    }
};