// Inject CSS for the floating button and the floating chat window
const style = document.createElement('style');
style.textContent = `
    .genio-floating-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #6366f1, #4f46e5); /* Modern Indigo Gradient */
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
        z-index: 2147483647;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        overflow: hidden;
    }

    .genio-floating-button::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transform: skewX(-20deg);
        animation: genio-shine 6s infinite;
    }

    .genio-floating-button:hover {
        transform: scale(1.1);
        box-shadow: 0 15px 35px rgba(79, 70, 229, 0.5);
    }

    /* Styles for the floating chat window */
    #floating-chat-window {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 380px;
        height: 600px;
        max-height: 80vh;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        z-index: 2147483646;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1f2937;
        overflow: hidden;
        visibility: hidden; /* Start hidden */
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #floating-chat-window.open {
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    /* Minimized State */
    #floating-chat-window.minimized {
        height: auto !important;
        min-height: 0;
        background: linear-gradient(120deg, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.85) 70%);
        background-size: 200% 100%;
        animation: genio-shimmer 3s infinite linear;
        cursor: pointer;
    }
    
    #floating-chat-window.minimized #floating-chat-messages,
    #floating-chat-window.minimized #floating-chat-input-container {
        display: none;
    }

    /* Title Bar */
    #floating-chat-titlebar {
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        font-size: 16px;
        color: #111827;
    }

    .genio-online-status-dot {
        height: 8px;
        width: 8px;
        background-color: #10b981;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        animation: genio-pulse-green 2s infinite;
    }

    @keyframes genio-pulse-green {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
            transform: scale(1);
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
        }
        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }

    .genio-header-buttons {
        display: flex;
        gap: 8px;
    }

    .genio-header-buttons button {
        background: transparent;
        border: none;
        cursor: pointer;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s ease;
        color: #6b7280;
        font-size: 20px;
        line-height: 1;
    }
    
    .genio-minimize-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #111827;
    }

    .genio-close-button:hover {
        background-color: #ef4444;
        color: white;
    }

    #floating-chat-messages {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: transparent; /* Changed to transparent for glassmorphism */
        scroll-behavior: smooth;
    }

    .genio-message {
        display: flex;
        margin-bottom: 16px;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .genio-user-message {
        justify-content: flex-end;
    }

    .genio-ai-message {
        justify-content: flex-start;
    }

    .genio-message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        line-height: 1.5;
        font-size: 14px;
        word-wrap: break-word;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .genio-user-message .genio-message-bubble {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border-bottom-right-radius: 4px;
    }

    .genio-ai-message .genio-message-bubble {
        background-color: #f3f4f6;
        color: #1f2937;
        border-bottom-left-radius: 4px;
    }

    #floating-chat-input-container {
        display: flex;
        align-items: flex-end;
        padding: 16px;
        background-color: white;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    #floating-chat-input {
        flex-grow: 1;
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        padding: 12px 16px;
        font-size: 14px;
        margin-right: 12px;
        outline: none;
        background-color: #f9fafb;
        transition: border-color 0.2s, box-shadow 0.2s;
        resize: none;
        max-height: 100px;
        font-family: inherit;
    }

    #floating-chat-input:focus {
        border-color: #6366f1;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    #floating-send-button {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0; /* Hide text, use icon via CSS or HTML */
        transition: transform 0.2s, box-shadow 0.2s;
        outline: none;
        padding: 0;
        position: relative;
        overflow: hidden;
    }

    #floating-send-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transform: skewX(-20deg);
        transition: left 0.5s;
    }

    #floating-send-button:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    #floating-send-button:hover::before {
        left: 100%;
    }

    #floating-send-button::after {
        content: '➤';
        font-size: 16px;
        margin-left: 2px;
    }

    /* --- Combined Loading Indicator Management --- */
    /* Add styles for typing indicator */
    .genio-typing-indicator-wrapper {
        justify-content: flex-start;
    }
    .genio-typing-indicator.genio-message-bubble {
        padding: 0 10px; /* Adjusted padding to center dots */
        background-color: #f3f4f6;
        color: #6b7280;
        border-radius: 20px;
        border-bottom-left-radius: 4px;
        display: flex;
        align-items: center;
        width: fit-content;
        min-width: 40px; /* Ensure indicator has a minimum width */
        height: 28px; /* Consistent height with message bubbles */
    }
    .genio-typing-indicator span {
        width: 6px;
        height: 6px;
        margin: 0 2px;
        background-color: #999;
        border-radius: 50%;
        display: inline-block;
        animation: bubble-pulse 1.4s infinite ease-in-out both;
    }
    .genio-typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
    }
    .genio-typing-indicator span:nth-child(2) {
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
    .genio-skeleton-loader-wrapper {
        justify-content: flex-start;
    }
    .genio-skeleton-loader.genio-message-bubble {
        background-color: #f3f4f6;
        color: #6b7280;
        border-radius: 20px;
        border-bottom-left-radius: 4px;
        display: flex;
        flex-direction: column;
        padding: 8px 12px; /* Add back padding for skeleton lines */
        width: 180px; /* fixed width for skeleton */
    }
    .genio-skeleton-line {
        height: 10px;
        background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
        background-size: 200% 100%;
        border-radius: 4px;
        margin-bottom: 6px;
        animation: genio-shimmer 1.5s infinite;
    }
    .genio-skeleton-line.short {
        width: 60%;
    }
    .genio-skeleton-line.medium {
        width: 85%;
    }
    .genio-skeleton-line.long {
        width: 100%;
    }
    @keyframes genio-shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    @keyframes genio-shine {
        0% { left: -100%; }
        10% { left: 100%; }
        100% { left: 100%; }
    }

    /* Dark Mode Support */
    #floating-chat-window[data-theme='dark'] {
        background: rgba(31, 41, 55, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
        color: #f9fafb;
    }
    
    #floating-chat-window[data-theme='dark'] #floating-chat-titlebar {
        background: rgba(31, 41, 55, 0.8);
        border-bottom-color: rgba(255, 255, 255, 0.1);
        color: #f9fafb;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-minimize-button {
        color: #9ca3af;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-minimize-button:hover {
        background: rgba(255,255,255,0.1);
        color: white;
    }

    #floating-chat-window[data-theme='dark'] .genio-close-button:hover {
        background-color: #ef4444;
        color: white;
    }

    #floating-chat-window[data-theme='dark'] .genio-ai-message .genio-message-bubble {
        background-color: #374151;
        color: #f3f4f6;
    }
    
    #floating-chat-window[data-theme='dark'] #floating-chat-input-container {
        background-color: #1f2937;
        border-top-color: rgba(255, 255, 255, 0.1);
    }
    
    #floating-chat-window[data-theme='dark'] #floating-chat-input {
        background-color: #374151;
        border-color: #4b5563;
        color: white;
    }
    
    #floating-chat-window[data-theme='dark'] #floating-chat-input:focus {
        border-color: #6366f1;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-typing-indicator.genio-message-bubble, 
    #floating-chat-window[data-theme='dark'] .genio-skeleton-loader.genio-message-bubble {
        background-color: #374151;
    }

    #floating-chat-window[data-theme='dark'] .genio-skeleton-line {
        background: linear-gradient(90deg, #4b5563 25%, #6b7280 50%, #4b5563 75%);
        background-size: 200% 100%;
    }

    #floating-chat-window[data-theme='dark'].minimized {
        background: linear-gradient(120deg, rgba(31, 41, 55, 0.9) 30%, rgba(55, 65, 81, 0.9) 50%, rgba(31, 41, 55, 0.9) 70%);
        background-size: 200% 100%;
    }
`;
document.head.appendChild(style);

// Create the floating chat window HTML
const floatingChatWindowHTML = `
    <div id="floating-chat-window">
        <div id="floating-chat-titlebar">
            <span class="genio-online-status-dot"></span>
            <span class="genio-ai-name">Genio AI Chat</span>
            <div class="genio-header-buttons">
                <button class="genio-minimize-button" title="Minimize">−</button>
                <button class="genio-close-button" title="Close">×</button>
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

// Close and Minimize Logic
const closeButton = document.querySelector('.genio-close-button');
const minimizeButton = document.querySelector('.genio-minimize-button');

closeButton.addEventListener('click', () => {
    isChatWindowOpen = false;
    floatingChatWindow.classList.remove('open');
    // Reset minimized state when closing so it re-opens fully
    setTimeout(() => {
        floatingChatWindow.classList.remove('minimized');
        minimizeButton.textContent = '−';
        minimizeButton.title = 'Minimize';
    }, 300);
});

minimizeButton.addEventListener('click', () => {
    floatingChatWindow.classList.toggle('minimized');
    const isMinimized = floatingChatWindow.classList.contains('minimized');
    minimizeButton.textContent = isMinimized ? '□' : '−';
    minimizeButton.title = isMinimized ? 'Maximize' : 'Minimize';
});

// Expand on click when minimized
floatingChatWindow.addEventListener('click', (e) => {
    if (floatingChatWindow.classList.contains('minimized') && !e.target.closest('.genio-header-buttons')) {
        floatingChatWindow.classList.remove('minimized');
        minimizeButton.textContent = '−';
        minimizeButton.title = 'Minimize';
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
        messageElement.classList.add('genio-message', 'genio-ai-message', 'genio-typing-indicator-wrapper');
        messageElement.innerHTML = `
            <div class="genio-message-bubble genio-typing-indicator">
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
        messageElement.classList.add('genio-message', 'genio-ai-message', 'genio-skeleton-loader-wrapper');
        messageElement.innerHTML = `
            <div class="genio-message-bubble genio-skeleton-loader">
                <div class="genio-skeleton-line short"></div>
                <div class="genio-skeleton-line medium"></div>
                <div class="genio-skeleton-line long"></div>
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
        messageElement.classList.add('genio-message', `genio-${sender}-message`);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('genio-message-bubble');
        messageBubble.textContent = text;

        messageElement.appendChild(messageBubble);
        floatingChatMessages.appendChild(messageElement);

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
