require('dotenv').config(); 
const express = require('express');
const path = require('path');
const cors = require('cors');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DE CAMINHOS ---
// Caminho para a pasta frontend (que contém a subpasta admin)
const frontendPath = path.join(__dirname, '..', 'frontend');
const adminPath = path.join(frontendPath, 'admin');

// 1. Servir arquivos estáticos (CSS, JS, Imagens)
// Importante: Isso permite que os arquivos dentro de /frontend e /frontend/admin sejam achados
app.use(express.static(frontendPath));
app.use('/admin', express.static(adminPath));

// --- CONFIGURAÇÕES DE SERVIÇOS (Azure, Twilio, Email) ---
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE || 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

// ------------------------------------------
// ROTAS DE NAVEGAÇÃO (HTML)
// ------------------------------------------

// 1. Página Principal (Site)
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 2. Página do Painel Admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(adminPath, 'admin.html'));
});

// ------------------------------------------
// ENDPOINTS DA API (Lógica do seu servidor.js)
// ------------------------------------------

// Exemplo de uma das rotas que você enviou:
app.post('/api/send-sms', async (req, res) => {
    const { phone, code, userName } = req.body;
    try {
        await twilioClient.messages.create({
            body: `Cogim Admin - Código: ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Adicione aqui as outras rotas /api/validate-password, /api/activities, etc.

// ------------------------------------------
// FALLBACK & INICIALIZAÇÃO
// ------------------------------------------

// Health check para o Render
app.get('/api/system-info', (req, res) => {
    res.json({ status: 'online', mode: 'unified' });
});

// Se nada acima coincidir, volta para o index.html (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🚀 Servidor Unificado Online
    ---------------------------
    🌍 Site: http://localhost:${PORT}
    🔐 Admin: http://localhost:${PORT}/admin
    📂 Root: ${frontendPath}
    `);
});