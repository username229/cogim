// =======================================================
// CONFIGURAÇÃO
// =======================================================

// !!! NOVO MAPA DE DADOS ESTRUTURADOS COM LINKS DIRETOS DAS IMAGENS !!!
// Agora o valor é um array de URLs de imagem, e não mais o nome da pasta.
const dadosPorCategoria = {
    // Links de exemplo (substitua pelos seus URLs reais)
    "cozinhas": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/554e9be3-b00c-4046-9641-0abec6add357.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/8fed6e6b-9a80-4b05-bd12-043631ba8f08.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/8fed6e6b-9a80-4b05-bd12-043631ba8f08_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_4362.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5831.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5837.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5842.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5843.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5844.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5845.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5846.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5847.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5848.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5849.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5852.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5853.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5855.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5856.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5857.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5858.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5862.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5863.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5868.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5871.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5874.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5875.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5884.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5885.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5886.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5887.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5897.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5898.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5900.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5901.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5902.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5903.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5904.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5904_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5905.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5905_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5906.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5907.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5908.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5911.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5912.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5913.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5914.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5915.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5916.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5925.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5937.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5942.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5944.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5945.JPG",

        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5977.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5978.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5979.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5980.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5981.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5982.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_5983.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6013.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6014.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6015.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6016.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6017.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6080.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6081.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6082.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6083.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6101.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6102.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6102.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6103.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6104.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6105.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6106.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6107.JPG",

        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6108.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6109.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6111.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6112.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6113.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6114.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6115.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6116.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6117.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6120.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6121.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6122.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6123.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6134.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_6137.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7412.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7412_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7414.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7415.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7416.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7423.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/IMG_7428.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cozinha/f47736d2-2beb-458c-977d-8867230e485e.JPG",

    ],
    "cozinha-bancada": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/33f5c65b-fa80-4894-9124-95abbc60c394.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_4363.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5823.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5824.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5825.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5825_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5827.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5835.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5883.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5921.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5930.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5931.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_5932.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_6105.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_6107.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_6115.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_6136.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bancada/bancada/IMG_6137.JPG",
    ],
    "cozinha-peninsula": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/12a8f2bf-f99f-4677-a462-393d52f96c03.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/3f1125d5-1f3e-412f-ab80-30935b9e1d0b.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/7701011f-baa2-4bbe-9d63-33d00f61255d.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5829.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5830.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5831.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5864.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5865.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5866.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5866_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5869.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_5870.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_6098.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_6099.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/IMG_6104.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/be5da201-d3a7-43b3-84d2-04d174ce9e5e.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/e6dd0c3c-888b-4d91-a251-1e583cb0c365.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/peninsula/f8c3c172-8935-4c7e-92cf-1652a9688608.JPG",
    ],
    "cozinha-ilha": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5918.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5919.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5920.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5930.JPG", 
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5931.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5932.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/ilha/IMG_5935.JPG",
    ],
    "guardafatos": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5819.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5820.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5821.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5876.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5894.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5895.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5896.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5933.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5972.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_5973.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6005.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6006.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6009.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6010.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6014.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6028.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6029.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6030.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6032.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6033.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6034.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6035.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6036.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6037.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6038.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6040.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6042.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6043.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6073.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6074.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6078.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6079.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6124.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_6125.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_7419.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/closet/IMG_7420.JPG",
    ],
    // Adicione todas as suas categorias e links aqui:
    "guardafato-portas-correr": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5800.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5801.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5802.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5803.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5879.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5881.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5974.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5975.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5976.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5989.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5990.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_5991.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_6004.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_6126.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorcorrer/closetdooorcorrer/IMG_6127.JPG",

    ],
    "guardafato-espelho": [
        "https://exemplo.com/fotos/closetdoorespelho/img-01.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorespelho/closetdoorespelho/IMG_6007.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorespelho/closetdoorespelho/IMG_6008.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorespelho/closetdoorespelho/IMG_6044.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorespelho/closetdoorespelho/IMG_6045.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closetdoorespelho/closetdoorespelho/IMG_6060.JPG",
    ],
    "tetofalso": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5888.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5889.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5890.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5891.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5892.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5893.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5959.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5961.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5962.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5963.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5964.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5965.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_5966.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6062.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6063.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6064.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6068.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6069.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6084.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6085.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6086.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6088.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6089.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6090.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6093.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_6101.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/closet/teto falso/IMG_7413.JPG",
       
    ],
    "casa-de-banho": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bathroom/IMG_5795.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bathroom/IMG_5796.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bathroom/IMG_5797.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bathroom/IMG_5798.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/bathroom/IMG_5799.JPG",
          ],
     "racks": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5804.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5805.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5806.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5807.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5808.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5809.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5810.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5811.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5812.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5813.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5828.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5882.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5938.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5939.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5940.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5941.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_5955.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6067.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6068.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6069.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6092.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6094.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/rack/rack/IMG_6095.JPG",
    ],
    "camas": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_5860.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_5860_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_5992.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_5993.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_6138.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cama/IMG_7427.JPG",
    ],
    "cadeiras-sofas-e-mesas": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5951.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5953.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5954.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5956.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5957.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5967.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5968.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5969.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5970.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5970_1.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5984.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5985.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5986.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5987.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5995.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5996.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5997.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5998.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_5999.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6001.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6003.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6013.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6020.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6021.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6022.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6023.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6046.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6047.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6048.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6049.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6050.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6051.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6052.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6053.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6054.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6055.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6056.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6057.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6058.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6059.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6139.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6140.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6141.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/cadeirasofacama/cadeirasofacama/IMG_6142.JPG",
    ],
    "customizado": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5843.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5977.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5978.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5979.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5980.JPG",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/customizado/customizado/IMG_5981.JPG",
    ],
    "diverso": [
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-19-59.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-19-59_1.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_1.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_10.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_11.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_2.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_3.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_4.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_5.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_6.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_7.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_8.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-00_9.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01_1.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01_2.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01_3.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01_4.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-22-20-01_5.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-23-43-10.jpg",
        "https://cogimfotos.blob.core.windows.net/cogim-gallery/diverso/diverso/PHOTO-2025-04-11-23-43-10_1.jpg",
        
    ],
    
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


function onComponentsReady(fn) {
    if (window.__componentsReady) {
        fn();
    } else {
        document.addEventListener("componentsLoaded", fn, { once: true });
    }
}


function toggleMenu() {
    const menuFiltros = document.getElementById("filtros-sidebar-menu");
    const backdrop = document.getElementById("menu-backdrop");
    const iconeSeta = document.getElementById("arrow-icon");

    if (!menuFiltros) {
        console.error("❌ Menu de filtros não encontrado!");
        return;
    }

    const isOpen = menuFiltros.classList.contains("filtros-sidebar-open");

    if (isOpen) {
        /* ===== FECHAR ===== */
        menuFiltros.classList.remove("filtros-sidebar-open");

        if (backdrop) {
            backdrop.classList.add("hidden");
        }

        if (iconeSeta) {
            iconeSeta.style.transform = "rotate(0deg)";
        }

        document.body.classList.remove("overflow-hidden");

    } else {
        /* ===== ABRIR ===== */
        menuFiltros.classList.add("filtros-sidebar-open");

        if (backdrop) {
            backdrop.classList.remove("hidden");
        }

        if (iconeSeta) {
            iconeSeta.style.transform = "rotate(180deg)";
        }

        /* Bloqueia scroll apenas no mobile */
        if (window.innerWidth < 1024) {
            document.body.classList.add("overflow-hidden");
        }
    }
}


function toggleDesktopSidebar() {
    const sidebar = document.getElementById("sidebar-menu");
    if (!sidebar) return;
    
    sidebar.classList.toggle("sidebar-closed-desktop");
    
    const toggleBtn = document.querySelector("#toggle-desktop-btn i");
    if (toggleBtn) {
        toggleBtn.classList.toggle("rotate-180");
    }
    
    console.log(`💻 Sidebar desktop ${sidebar.classList.contains("sidebar-closed-desktop") ? 'recolhida' : 'expandida'}`);
}

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

function mostrarLoading(show, progresso = null) {
    let spinner = document.getElementById("loading-spinner");
    
    // ... (restante da função é igual ao original)
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
// Renderizar Galeria (Sem alterações na lógica de renderização)
// =======================================================
function renderGaleria() {
    // ... (Conteúdo da função renderGaleria é o mesmo do original)
    const grid = document.getElementById("galeria-grid");
    if (!grid) {
        console.error("❌ Elemento 'galeria-grid' não encontrado!");
        return;
    }

    console.log(`🎨 Renderizando galeria com ${imagensAtuais.length} imagens...`);
    
    grid.innerHTML = "";

    if (imagensAtuais.length === 0) {
        console.warn("⚠️ Nenhuma imagem para renderizar");
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
                    <svg class="w-24 h-24 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xl font-bold mb-2">Nenhuma imagem encontrada</p>
                <p class="text-gray-500 mb-6">Selecione uma categoria ou adicione os links das fotos no código.</p>
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
    console.log(`📋 Primeira URL:`, slice[0]);

    slice.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-card group relative rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer bg-gray-100';
        div.style.minHeight = '200px';
        
        // Skeleton loader inicial
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader absolute inset-0';
        div.appendChild(skeleton);
        
        // Cria a imagem
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagem ${start + index + 1}`;
        img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 relative z-10';
        img.loading = 'lazy';
        
        console.log(`🖼️ Criando imagem ${start + index + 1}:`, url.substring(0, 80) + '...');
        
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
            console.log(`✅ Imagem ${start + index + 1} carregada com sucesso`);
            skeleton.remove();
            estatisticas.imagensCarregadas++;
            atualizarBarraProgresso();
        };
        
        // Se houver erro no carregamento
        img.onerror = function() {
            console.error(`❌ Erro ao carregar imagem ${start + index + 1}:`, url);
            estatisticas.errosCarregamento++;
            skeleton.remove();
            div.innerHTML = `
                <div class='flex flex-col items-center justify-center h-48 bg-gray-100 text-gray-400'>
                    <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <p class="text-xs">Erro ao carregar</p>
                    <p class="text-xs text-gray-300 mt-1">Imagem ${start + index + 1}</p>
                </div>`;
        };
        
        // Click para abrir modal
        div.onclick = () => abrirModal(start + index);
        
        div.appendChild(img);
        div.appendChild(overlay);
        grid.appendChild(div);
    });

    console.log(`✅ Grid renderizado com ${slice.length} cards`);
    
    renderPaginacao();
    atualizarEstatisticas();
}

// =======================================================
// Modal de visualização em tela cheia (Sem alterações)
// =======================================================
function abrirModal(indice) {
    // ... (Conteúdo da função abrirModal é o mesmo do original)
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
// Barra de progresso (Sem alterações)
// =======================================================
function atualizarBarraProgresso() {
    // ... (Conteúdo da função atualizarBarraProgresso é o mesmo do original)
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
// Painel de estatísticas (Sem alterações)
// =======================================================
function atualizarEstatisticas() {
    // ... (Conteúdo da função atualizarEstatisticas é o mesmo do original)
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
// Paginação (Sem alterações)
// =======================================================
function renderPaginacao() {
    // ... (Conteúdo da função renderPaginacao é o mesmo do original)
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
// 🟢 NOVO: Aplicar Filtros (Lógica de Carregamento Modificada)
// =======================================================
async function aplicarFiltros() {
    console.log("🔄 Aplicando filtros...");
    const inicioTempo = Date.now();
    
    mostrarLoading(true, "Carregando categorias...");

    let categoriasSelecionadasKeys = [];
    const tudo = document.getElementById("tudo");
    const tudoMarcado = tudo && tudo.checked;

    if (tudoMarcado) {
        // 🔑 REQUISITO: Se TUDO estiver marcado, obtenha todas as chaves (categorias)
        categoriasSelecionadasKeys = Object.keys(dadosPorCategoria);
    } else {
        // Pega as chaves das categorias e subcategorias marcadas
        document.querySelectorAll(".filtro-categoria:checked, .filtro-subcategoria:checked").forEach(c => {
            categoriasSelecionadasKeys.push(c.value);
        });
    }

    // Se nenhuma estiver marcada E o TUDO não existir/estiver desmarcado, carregamos tudo por padrão
    if (categoriasSelecionadasKeys.length === 0) {
         categoriasSelecionadasKeys = Object.keys(dadosPorCategoria);
    }

    categoriasSelecionadasKeys = [...new Set(categoriasSelecionadasKeys)];
    console.log(`🔑 Categorias a carregar:`, categoriasSelecionadasKeys);

    imagensAtuais = [];
    estatisticas = {
        totalImagens: 0,
        imagensCarregadas: 0,
        errosCarregamento: 0,
        tempoCarregamento: 0
    };

    // 💡 NOVO: Carrega as URLs DIRETAMENTE do mapa de dados, sem chamadas de rede.
    for (const key of categoriasSelecionadasKeys) {
        const urls = dadosPorCategoria[key] || [];
        imagensAtuais.push(...urls);
        console.log(`📦 Categoria ${key}: ${urls.length} imagens adicionadas`);
    }

    // Embaralha as imagens para evitar que a ordem fique sempre por categoria (Opcional)
    // imagensAtuais.sort(() => Math.random() - 0.5);

    estatisticas.totalImagens = imagensAtuais.length;
    estatisticas.tempoCarregamento = ((Date.now() - inicioTempo) / 1000).toFixed(2);


    paginaAtual = 1;
    mostrarLoading(false);
    
    // Força a renderização imediata
    setTimeout(() => {
        renderGaleria();
    }, 100);
}

function limparCache() {
    console.log("🗑️ Não há cache de rede para limpar. Reaplicando filtros...");
    aplicarFiltros();
}


if (window.__categoriaJSLoaded) {
    console.warn("⚠️ categoria.js já foi carregado — evitando duplicação");
} else {
    window.__categoriaJSLoaded = true;

    onComponentsReady(() => {
        console.log("🚀 Sistema Cogim Gallery v3.0 iniciado (componentes prontos)");

        // Backdrop do menu
        document.addEventListener("click", (e) => {
            if (e.target.id === "menu-backdrop") {
                toggleMenu();
            }
        });

        // Delegação de eventos para filtros
        document.addEventListener("change", (e) => {
            if (
                e.target.matches(".filtro-categoria") ||
                e.target.matches(".filtro-subcategoria") ||
                e.target.id === "tudo"
            ) {
                aplicarFiltros();
            }
        });

        // Atalhos de teclado
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) searchInput.focus();
            }
        });

        console.log("⏳ Carregando galeria inicial...");
        aplicarFiltros();
    });
}
