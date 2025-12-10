// =======================================================
// SERVIDOR BACKEND PARA 2FA - SMS E EMAIL
// =======================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar Twilio
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// =======================================================
// ROTA: ENVIAR SMS COM CÓDIGO 2FA
// =======================================================
app.post('/api/send-sms', async (req, res) => {
    try {
        const { phone, code, userName } = req.body;

        // Validação
        if (!phone || !code || !userName) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }

        // Enviar SMS via Twilio
        const message = await twilioClient.messages.create({
            body: `Cogim: Seu código 2FA é ${code}. Válido por 5 minutos. Não compartilhe este código.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        console.log(`✅ SMS enviado com sucesso para ${phone}`);
        console.log(`📱 SID: ${message.sid}`);

        res.json({
            success: true,
            messageSid: message.sid,
            message: 'SMS enviado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao enviar SMS:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ROTA: ENVIAR EMAIL COM CÓDIGO 2FA
// =======================================================
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, code, userName } = req.body;

        // Validação
        if (!email || !code || !userName) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }

        // Template de email HTML
        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #00A3FF, #0081CC);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .code-box {
                        background-color: #f8f9fa;
                        border: 3px dashed #00A3FF;
                        border-radius: 12px;
                        padding: 30px;
                        margin: 30px 0;
                    }
                    .code {
                        font-size: 42px;
                        font-weight: bold;
                        color: #00A3FF;
                        letter-spacing: 8px;
                        font-family: 'Courier New', monospace;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #6c757d;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Código de Verificação 2FA</h1>
                        <p>Cogim - Painel Administrativo</p>
                    </div>
                    
                    <div class="content">
                        <h2>Olá, ${userName}!</h2>
                        <p>Você solicitou acesso ao painel administrativo da Cogim.</p>
                        <p>Seu código de verificação é:</p>
                        
                        <div class="code-box">
                            <div class="code">${code}</div>
                        </div>
                        
                        <p style="color: #6c757d; font-size: 14px;">
                            ⏰ Este código expira em <strong>5 minutos</strong>
                        </p>
                        
                        <div class="warning">
                            <strong>⚠️ Atenção:</strong><br>
                            • Não compartilhe este código com ninguém<br>
                            • A equipe Cogim nunca pedirá seu código por telefone ou email<br>
                            • Se você não solicitou este código, ignore este email
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Cogim - Móveis por Medida</p>
                        <p>Maputo, Moçambique</p>
                        <p style="margin-top: 10px;">
                            <a href="https://cogim.co.mz" style="color: #00A3FF; text-decoration: none;">www.cogim.co.mz</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Configurar e enviar email
        const msg = {
            to: email,
            from: {
                email: process.env.EMAIL_FROM,
                name: 'Cogim - Painel Admin'
            },
            subject: `🔐 Código 2FA: ${code} - Cogim`,
            html: emailHTML,
            text: `Cogim - Seu código 2FA é: ${code}. Válido por 5 minutos.`
        };

        await sgMail.send(msg);

        console.log(`✅ Email enviado com sucesso para ${email}`);

        res.json({
            success: true,
            message: 'Email enviado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =======================================================
// ROTA: VERIFICAR STATUS DO SERVIDOR
// =======================================================
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor 2FA funcionando',
        timestamp: new Date().toISOString()
    });
});

// =======================================================
// INICIAR SERVIDOR
// =======================================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 SERVIDOR 2FA INICIADO');
    console.log('='.repeat(50));
    console.log(`📡 Porta: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📱 Twilio: ${process.env.TWILIO_PHONE_NUMBER}`);
    console.log(`📧 Email: ${process.env.EMAIL_FROM}`);
    console.log('='.repeat(50));
    console.log('✅ Pronto para receber requisições 2FA');
    console.log('='.repeat(50));
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Erro não tratado:', error);
});