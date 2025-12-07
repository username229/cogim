# 🚀 Configuração Tailwind CSS + Node.js - Projeto Cogim

## 📋 O que foi configurado:

### ✅ **Node.js + Express Server**
- Servidor Express configurado na porta 3000
- Servindo arquivos estáticos do frontend
- API para listar pastas e imagens
- CORS habilitado

### ✅ **Tailwind CSS**
- Configuração completa do Tailwind
- Cores personalizadas da Cogim
- Componentes customizados
- Fonte Montserrat integrada

### ✅ **Scripts NPM**
- `npm run dev` - Desenvolvimento (CSS watch + servidor)
- `npm run build` - Build de produção
- `npm run serve` - Apenas o servidor

## 🛠️ Como usar:

### **1. Instalar dependências:**
```bash
cd c:\Users\25884\SoftwareEngJourney\cogim
npm install
```

### **2. Desenvolvimento:**
```bash
npm run dev
```
Isso vai:
- ✅ Compilar o Tailwind CSS automaticamente
- ✅ Iniciar o servidor Node.js
- ✅ Abrir em http://localhost:3000

### **3. Apenas servidor:**
```bash
npm run serve
```

### **4. Build para produção:**
```bash
npm run build
```

## 🎨 Cores personalizadas disponíveis:

```css
bg-cogim-gold        /* #d4af37 */
bg-cogim-gold-light  /* #e6c55a */
bg-cogim-gold-dark   /* #c4a037 */
bg-cogim-dark        /* #1a1a1a */
text-cogim-text      /* #333333 */
```

## 🧩 Componentes prontos:

### **Botões:**
```html
<button class="btn-primary">Botão Principal</button>
<button class="btn-secondary">Botão Secundário</button>
```

### **Cards:**
```html
<div class="card p-6">
  <h3 class="text-xl font-semibold mb-4">Título</h3>
  <p>Conteúdo do card</p>
</div>
```

### **Container:**
```html
<div class="container-custom">
  <div class="section-padding">
    <!-- Conteúdo -->
  </div>
</div>
```

## 📁 Estrutura dos arquivos:

```
cogim/
├── package.json          # Dependências e scripts
├── tailwind.config.js    # Configuração do Tailwind
├── backend/
│   └── server.js         # Servidor Node.js
├── frontend/
│   ├── src/
│   │   └── input.css     # CSS fonte (Tailwind)
│   ├── styles.css        # CSS compilado (gerado automaticamente)
│   ├── index.html        # Página principal
│   └── script.js         # JavaScript
└── public/
    └── images/           # Imagens do site
```

## 🎯 Exemplos de uso do Tailwind:

### **Header responsivo:**
```html
<header class="bg-cogim-dark text-white py-4 fixed w-full top-0 z-50">
  <div class="container-custom">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img src="logo.png" alt="Cogim" class="h-12">
        <h1 class="text-2xl font-bold">Cogim</h1>
      </div>
      <nav class="hidden md:flex space-x-6">
        <a href="#sobre" class="hover:text-cogim-gold transition-colors">Sobre</a>
        <a href="#galeria" class="hover:text-cogim-gold transition-colors">Galeria</a>
      </nav>
    </div>
  </div>
</header>
```

### **Hero Section:**
```html
<section class="bg-gradient-to-r from-gray-50 to-white section-padding pt-32">
  <div class="container-custom">
    <div class="max-w-2xl">
      <h2 class="text-4xl md:text-5xl font-bold text-cogim-text mb-6">
        Móveis por medida com qualidade
      </h2>
      <p class="text-xl text-gray-600 mb-8">
        Transformando espaços com design personalizado.
      </p>
      <a href="#contato" class="btn-primary">Solicite um Orçamento</a>
    </div>
  </div>
</section>
```

### **Grid de galeria:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="card group cursor-pointer">
    <img src="imagem.jpg" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2">Cozinha Moderna</h3>
      <p class="text-gray-600">Design clean com ilha central</p>
    </div>
  </div>
</div>
```

## 🔥 Vantagens desta configuração:

✅ **Desenvolvimento rápido** com classes utilitárias
✅ **Design responsivo** automático
✅ **Tema personalizado** com cores da Cogim  
✅ **Hot reload** - mudanças aparecem instantaneamente
✅ **Componentes reutilizáveis**
✅ **CSS otimizado** - apenas as classes usadas
✅ **Servidor integrado** para desenvolvimento

## 🚨 Importante:

- ⚠️ **Não edite** `frontend/styles.css` manualmente
- ✅ **Edite apenas** `frontend/src/input.css`
- 🔄 O Tailwind compila automaticamente o CSS final

Agora você pode usar todo o poder do Tailwind CSS + Node.js no seu projeto! 🎉