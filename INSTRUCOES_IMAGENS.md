# 📸 INSTRUÇÕES PARA ADICIONAR IMAGENS À GALERIA

## 🗂️ Estrutura de Pastas

Coloque suas imagens nas seguintes pastas:

```
public/images/
├── cozinhas/
│   ├── americana/
│   ├── em L/
│   ├── em U/
│   ├── ilha/
│   ├── linear/
│   ├── paralela/
│   └── peninsula/
├── closets/
│   ├── casal/
│   ├── com porta de correr/
│   ├── espelho/
│   ├── infantil/
│   └── solteiro/
├── racks/
├── bathroom/
└── diverso/
```

## 🖼️ Formatos Suportados

- **JPG/JPEG** (recomendado)
- **PNG**
- **WEBP**

## 📐 Tamanhos Recomendados

- **Largura**: 800-1200px
- **Altura**: 600-800px
- **Proporção**: 4:3 ou 16:9
- **Tamanho**: Máximo 2MB por imagem

## 🔧 Como Adicionar Imagens

### Método 1: Editar o arquivo script.js

1. Abra o arquivo `script.js`
2. Encontre o array `trabalhos`
3. Adicione novas entradas seguindo este modelo:

```javascript
{
    src: "../public/images/cozinhas/americana/minha-cozinha.jpg",
    categoria: "cozinhas",
    titulo: "Minha Cozinha Americana",
    descricao: "Descrição da cozinha"
}
```

### Método 2: Usar a função JavaScript

```javascript
// Exemplo de como adicionar uma nova imagem
adicionarImagem(
    "../public/images/cozinhas/americana/nova-cozinha.jpg",
    "cozinhas",
    "Cozinha Americana Premium",
    "Design moderno com ilha central"
);
```

## 📝 Exemplos de Nomes de Arquivos

### Cozinhas:
- `cozinha-americana-01.jpg`
- `cozinha-em-l-moderna.jpg`
- `ilha-central-branca.jpg`

### Closets:
- `closet-casal-espelho.jpg`
- `closet-porta-correr.jpg`
- `closet-infantil-colorido.jpg`

### Racks:
- `rack-tv-suspenso.jpg`
- `rack-moderno-branco.jpg`

### Casas de Banho:
- `banheiro-moderno.jpg`
- `banheiro-pequeno.jpg`

## ⚡ Funcionalidades Incluídas

✅ **Filtros por Categoria**: Cozinhas, Closets, Racks, Casas de Banho
✅ **Modal com Zoom**: Clique na imagem para ver em tamanho grande
✅ **Navegação no Modal**: Setas para próxima/anterior
✅ **Design Responsivo**: Funciona em desktop e mobile
✅ **Animações Suaves**: Transições elegantes
✅ **Carregamento Lazy**: Imagens carregam conforme necessário
✅ **Tratamento de Erro**: Mostra logo se imagem não encontrada

## 🎨 Personalização

### Alterar Cores:
No arquivo `styles.css`, procure por:
- `#d4af37` (cor dourada dos botões)
- `#c4a037` (cor dourada hover)

### Alterar Tamanhos:
- `.galeria-item img { height: 250px; }` (altura das imagens)
- `.grid { gap: 20px; }` (espaço entre imagens)

## 🚀 Testando

1. Adicione algumas imagens nas pastas
2. Atualize o array `trabalhos` no `script.js`
3. Abra o `index.html` no navegador
4. Teste os filtros e o modal

## 🐛 Solução de Problemas

**Imagens não aparecem?**
- Verifique se o caminho está correto
- Certifique-se que a imagem existe na pasta
- Verifique se o nome do arquivo está correto (case-sensitive)

**Modal não abre?**
- Verifique se não há erros no console do navegador
- Certifique-se que o JavaScript está carregando

**Filtros não funcionam?**
- Verifique se a categoria no array está correta
- Certifique-se que os botões têm o onclick correto