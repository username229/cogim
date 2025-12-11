const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const PORT = 3000;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

// Mock Database (Para guardar temporariamente os códigos 2FA)
const tempCodes = {}; // { userId: { code: '123456', expiry: timestamp, method: 'sms' } }

app.use(cors());
app.use(express.json());

// Servir Ficheiros Estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

// Rota principal para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// =======================================================
// ENDPOINTS API
// =======================================================

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
    const { phone, adminType } = req.body;
    const code = crypto.randomInt(100000, 999999).toString();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutos

    try {
        await twilioClient.messages.create({
            body: `Seu código de verificação 2FA: ${code}`,
            from: TWILIO_PHONE_NUMBER,
            to: phone
        });

        const userId = adminType; // Usamos o adminType como ID temporário para o mock
        tempCodes[userId] = { code, expiry: expiryTime, method: 'sms' };

        res.json({ success: true, message: "Código SMS enviado com sucesso.", code: code });
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        res.status(500).json({ success: false, message: "Falha ao enviar código por SMS." });
    }
});

// POST /api/send-email
app.post('/api/send-email', async (req, res) => {
    const { email, adminType } = req.body;
    const code = crypto.randomInt(100000, 999999).toString();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutos

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: 'Código de Autenticação 2FA',
        text: `O seu código de verificação 2FA é: ${code}. Válido por 5 minutos.`
    };

    try {
        await transporter.sendMail(mailOptions);
        
        const userId = adminType;
        tempCodes[userId] = { code, expiry: expiryTime, method: 'email' };

        res.json({ success: true, message: "Código Email enviado com sucesso.", code: code });
    } catch (error) {
        console.error('Erro ao enviar Email:', error);
        res.status(500).json({ success: false, message: "Falha ao enviar código por Email." });
    }
});

// POST /api/validate-password (Incluindo 2FA)
app.post('/api/validate-password', async (req, res) => {
    const { email, password, code2FA, method, adminType } = req.body;
    const userId = adminType;
    const storedAuth = tempCodes[userId];

    // Simulação: Verifica se a senha/email está correta (Em produção, usaria bcrypt)
    // if (email !== 'admin@exemplo.com' || password !== 'senha123') {
    //     return res.status(401).json({ success: false, message: "Credenciais Inválidas." });
    // }
    
    if (method === 'sms' || method === 'email') {
        if (!storedAuth || storedAuth.method !== method) {
             return res.status(401).json({ success: false, message: "Primeiro, solicite um código 2FA." });
        }
        if (storedAuth.code !== code2FA || Date.now() > storedAuth.expiry) {
            delete tempCodes[userId]; // Limpa o código inválido/expirado
            return res.status(401).json({ success: false, message: "Código 2FA Inválido ou Expirado." });
        }
        
        delete tempCodes[userId];
    } 
    // Para 'authenticator', é necessária a chave secreta e o Speakeasy, que não está incluído aqui.

    // SUCESSO DE LOGIN E 2FA
    res.json({ success: true, message: "Login e 2FA bem-sucedidos.", token: "JWT_TOKEN_DEMO" });
});

// =======================================================
// CONFIGURAÇÕES DO NODEMAILER (Gmail)
// =======================================================
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu_email@gmail.com',
        pass: 'sua_senha_app' // Senha de app do Gmail
    }
});

// =======================================================
// BANCO DE DADOS SIMULADO (JSON)
// =======================================================
const DB_FILE = path.join(__dirname, 'database.json');

async function loadDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            users: {},
            activities: [],
            settings: {}
        };
    }
}

async function saveDatabase(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// =======================================================
// ENDPOINT: ENVIAR SMS 2FA
// =======================================================
app.post('/api/send-sms', async (req, res) => {
    try {
        const { phone, code, userName } = req.body;

        console.log(`📱 Enviando SMS para ${phone}`);

        const message = await twilioClient.messages.create({
            body: `Cogim Admin - Seu código de verificação é: ${code}\n\nVálido por 5 minutos.\n\nSe você não solicitou este código, ignore esta mensagem.`,
            from: TWILIO_PHONE_NUMBER,
            to: phone
        });

        console.log(`✅ SMS enviado com sucesso! SID: ${message.sid}`);

        // Registrar atividade
        const db = await loadDatabase();
        db.activities.unshift({
            type: 'sms_sent',
            user: userName,
            phone: phone,
            timestamp: new Date().toISOString(),
            status: 'success'
        });
        await saveDatabase(db);

        res.json({
            success: true,
            messageSid: message.sid,
            status: message.status
        });

    } catch (error) {
        console.error('❌ Erro ao enviar SMS:', error);
        
        // Registrar erro
        const db = await loadDatabase();
        db.activities.unshift({
            type: 'sms_error',
            user: req.body.userName,
            phone: req.body.phone,
            error: error.message,
            timestamp: new Date().toISOString(),
            status: 'failed'
        });
        await saveDatabase(db);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: ENVIAR EMAIL 2FA
// =======================================================
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, code, userName } = req.body;

        console.log(`📧 Enviando email para ${email}`);

        const mailOptions = {
            from: '"Cogim Admin" <seu_email@gmail.com>',
            to: email,
            subject: '🔐 Código de Verificação - Cogim Admin',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #00A3FF, #0081CC); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 3px dashed #00A3FF; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #00A3FF; letter-spacing: 5px; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Código de Verificação</h1>
                        </div>
                        <div class="content">
                            <p>Olá <strong>${userName}</strong>,</p>
                            <p>Você solicitou acesso ao Painel Administrativo da Cogim. Use o código abaixo para continuar:</p>
                            
                            <div class="code-box">
                                <div class="code">${code}</div>
                                <p style="color: #666; margin-top: 10px;">Válido por 5 minutos</p>
                            </div>
                            
                            <div class="warning">
                                ⚠️ <strong>Atenção:</strong> Se você não solicitou este código, ignore este email e sua conta permanecerá segura.
                            </div>
                            
                            <p>Após inserir o código, você poderá criar uma senha para facilitar acessos futuros.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Cogim - Móveis por Medida</p>
                            <p>Esta é uma mensagem automática, por favor não responda.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await emailTransporter.sendMail(mailOptions);

        console.log(`✅ Email enviado com sucesso! ID: ${info.messageId}`);

        // Registrar atividade
        const db = await loadDatabase();
        db.activities.unshift({
            type: 'email_sent',
            user: userName,
            email: email,
            timestamp: new Date().toISOString(),
            status: 'success'
        });
        await saveDatabase(db);

        res.json({
            success: true,
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        
        // Registrar erro
        const db = await loadDatabase();
        db.activities.unshift({
            type: 'email_error',
            user: req.body.userName,
            email: req.body.email,
            error: error.message,
            timestamp: new Date().toISOString(),
            status: 'failed'
        });
        await saveDatabase(db);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: CRIAR/ATUALIZAR SENHA
// =======================================================
app.post('/api/set-password', async (req, res) => {
    try {
        const { userId, password, savePassword } = req.body;

        const db = await loadDatabase();

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Atualizar usuário
        if (!db.users[userId]) {
            db.users[userId] = {};
        }

        db.users[userId].hasPassword = true;
        db.users[userId].lastPasswordUpdate = new Date().toISOString();

        if (savePassword) {
            db.users[userId].password = hashedPassword;
        }

        // Registrar atividade
        db.activities.unshift({
            type: 'password_created',
            user: userId,
            saved: savePassword,
            timestamp: new Date().toISOString()
        });

        await saveDatabase(db);

        res.json({ success: true });

    } catch (error) {
        console.error('❌ Erro ao criar senha:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: VALIDAR SENHA
// =======================================================
app.post('/api/validate-password', async (req, res) => {
    try {
        const { userId, password } = req.body;

        const db = await loadDatabase();

        if (!db.users[userId] || !db.users[userId].password) {
            return res.json({ 
                success: false, 
                error: 'Senha não configurada' 
            });
        }

        const isValid = await bcrypt.compare(password, db.users[userId].password);

        // Registrar atividade
        db.activities.unshift({
            type: 'login_attempt',
            user: userId,
            method: 'password',
            success: isValid,
            timestamp: new Date().toISOString()
        });
        await saveDatabase(db);

        res.json({ success: isValid });

    } catch (error) {
        console.error('❌ Erro ao validar senha:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: VERIFICAR SE USUÁRIO TEM SENHA
// =======================================================
app.get('/api/check-password/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await loadDatabase();

        const hasPassword = db.users[userId]?.hasPassword || false;

        res.json({ hasPassword });

    } catch (error) {
        console.error('❌ Erro ao verificar senha:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: OBTER ATIVIDADES
// =======================================================
app.get('/api/activities', async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const db = await loadDatabase();

        const activities = db.activities.slice(offset, offset + parseInt(limit));

        res.json({
            activities,
            total: db.activities.length
        });

    } catch (error) {
        console.error('❌ Erro ao carregar atividades:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ENDPOINT: REGISTRAR ATIVIDADE MANUAL
// =======================================================
app.post('/api/log-activity', async (req, res) => {
    try {
        const activity = {
            ...req.body,
            timestamp: new Date().toISOString()
        };

        const db = await loadDatabase();
        db.activities.unshift(activity);

        // Manter apenas últimas 1000 atividades
        if (db.activities.length > 1000) {
            db.activities = db.activities.slice(0, 1000);
        }

        await saveDatabase(db);

        res.json({ success: true });

    } catch (error) {
        console.error('❌ Erro ao registrar atividade:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// INICIAR SERVIDOR
// =======================================================
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 Servidor iniciado na porta ${PORT}`);
    console.log('==============================================');
    console.log('📱 Twilio SMS: Configurado');
    console.log('📧 Nodemailer: Configurado');
    console.log('🔐 Autenticação 2FA: Ativa');
    console.log('==============================================');
    console.log(`📡 Endpoints disponíveis:`);
    console.log(`   POST /api/send-sms`);
    console.log(`   POST /api/send-email`);
    console.log(`   POST /api/set-password`);
    console.log(`   POST /api/validate-password`);
    console.log(`   GET  /api/check-password/:userId`);
    console.log(`   GET  /api/activities`);
    console.log(`   POST /api/log-activity`);
    console.log('==============================================');
});