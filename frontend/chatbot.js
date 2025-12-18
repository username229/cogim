// CHATBOT - SISTEMA DE PERGUNTAS FREQUENTES DA COGIM (VERSÃO MULTILÍNGUE)

// Mapeamento das chaves de tradução
const faqKeys = {
    "horarios": {
        question: "faq-horarios-q",
        answer: "faq-horarios-a"
    },
    "localizacao": {
        question: "faq-localizacao-q",
        answer: "faq-localizacao-a"
    },
    "produtos": {
        question: "faq-produtos-q",
        answer: "faq-produtos-a"
    },
    "whatsapp": {
        question: "faq-whatsapp-q",
        answer: "faq-whatsapp-a",
        hasWhatsApp: true
    }
};

// ELEMENTOS DO DOM
const chatbotButton = document.getElementById('chatbot-button');
const chatbotWidget = document.getElementById('chatbot-widget');
const closeChatbot = document.getElementById('close-chatbot');
const chatMessages = document.getElementById('chat-messages');
const faqButtons = document.querySelectorAll('.faq-btn');

let isOpen = false;

function toggleChatbot() {
    isOpen = !isOpen;
    if (isOpen) {
        chatbotWidget.classList.remove('chatbot-hidden');
        chatbotWidget.classList.add('chatbot-visible');
        chatbotButton.querySelector('i').className = 'ri-close-line ri-xl text-white';
    } else {
        chatbotWidget.classList.remove('chatbot-visible');
        chatbotWidget.classList.add('chatbot-hidden');
        chatbotButton.querySelector('i').className = 'ri-message-3-line ri-xl text-white';
    }
}

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
                    ${translate('chat-wa-btn')}
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

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// FUNÇÃO PARA PROCESSAR PERGUNTA FAQ TRADUZIDA
function processFAQ(questionKey) {
    const config = faqKeys[questionKey];
    if (config) {
        // Usa a função translate do arquivo de traduções
        addUserMessage(translate(config.question));
        
        setTimeout(() => {
            addBotMessage(translate(config.answer), config.hasWhatsApp);
        }, 800);
    }
}

// FUNÇÃO PARA RESETAR CHAT (CHAMADA QUANDO MUDA O IDIOMA)
function resetChat() {
    // 1. Limpa e traduz a saudação
    chatMessages.innerHTML = `
        <div class="mb-4">
            <div class="bg-blue-100 p-3 rounded-lg max-w-xs">
                <p class="text-sm text-gray-800">${translate('chat-welcome')}</p>
            </div>
        </div>
    `;

    // 2. Traduz os textos dos botões de FAQ que já estão no HTML
    faqButtons.forEach(button => {
        const key = button.getAttribute('data-question');
        if (faqKeys[key]) {
            button.innerText = translate(faqKeys[key].question);
        }
    });
}

// EVENT LISTENERS
chatbotButton.addEventListener('click', toggleChatbot);
closeChatbot.addEventListener('click', toggleChatbot);

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        processFAQ(question);
    });
});

document.addEventListener('click', (e) => {
    if (isOpen && !chatbotButton.contains(e.target) && !chatbotWidget.contains(e.target)) {
        toggleChatbot();
    }
});

// Reiniciar ao abrir ou ao mudar idioma
chatbotButton.addEventListener('click', () => {
    if (!isOpen) resetChat();
});

let welcomeTimeout;
chatbotButton.addEventListener('click', () => {
    if (isOpen) {
        clearTimeout(welcomeTimeout);
        welcomeTimeout = setTimeout(() => {
            addBotMessage(translate('chat-tip'));
        }, 3000);
    } else {
        clearTimeout(welcomeTimeout);
    }
});

// INICIALIZAÇÃO
console.log('💬 Chatbot Cogim traduzível carregado!');