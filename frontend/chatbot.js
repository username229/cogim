// CHATBOT - SISTEMA DE PERGUNTAS FREQUENTES DA COGIM
// Base de dados com perguntas frequentes e respostas organizadas por categorias
// Cada categoria contém uma pergunta modelo e resposta detalhada
const faqData = {
    "horarios": {
        question: "Qual é o horário de funcionamento?",
        answer: "⏰ Nosso horário de funcionamento:\n\n📅 Segunda a Sexta: 8h às 17h\n📅 Sábado: 9h às 13h\n📅 Domingo: Fechado\n\nEstamos sempre prontos para atendê-lo!"
    },
    "localizacao": {
        question: "Onde vocês estão localizados?",
        answer: "📍 Estamos localizados na:\n\n🏢 Av. 25 de Setembro\nMaputo, Moçambique\n\n🚗 Venha nos visitar! Temos fácil acesso e estacionamento disponível."
    },
    "produtos": {
        question: "Quais produtos vocês oferecem?",
        answer: "🛋️ Nossos produtos incluem:\n\n🍳 Cozinhas planejadas\n🚿 Móveis para casa de banho\n👔 Guarda-roupas sob medida\n📺 Racks para sala\n🏠 Teto falso em gesso\n📋 Móveis diversos\n\nTodos feitos sob medida com qualidade superior!"
    },
    "orcamento": {
        question: "Como solicitar um orçamento?",
        answer: "💰 Para orçamentos personalizados:\n\n📞 Entre em contato conosco:\n📱 WhatsApp: +258 82 728 8888\n📧 Email: info@cogimcozinhas.co.mz\n\n🏠 Ou visite nossa loja!\n\n✨ Orçamentos gratuitos e sem compromisso!"
    },
    "prazo": {
        question: "Qual é o prazo de entrega?",
        answer: "⏱️ Nossos prazos:\n\n📏 Varia conforme o projeto\n🔧 Projetos simples: 2-3 semanas\n🏗️ Projetos complexos: 4-6 semanas\n\n📞 Entre em contato para prazo específico do seu projeto!\n\n✅ Garantimos qualidade e pontualidade!"
    },
    "whatsapp": {
        question: "Falar com atendente",
        answer: "📱 Para falar diretamente conosco:\n\n🟢 Clique no botão abaixo para ir ao WhatsApp\n\n👨‍💼 Nossos especialistas estão prontos para ajudá-lo!",
        hasWhatsApp: true
    }
};

// ELEMENTOS DO DOM
const chatbotButton = document.getElementById('chatbot-button');
const chatbotWidget = document.getElementById('chatbot-widget');
const closeChatbot = document.getElementById('close-chatbot');
const chatMessages = document.getElementById('chat-messages');
const faqButtons = document.querySelectorAll('.faq-btn');

// CONTROLE DE ESTADO DO CHATBOT
let isOpen = false;

// FUNÇÃO PARA ABRIR/FECHAR O CHATBOT
// Alterna visibilidade do widget e muda ícone do botão
function toggleChatbot() {
    // Inverte estado atual (aberto/fechado)
    isOpen = !isOpen;
    if (isOpen) {
        // Remove classe de oculto e adiciona classe visível
        chatbotWidget.classList.remove('chatbot-hidden');
        chatbotWidget.classList.add('chatbot-visible');
        // Muda ícone para X (fechar)
        chatbotButton.querySelector('i').className = 'ri-close-line ri-xl text-white';
    } else {
        // Remove classe visível e adiciona classe oculta
        chatbotWidget.classList.remove('chatbot-visible');
        chatbotWidget.classList.add('chatbot-hidden');
        // Muda ícone para mensagem (abrir)
        chatbotButton.querySelector('i').className = 'ri-message-3-line ri-xl text-white';
    }
}

// FUNÇÃO PARA ADICIONAR MENSAGEM DO USUÁRIO
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-2 flex justify-end';
    messageDiv.innerHTML = `
        <div class="bg-blue-300 text-white p-3 rounded-lg max-w-[85%]">
            <p class="text-sm break-words">${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// FUNÇÃO PARA ADICIONAR RESPOSTA DO BOT
function addBotMessage(message, hasWhatsApp = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-4';
    
    let whatsAppButton = '';
    if (hasWhatsApp) {
        whatsAppButton = `
            <div class="mt-3">
                <a href="https://wa.me/258827288888" target="_blank" rel="noopener" 
                   class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                    <i class="ri-whatsapp-line mr-2"></i>
                    Abrir WhatsApp
                </a>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="bg-gray-100 p-3 rounded-lg max-w-[85%]">
            <p class="text-sm text-gray-800 whitespace-pre-line break-words">${message}</p>
            ${whatsAppButton}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// FUNÇÃO PARA ROLAR PARA O FINAL DAS MENSAGENS
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// FUNÇÃO PARA PROCESSAR PERGUNTA FAQ
function processFAQ(questionKey) {
    const faq = faqData[questionKey];
    if (faq) {
        // Adiciona pergunta do usuário
        addUserMessage(faq.question);
        
        // Simula delay de digitação do bot
        setTimeout(() => {
            addBotMessage(faq.answer, faq.hasWhatsApp);
        }, 800);
    }
}

// FUNÇÃO PARA RESETAR CHAT
function resetChat() {
    // Limpa mensagens exceto a de boas-vindas
    chatMessages.innerHTML = `
        <div class="mb-4">
            <div class="bg-blue-100 p-3 rounded-lg max-w-xs">
                <p class="text-sm text-gray-800">Olá! 👋 Sou o assistente virtual da Cogim. Como posso ajudá-lo hoje?</p>
            </div>
        </div>
    `;
}

// EVENT LISTENERS
// Abrir/fechar chatbot
chatbotButton.addEventListener('click', toggleChatbot);
closeChatbot.addEventListener('click', toggleChatbot);

// Botões FAQ
faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        processFAQ(question);
    });
});

// Fechar chatbot ao clicar fora dele
document.addEventListener('click', (e) => {
    if (isOpen && !chatbotButton.contains(e.target) && !chatbotWidget.contains(e.target)) {
        toggleChatbot();
    }
});

// FUNCIONALIDADES ADICIONAIS
// Resetar chat quando abrir novamente
chatbotButton.addEventListener('click', () => {
    if (!isOpen) {
        resetChat();
    }
});

// Mensagem de boas-vindas adicional após 3 segundos quando abrir
let welcomeTimeout;
chatbotButton.addEventListener('click', () => {
    if (isOpen) {
        clearTimeout(welcomeTimeout);
        welcomeTimeout = setTimeout(() => {
            addBotMessage("💡 Dica: Clique em qualquer uma das opções abaixo para obter informações rápidas!");
        }, 3000);
    } else {
        clearTimeout(welcomeTimeout);
    }
});

// INICIALIZAÇÃO
console.log('💬 Chatbot Cogim carregado com sucesso!');
console.log('📋 Perguntas disponíveis:', Object.keys(faqData));