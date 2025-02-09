let allMessages = [];

document.addEventListener("DOMContentLoaded", async () => {
    const { checkUserLoggedIn } = await import('./utils.js');
    checkUserLoggedIn();

    const currentChat = localStorage.getItem("currentChat");
    getAllMessages().then(() => {
        if (currentChat) {
            loadChat(currentChat);
        }
    });
});

async function getAllMessages() {
    const from = localStorage.getItem("loginId");
    if (!from) return console.error("Error: No loginId found in localStorage");

    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const MESSAGES_URL = "https://mokesell-2304.restdb.io/rest/messages";

    const query = { "$or": [ { "from": from }, { "to": from } ] };

    try {
        const response = await fetch(`${MESSAGES_URL}?q=${encodeURIComponent(JSON.stringify(query))}&h={"$orderby": {"_created": 1}}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        });
        
        if (!response.ok) throw new Error("Failed to fetch messages");

        allMessages = await response.json();
        loadContacts();
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

function loadContacts() {
    const from = localStorage.getItem("loginId");
    const contactList = document.querySelector('.contact-list');
    if (!contactList) return;
    contactList.innerHTML = '';

    const contacts = {};
    allMessages.forEach((message) => {
        const contactId = message.from === from ? message.to : message.from;
        if (!contactId) return;
        if (!contacts[contactId] || new Date(message._created) > new Date(contacts[contactId]._created)) {
            contacts[contactId] = message;
        }
    });

    Object.values(contacts).reverse().forEach((contact) => {
        const contactId = contact.from === from ? contact.to : contact.from;
        if (!contactId) return;

        const lastMessage = contact.message || "No messages yet";
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.setAttribute('onclick', `switchChat('${contactId}')`);
        contactItem.innerHTML = `
            <img src="/src/images/avatar-placeholder.jpg" alt="Avatar" class="avatar" />
            <div class="contact-info">
                <span class="contact-name">${contactId}</span>
                <span class="contact-status">${lastMessage}</span>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
}

async function loadChat(contact) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const ACCOUNTS_URL = "https://mokesell-2304.restdb.io/rest/accounts";
    const from = localStorage.getItem("loginId");

    chatContainer.innerHTML = '';
    localStorage.setItem("currentChat", contact);

    try {
        const response = await fetch(`${ACCOUNTS_URL}/${contact}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        });

        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        document.getElementById('chat-contact-name').textContent = data.username || "Unknown User";
    } catch (error) {
        console.error("Error fetching recipient's username:", error);
        document.getElementById('chat-contact-name').textContent = "Unknown User";
    }

    const messages = allMessages.filter(msg => (msg.from === from && msg.to === contact) || (msg.from === contact && msg.to === from));
    messages.forEach(msg => {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('chat-message', msg.from === from ? 'sent' : 'received');
        messageBubble.innerHTML = `<p>${msg.message}</p><span class="timestamp">${new Date(msg.sent).toLocaleTimeString()}</span>`;
        chatContainer.appendChild(messageBubble);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.querySelector('.chat-send-button')?.addEventListener('click', sendMessage);

async function sendMessage() {
    const messageInput = document.querySelector('.chat-input');
    const message = messageInput?.value.trim();
    const from = localStorage.getItem("loginId");
    const to = localStorage.getItem("currentChat");
    if (!message || !from || !to) return;

    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const MESSAGES_URL = "https://mokesell-2304.restdb.io/rest/messages";

    try {
        const response = await fetch(MESSAGES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify({ from, to, message, sent: new Date().toISOString() })
        });

        if (!response.ok) throw new Error("Failed to send message");
        messageInput.value = '';
        getAllMessages().then(() => loadChat(to));
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
