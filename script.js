// Configuration
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// State Management
let chats = [];
let currentChatId = null;
let chatCounter = 0;

// DOM Elements
const newChatBtn = document.getElementById('newChatBtn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatList = document.getElementById('chatList');
const modelSelect = document.getElementById('modelSelect');
const chatTitle = document.getElementById('chatTitle');
const deleteChatBtn = document.getElementById('deleteChatBtn');

// Initialize
loadChatsFromStorage();
if (chats.length === 0) {
    createNewChat();
}

// Event Listeners
newChatBtn.addEventListener('click', createNewChat);
sendBtn.addEventListener('click', sendMessage);
deleteChatBtn.addEventListener('click', deleteCurrentChat);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
});

modelSelect.addEventListener('change', () => {
    if (currentChatId) {
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.model = modelSelect.value;
            saveChatsToStorage();
        }
    }
});

// Functions
function createNewChat() {
    chatCounter++;
    const newChat = {
        id: Date.now(),
        name: `Chat ${chatCounter}`,
        messages: [],
        model: modelSelect.value,
        createdAt: new Date().toISOString()
    };
    
    chats.unshift(newChat);
    saveChatsToStorage();
    renderChatList();
    switchToChat(newChat.id);
}

function switchToChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) return;
    
    // Update UI
    modelSelect.value = chat.model;
    chatTitle.textContent = chat.name;
    deleteChatBtn.style.display = 'block';
    
    // Render messages
    renderMessages(chat.messages);
    
    // Update active state in chat list
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.chatId) === chatId) {
            item.classList.add('active');
        }
    });
}

function renderChatList() {
    chatList.innerHTML = '';
    
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.chatId = chat.id;
        
        const chatName = document.createElement('span');
        chatName.className = 'chat-item-name';
        chatName.textContent = chat.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'chat-item-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };
        
        chatItem.appendChild(chatName);
        chatItem.appendChild(deleteBtn);
        
        chatItem.onclick = () => switchToChat(chat.id);
        
        chatList.appendChild(chatItem);
    });
}

function renderMessages(messages) {
    chatMessages.innerHTML = '';
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to MechaBot! 🤖</h2>
                <p>Your advanced AI assistant powered by multiple cutting-edge models.</p>
                <p>Start chatting by typing a message below!</p>
            </div>
        `;
        return;
    }
    
    messages.forEach(msg => {
        addMessageToUI(msg.role, msg.content);
    });
    
    scrollToBottom();
}

function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const header = document.createElement('div');
    header.className = 'message-header';
    header.textContent = role === 'user' ? 'You' : 'MechaBot';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Render markdown for assistant messages, plain text for user messages
    if (role === 'assistant' && typeof marked !== 'undefined') {
        contentDiv.innerHTML = marked.parse(content);
    } else {
        contentDiv.textContent = content;
    }
    
    messageDiv.appendChild(header);
    messageDiv.appendChild(contentDiv);
    
    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator-msg';
    typingDiv.innerHTML = `
        <div class="message-header">MechaBot</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
}

function removeTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing-indicator-msg');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || !currentChatId) return;
    
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;
    
    // Add user message
    chat.messages.push({
        role: 'user',
        content: message
    });
    
    addMessageToUI('user', message);
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Update chat name if it's the first message
    if (chat.messages.length === 1) {
        chat.name = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        chatTitle.textContent = chat.name;
        renderChatList();
    }
    
    saveChatsToStorage();
    
    // Disable input while processing
    sendBtn.disabled = true;
    messageInput.disabled = true;
    
    const typingIndicator = addTypingIndicator();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'MechaBot'
            },
            body: JSON.stringify({
                model: chat.model,
                messages: chat.messages
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        removeTypingIndicator();
        
        // Add assistant message
        chat.messages.push({
            role: 'assistant',
            content: assistantMessage
        });
        
        addMessageToUI('assistant', assistantMessage);
        saveChatsToStorage();
        
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        
        const errorMessage = `Sorry, I encountered an error: ${error.message}. Please try again.`;
        addMessageToUI('assistant', errorMessage);
        
        // Add error to chat history
        chat.messages.push({
            role: 'assistant',
            content: errorMessage
        });
        saveChatsToStorage();
    } finally {
        sendBtn.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

function deleteChat(chatId) {
    if (chats.length === 1) {
        alert('Cannot delete the last chat. Create a new one first.');
        return;
    }
    
    const index = chats.findIndex(c => c.id === chatId);
    if (index === -1) return;
    
    chats.splice(index, 1);
    saveChatsToStorage();
    renderChatList();
    
    // Switch to another chat if current was deleted
    if (currentChatId === chatId) {
        switchToChat(chats[0].id);
    }
}

function deleteCurrentChat() {
    if (!currentChatId) return;
    
    if (confirm('Are you sure you want to delete this chat?')) {
        deleteChat(currentChatId);
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChatsToStorage() {
    try {
        localStorage.setItem('mechabot_chats', JSON.stringify(chats));
        localStorage.setItem('mechabot_counter', chatCounter.toString());
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadChatsFromStorage() {
    try {
        const savedChats = localStorage.getItem('mechabot_chats');
        const savedCounter = localStorage.getItem('mechabot_counter');
        
        if (savedChats) {
            chats = JSON.parse(savedChats);
            renderChatList();
            
            if (chats.length > 0) {
                switchToChat(chats[0].id);
            }
        }
        
        if (savedCounter) {
            chatCounter = parseInt(savedCounter);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        chats = [];
    }
}
