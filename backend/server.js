require('dotenv').config(); 
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- A MUDANÇA ESTÁ AQUI ---
// Definimos o caminho para a pasta 'frontend' que está um nível acima da pasta 'backend'
const frontendPath = path.join(__dirname, '..', 'frontend');

// 1. Servir os ficheiros estáticos (CSS, JS, Imagens)
// Importante: Isso permite que o index.html encontre seus estilos e scripts
app.use(express.static(frontendPath));

// 2. Rota para carregar o index.html na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 3. Rota para o futuro Admin (atualmente servindo o mesmo index ou erro)
app.get('/admin', (req, res) => {
    // Quando você criar o painel, basta apontar para a nova pasta aqui
    res.send('O Painel de Admin será configurado aqui em breve.');
});

// 4. API de Status
app.get('/api/system-info', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        directory: frontendPath
    });
});

// 5. Fallback: Se não encontrar nada, volta para o index (útil para SPAs)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📂 Servindo arquivos de: ${frontendPath}`);
});