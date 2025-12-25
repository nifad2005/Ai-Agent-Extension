// Inject CSS for the floating button and the floating chat window
const style = document.createElement('style');
style.textContent = `
    .genio-floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #6200ea; /* A nice purple */
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 10002; /* Above chat window */
        transition: background-color 0.3s ease;
    }

    .genio-floating-button:hover {
        background-color: #7c4dff; /* Lighter purple on hover */
    }

    /* Styles for the floating chat window */
    #floating-chat-window {
        position: fixed;
        bottom: 90px; /* Above the floating button */
        right: 20px;
        width: 350px;
        height: 450px;
        background-color: #f0f2f5;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        overflow: hidden;
        visibility: hidden; /* Start hidden */
        opacity: 0;
        transition: visibility 0.3s, opacity 0.3s ease;
    }

    #floating-chat-window.open {
        visibility: visible;
        opacity: 1;
    }

    #floating-chat-messages {
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
    }

    .message {
        display: flex;
        margin-bottom: 10px;
    }

    .user-message {
        justify-content: flex-end;
    }

    .ai-message {
        justify-content: flex-start;
    }

    .message-bubble {
        max-width: 70%;
        padding: 8px 12px;
        border-radius: 18px;
        line-height: 1.4;
        word-wrap: break-word;
    }

    .user-message .message-bubble {
        background-color: #007bff;
        color: white;
        border-bottom-right-radius: 4px;
    }

    .ai-message .message-bubble {
        background-color: #e4e6eb;
        color: #333;
        border-bottom-left-radius: 4px;
    }

    #floating-chat-input-container {
        display: flex;
        padding: 10px;
        background-color: #f9f9f9;
        border-top: 1px solid #e0e0e0;
    }

    #floating-chat-input {
        flex-grow: 1;
        border: 1px solid #ced4da;
        border-radius: 20px;
        padding: 8px 15px;
        font-size: 14px;
        margin-right: 10px;
        outline: none;
    }

    #floating-chat-input:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    #floating-send-button {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 15px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
        outline: none;
    }

    #floating-send-button:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style);

// Create the floating chat window HTML
const floatingChatWindowHTML = `
    <div id="floating-chat-window">
        <div id="floating-chat-messages"></div>
        <div id="floating-chat-input-container">
            <input type="text" id="floating-chat-input" placeholder="Type your message...">
            <button id="floating-send-button">Send</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', floatingChatWindowHTML);


// Create the floating button
const genioFloatingButton = document.createElement('button');
genioFloatingButton.className = 'genio-floating-button';
genioFloatingButton.innerHTML = '🤖'; // Or any icon/text
document.body.appendChild(genioFloatingButton);

let isChatWindowOpen = false;
const floatingChatWindow = document.getElementById('floating-chat-window');

genioFloatingButton.addEventListener('click', () => {
    isChatWindowOpen = !isChatWindowOpen;
    if (isChatWindowOpen) {
        floatingChatWindow.classList.add('open');
    } else {
        floatingChatWindow.classList.remove('open');
    }
});

// --- For testing purposes (remove in production) ---
// To test, open any webpage, open the console (F12), and type:
// chrome.runtime.sendMessage({ type: 'AI_RESPONSE', text: 'Hello there! This is a test message from the Genio summarizer AI. It will type out word by word with a pulse effect.' });
// You can also try with multiple sentences. This is the second sentence. And this is the third one.
// ----------------------------------------------------


// Chat logic for the floating chat window
// Chat logic for the floating chat window
    const floatingChatMessages = document.getElementById('floating-chat-messages');
    const floatingChatInput = document.getElementById('floating-chat-input');
    const floatingSendButton = document.getElementById('floating-send-button');

    let chatHistory = [];

    // Load chat history from storage (specific to this tab/content script for now)
    // For cross-tab/persistent history, background script would be needed.
    // For simplicity, this history will reset on page reload.
    // To make it persistent per-tab, we'd need to use chrome.storage.session or similar
    // For now, let's keep it in memory for the current page session.

    // Display a message in the chat window
    const displayMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = text;

        messageElement.appendChild(messageBubble);
        floatingChatMessages.appendChild(messageElement);
        scrollToBottom();
    };

    // Scroll chat to the bottom
    const scrollToBottom = () => {
        floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
    };

    // Send a message
    const sendMessage = async () => {
        const messageText = floatingChatInput.value.trim();
        if (messageText === '') return;

        // Display user message
        displayMessage(messageText, 'user');
        chatHistory.push({ text: messageText, sender: 'user' });
        floatingChatInput.value = ''; // Clear input

        // Send user message to background script for AI processing
        chrome.runtime.sendMessage({ type: 'CHAT_MESSAGE', text: messageText }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending chat message to background script:", chrome.runtime.lastError.message);
                displayMessage("Error: Could not send message to AI.", 'ai');
            } else {
                console.log("Chat message sent to background script, response status:", response);
            }
        });

        // Simulate AI typing indicator
        displayMessage('AI is typing...', 'ai-typing');
        scrollToBottom();
    };

    // Event listeners for chat input and send button
    floatingSendButton.addEventListener('click', sendMessage);
    floatingChatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Listener for AI responses from background.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'AI_RESPONSE_TO_CONTENT_CHAT') {
            console.log('AI_RESPONSE_TO_CONTENT_CHAT received in content.js:', message.text);
            // Remove typing indicator
            const typingIndicator = floatingChatMessages.querySelector('.ai-typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            displayMessage(message.text, 'ai');
            chatHistory.push({ text: message.text, sender: 'ai' });
            scrollToBottom();
            sendResponse({ status: "AI response displayed in floating chat" });
            return true; // Indicates that sendResponse will be called asynchronously
        } else if (message.type === 'SUMMARIZE_PAGE_RESPONSE') { // Response for the summarize button
            console.log('SUMMARIZE_PAGE_RESPONSE received in content.js:', message.text);
            // Remove typing indicator if present from initial SUMMARIZE_PAGE request
            const typingIndicator = floatingChatMessages.querySelector('.ai-typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            displayMessage(message.text, 'ai');
            chatHistory.push({ text: message.text, sender: 'ai' });
            scrollToBottom();
            sendResponse({ status: "Summary displayed in floating chat" });
            return true;
        }
    });

    // Handle initial SUMMARIZE_PAGE trigger from floating button
    // This part is crucial: when the floating button is clicked, it sends SUMMARIZE_PAGE to background.js.
    // background.js will then respond with SUMMARIZE_PAGE_RESPONSE to content.js.
    // So, when the chat window opens (if not already open) due to a button click,
    // we should ensure that the initial summary request gets displayed.
    // For now, the response will come via AI_RESPONSE_TO_CONTENT_CHAT or SUMMARIZE_PAGE_RESPONSE
    // directly from background.js.

    // Initialize chat with a welcome message
    if (chatHistory.length === 0) {
        displayMessage("Hello! I'm your Genio AI assistant. How can I help you today?", 'ai');
    }
