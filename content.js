// Inject CSS for the floating button and the floating chat window
const style = document.createElement('style');
style.textContent = `
    .genio-floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #4a4ae6; /* Indigo */
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

        background-color: #6f6ffc; /* Lighter Indigo on hover */

    /* Styles for the floating chat window */
    #floating-chat-window {
        position: fixed;
        bottom: 90px; /* Above the floating button */
        right: 20px;
        width: 350px;
        height: 450px;
        backdrop-filter: blur(16px); /* Glassmorphism effect */
        background: rgba(255, 255, 255, 0.8); /* Glassmorphism effect */
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
        background-color: transparent; /* Changed to transparent for glassmorphism */
        border-bottom: 1px solid rgba(200, 200, 200, 0.5); /* Lighter border */
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
        background-color: #3b3bb3; /* Darker Indigo */
        color: white;
        border-radius: 20px;
        border-bottom-right-radius: 4px;
    }

    .ai-message .message-bubble {
        background-color: #f0f0f0; /* Very Light Gray */
        color: #333; /* Dark Gray */
        border-radius: 20px;
        border-bottom-left-radius: 4px;
    }

    #floating-chat-input-container {
        display: flex;
        padding: 10px;
        background-color: transparent; /* Changed to transparent */
        border-top: 1px solid rgba(200, 200, 200, 0.5); /* Lighter border */
    }

    #floating-chat-input {
        flex-grow: 1;
        border: 1px solid #ced4da;
        border-radius: 20px;
        padding: 8px 15px;
        font-size: 14px;
        margin-right: 10px;
        outline: none;
        background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent input */
    }

    #floating-chat-input:focus {
        border-color: #4a4ae6; /* Indigo focus */
        box-shadow: 0 0 0 0.2rem rgba(74, 74, 230, 0.25); /* Indigo shadow */
    }

    #floating-send-button {
        background-color: #4a4ae6; /* Indigo send button */
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
        background-color: #6f6ffc; /* Lighter Indigo on hover */
    }

    /* Styles for AI message actions (Copy/Regenerate) */
    .ai-message-actions {
        display: none; /* Hidden by default */
        margin-left: 5px;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .ai-message:hover .ai-message-actions {
        display: flex; /* Show on AI message hover */
        opacity: 1;
    }

    .action-icon-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        margin: 0 2px;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .action-icon-button:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }


    /* --- Combined Loading Indicator Management --- */
    /* Add styles for typing indicator */
    .typing-indicator-wrapper {
        justify-content: flex-start;
    }
    .typing-indicator.message-bubble {
        padding: 0 10px; /* Adjusted padding to center dots */
        background-color: #f0f0f0; /* Ensure correct background */
        color: #333;
        border-radius: 20px;
        border-bottom-left-radius: 4px;
        display: flex;
        align-items: center;
        width: fit-content;
        min-width: 40px; /* Ensure indicator has a minimum width */
        height: 28px; /* Consistent height with message bubbles */
    }
    .typing-indicator span {
        width: 6px;
        height: 6px;
        margin: 0 2px;
        background-color: #999;
        border-radius: 50%;
        display: inline-block;
        animation: bubble-pulse 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
    }
    .typing-indicator span:nth-child(2) {
        animation-delay: -0.16s;
    }
    @keyframes bubble-pulse {
        0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.7;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    /* Add styles for skeleton loader */
    .skeleton-loader-wrapper {
        justify-content: flex-start;
    }
    .skeleton-loader.message-bubble {
        background-color: #f0f0f0; /* Ensure correct background */
        color: #333;
        border-radius: 20px;
        border-bottom-left-radius: 4px;
        display: flex;
        flex-direction: column;
        padding: 8px 12px; /* Add back padding for skeleton lines */
        width: 180px; /* fixed width for skeleton */
    }
    .skeleton-line {
        height: 10px;
        background-color: #ccc;
        border-radius: 4px;
        margin-bottom: 6px;
        animation: loading-pulse 1.5s infinite ease-in-out;
    }
    .skeleton-line.short {
        width: 60%;
    }
    .skeleton-line.medium {
        width: 85%;
    }
    .skeleton-line.long {
        width: 100%;
    }
    @keyframes loading-pulse {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(style);

// Create the floating chat window HTML
const floatingChatWindowHTML = `
    <div id="floating-chat-window">
        <div id="floating-chat-titlebar">
            <span class="online-status-dot"></span>
            <span class="ai-name">Genio AI Chat</span>
            <div class="header-buttons">
                <button class="minimize-button">_</button>
                <button class="close-button">X</button>
            </div>
        </div>
        <div id="floating-chat-messages"></div>
        <div id="floating-chat-input-container">
                <textarea id="floating-chat-input" placeholder="Type your message..." rows="1"></textarea>
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

// --- Dark Mode Implementation ---
const applyTheme = (isDark) => {
    if (isDark) {
        floatingChatWindow.setAttribute('data-theme', 'dark');
    } else {
        floatingChatWindow.removeAttribute('data-theme');
    }
};

const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme
applyTheme(systemThemeQuery.matches);

// Listen for theme changes
systemThemeQuery.addEventListener('change', (e) => {
    applyTheme(e.matches);
});
// --- End Dark Mode Implementation ---

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

    // --- Combined Loading Indicator Management ---
    let typingIndicatorElement = null;
    let skeletonLoaderElement = null;
    let loadingTimeoutId = null; // To manage the delay for showing skeleton loader

    const createTypingIndicator = () => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'ai-message', 'typing-indicator-wrapper');
        messageElement.innerHTML = `
            <div class="message-bubble typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        return messageElement;
    };

    const addTypingIndicator = () => {
        if (!typingIndicatorElement && !skeletonLoaderElement) { // Only add if no loading indicator is present
            typingIndicatorElement = createTypingIndicator();
            floatingChatMessages.appendChild(typingIndicatorElement);
            scrollToBottom();
        }
    };

    const removeTypingIndicator = () => {
        if (typingIndicatorElement && floatingChatMessages.contains(typingIndicatorElement)) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
    };

    const createSkeletonLoader = () => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'ai-message', 'skeleton-loader-wrapper');
        messageElement.innerHTML = `
            <div class="message-bubble skeleton-loader">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line long"></div>
            </div>
        `;
        return messageElement;
    };

    const addSkeletonLoader = () => {
        // If typing indicator is active, remove it before showing skeleton
        if (typingIndicatorElement) {
            removeTypingIndicator();
        }
        if (!skeletonLoaderElement) { // Only add if not already present
            skeletonLoaderElement = createSkeletonLoader();
            floatingChatMessages.appendChild(skeletonLoaderElement);
            scrollToBottom();
        }
    };

    const removeSkeletonLoader = () => {
        if (skeletonLoaderElement && floatingChatMessages.contains(skeletonLoaderElement)) {
            skeletonLoaderElement.remove();
            skeletonLoaderElement = null;
        }
    };

    const showAILoadingIndicator = () => {
        addTypingIndicator(); // Show typing indicator immediately
        loadingTimeoutId = setTimeout(() => {
            // If AI response hasn't arrived within 1 second, switch to skeleton loader
            if (typingIndicatorElement || skeletonLoaderElement) { // Check if any indicator is still active
                addSkeletonLoader();
            }
        }, 1000); // Show skeleton loader after 1 second
    };

    const hideAILoadingIndicators = () => {
        clearTimeout(loadingTimeoutId); // Clear any pending skeleton loader timeout
        removeTypingIndicator();
        removeSkeletonLoader();
    };
    // --- End Combined Loading Indicator Management ---

    // Display a message in the chat window
    const displayMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = text;

        messageElement.appendChild(messageBubble);
        floatingChatMessages.appendChild(messageElement);

        if (sender === 'ai') {
            const actionsContainer = document.createElement('div');
            actionsContainer.classList.add('ai-message-actions');
            
            // Copy Button
            const copyButton = document.createElement('button');
            copyButton.classList.add('action-icon-button', 'copy-button');
            copyButton.innerHTML = '📋'; // Clipboard icon
            copyButton.title = 'Copy to Clipboard';
            copyButton.dataset.message = text; // Store message text for copying
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(copyButton.dataset.message)
                    .then(() => console.log('Message copied to clipboard!'))
                    .catch(err => console.error('Failed to copy message: ', err));
            });
            actionsContainer.appendChild(copyButton);

            // Regenerate Button
            const regenerateButton = document.createElement('button');
            regenerateButton.classList.add('action-icon-button', 'regenerate-button');
            regenerateButton.innerHTML = '🔄'; // Regenerate icon
            regenerateButton.title = 'Regenerate Response';
            // For regenerate, we'd ideally need the original user prompt,
            // which can be retrieved from chatHistory or passed along.
            // For now, it's a placeholder.
            regenerateButton.addEventListener('click', () => {
                console.log('Regenerate clicked for message:', text);
                // TODO: Implement regeneration logic (e.g., re-send last user prompt)
            });
            actionsContainer.appendChild(regenerateButton);

            messageElement.appendChild(actionsContainer);
        }

        scrollToBottom();
    };

    // Scroll chat to the bottom
    const scrollToBottom = () => {
        floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
    };

    // --- Input Area JS Logic ---
    // Auto-expanding textarea
    floatingChatInput.addEventListener('input', () => {
        floatingChatInput.style.height = 'auto'; // Reset height
        floatingChatInput.style.height = floatingChatInput.scrollHeight + 'px'; // Set to scroll height
        scrollToBottom(); // Scroll to bottom when textarea expands
    });

    // Reset textarea height on blur if empty
    floatingChatInput.addEventListener('blur', () => {
        if (floatingChatInput.value.trim() === '') {
            floatingChatInput.style.height = 'var(--min-textarea-height)'; // Reset to initial min-height
        }
    });


    // --- End Input Area JS Logic ---

    // Send a message
    const sendMessage = async () => {
        const messageText = floatingChatInput.value.trim();
        if (messageText === '') return;

        // Display user message
        displayMessage(messageText, 'user');
        chatHistory.push({ text: messageText, sender: 'user' });
        floatingChatInput.value = ''; // Clear input

        // Show loading indicator(s)
        showAILoadingIndicator();

        // Set a timeout to hide loading indicators if no response comes back
        const responseTimeout = setTimeout(() => {
            hideAILoadingIndicators();
            displayMessage("Apologies, I'm having trouble connecting to the AI right now. Please try again later.", 'ai');
        }, 10000); // 10 seconds timeout

        // Send user message to background script for AI processing
        chrome.runtime.sendMessage({ type: 'CHAT_MESSAGE', text: messageText }, (response) => {
            clearTimeout(responseTimeout); // Clear the timeout if a response is received

            if (chrome.runtime.lastError) {
                console.error("Error sending chat message to background script:", chrome.runtime.lastError.message);
                hideAILoadingIndicators(); // Ensure indicator is removed on error
                displayMessage("Error: Could not send message to AI.", 'ai');
            } else {
                console.log("Chat message sent to background script, response status:", response);
            }
        });
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
            hideAILoadingIndicators(); // Remove all indicators when AI response is received
            displayMessage(message.text, 'ai');
            chatHistory.push({ text: message.text, sender: 'ai' });
            scrollToBottom();
            sendResponse({ status: "AI response displayed in floating chat" });
            return true; // Indicates that sendResponse will be called asynchronously
        } else if (message.type === 'SUMMARIZE_PAGE_RESPONSE') { // Response for the summarize button
            console.log('SUMMARIZE_PAGE_RESPONSE received in content.js:', message.text);
            hideAILoadingIndicators(); // Remove all indicators when summary response is received
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
