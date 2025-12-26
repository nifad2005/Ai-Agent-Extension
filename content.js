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

    #floating-chat-window * {
        box-sizing: border-box;
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

    .genio-title-container {
        display: flex;
        align-items: center;
    }

    .genio-title-text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
    }

    .genio-title-main {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .genio-title-sub {
        font-size: 10px;
        font-weight: 500;
        color: #6b7280;
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
        padding: 12px;
        background-color: white;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
    }

    .genio-input-wrapper {
        display: flex;
        align-items: flex-end;
        width: 100%;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 6px;
        transition: all 0.2s ease;
    }

    .genio-input-wrapper:focus-within {
        background-color: white;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    #floating-chat-input {
        flex-grow: 1;
        border: none;
        padding: 8px 12px;
        font-size: 14px;
        outline: none;
        background-color: transparent;
        resize: none;
        max-height: 100px;
        font-family: inherit;
        line-height: 1.5;
    }

    #floating-chat-input:focus {
        box-shadow: none;
    }

    #floating-send-button {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
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
        flex-shrink: 0;
        margin-left: 8px;
    }

    .genio-mode-wrapper {
        position: relative;
        margin-left: 8px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-bottom: 6px; /* Align with center of send button (36px - 24px) / 2 */
    }

    #genio-mode-selector {
        appearance: none;
        -webkit-appearance: none;
        background-color: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 0 22px 0 10px;
        font-size: 11px;
        line-height: 22px;
        font-weight: 600;
        color: #4b5563;
        height: 24px;
        cursor: pointer;
        outline: none;
        font-family: inherit;
        transition: all 0.2s;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 8px auto;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    #genio-mode-selector:hover {
        border-color: #6366f1;
        color: #4f46e5;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236366f1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
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

    #floating-chat-window[data-theme='dark'] .genio-title-sub {
        color: #9ca3af;
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
    
    #floating-chat-window[data-theme='dark'] .genio-input-wrapper {
        background-color: #374151;
        border-color: #4b5563;
    }

    #floating-chat-window[data-theme='dark'] .genio-input-wrapper:focus-within {
        border-color: #6366f1;
        background-color: #1f2937;
    }

    #floating-chat-window[data-theme='dark'] #genio-mode-selector {
        background-color: #374151;
        border-color: #4b5563;
        color: #d1d5db;
    }

    #floating-chat-window[data-theme='dark'] #genio-mode-selector:hover {
        border-color: #6366f1;
        color: white;
    }

    #floating-chat-window[data-theme='dark'] #floating-chat-input {
        background-color: transparent;
        color: white;
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

    .genio-context-quote {
        font-size: 11px;
        opacity: 0.9;
        border-left: 3px solid rgba(255,255,255,0.3);
        padding: 4px 8px;
        margin-bottom: 6px;
        white-space: pre-wrap;
        max-height: 60px;
        overflow: hidden;
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    /* Context Preview Area */
    #floating-chat-context-preview {
        display: none;
        padding: 12px 16px 4px 16px;
        background-color: white;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        flex-wrap: wrap;
        gap: 8px;
        animation: fadeIn 0.2s ease;
    }
    
    #floating-chat-context-preview.visible {
        display: flex;
    }

    .genio-context-chip {
        background: linear-gradient(120deg, #e0e7ff 30%, #ffffff 50%, #e0e7ff 70%);
        background-size: 200% 100%;
        animation: genio-shimmer 3s infinite linear;
        color: #4338ca;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 100%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .genio-context-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 220px;
    }

    .genio-context-close {
        background: none;
        border: none;
        color: #4338ca;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        line-height: 1;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        transition: all 0.2s;
    }

    .genio-context-close:hover {
        opacity: 1;
        background-color: rgba(0,0,0,0.05);
    }

    /* Adjust input container when context is visible */
    #floating-chat-context-preview.visible + #floating-chat-input-container {
        border-top: none;
        padding-top: 4px;
    }
    
    /* Dark mode for context */
    #floating-chat-window[data-theme='dark'] #floating-chat-context-preview {
        background-color: #1f2937;
        border-top-color: rgba(255, 255, 255, 0.1);
    }

    #floating-chat-window[data-theme='dark'] .genio-context-chip {
        background: linear-gradient(120deg, #374151 30%, #4b5563 50%, #374151 70%);
        background-size: 200% 100%;
        color: #e0e7ff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    #floating-chat-window[data-theme='dark'] .genio-context-close {
        color: #e0e7ff;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-context-close:hover {
        background-color: rgba(255,255,255,0.1);
    }

    /* Suggestions Area */
    #floating-chat-suggestions {
        display: none;
        padding: 4px 8px;
        background-color: transparent;
        gap: 4px;
        flex-direction: column;
        overflow-y: auto;
        max-height: 90px;
        animation: fadeIn 0.2s ease;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 0;
        border-top: 1px solid rgba(0,0,0,0.05);
    }

    #floating-chat-suggestions::-webkit-scrollbar {
        width: 4px;
        display: block;
    }
    
    #floating-chat-suggestions::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.1);
        border-radius: 4px;
    }

    #floating-chat-suggestions.visible {
        display: flex;
    }

    /* Adjust borders when stacked */
    #floating-chat-context-preview.visible + #floating-chat-input-container {
        border-top: none;
        padding-top: 4px;
    }

    .genio-suggestion-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        width: 100%;
        transition: all 0.2s;
    }

    .genio-suggestion-item:hover {
        background-color: #e0e7ff;
        border-color: #c7d2fe;
    }

    .genio-suggestion-text {
        flex-grow: 1;
        padding: 4px 8px;
        font-size: 10px;
        color: #4b5563;
        cursor: pointer;
        text-align: left;
        background: none;
        border: none;
        font-family: inherit;
        white-space: normal;
        line-height: 1.2;
    }
    
    .genio-suggestion-text:hover {
        color: #4338ca;
    }

    .genio-suggestion-action {
        padding: 4px 8px;
        cursor: pointer;
        color: #6366f1;
        font-size: 10px;
        background: none;
        border: none;
        border-left: 1px solid rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    .genio-suggestion-action:hover {
        background-color: rgba(99, 102, 241, 0.1);
    }

    /* Dark mode for suggestions */
    #floating-chat-window[data-theme='dark'] #floating-chat-suggestions {
        background-color: transparent;
    }

    #floating-chat-window[data-theme='dark'] .genio-suggestion-item {
        background-color: #374151;
        border-color: #4b5563;
    }

    #floating-chat-window[data-theme='dark'] .genio-suggestion-item:hover {
        background-color: #4b5563;
        border-color: #6b7280;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-suggestion-text {
        color: #d1d5db;
    }
    
    #floating-chat-window[data-theme='dark'] .genio-suggestion-text:hover {
        color: white;
    }

    #floating-chat-window[data-theme='dark'] .genio-suggestion-action {
        border-left-color: rgba(255,255,255,0.1);
        color: #818cf8;
    }

    #floating-chat-window[data-theme='dark'] .genio-suggestion-action:hover {
        background-color: rgba(255,255,255,0.1);
    }

    /* Selection Popup */
    #genio-selection-popup {
        position: absolute;
        z-index: 2147483647;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translate(-50%, -10px);
        opacity: 0;
        animation: fadeIn 0.2s forwards;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #genio-selection-popup::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: #4f46e5 transparent transparent transparent;
    }
`;
document.head.appendChild(style);

// Create the floating chat window HTML
const floatingChatWindowHTML = `
    <div id="floating-chat-window">
        <div id="floating-chat-titlebar">
            <div class="genio-title-container">
                <span class="genio-online-status-dot"></span>
                <div class="genio-title-text">
                    <span class="genio-title-main">Genio</span>
                    <span class="genio-title-sub">as website agent</span>
                </div>
            </div>
            <div class="genio-header-buttons">
                <button class="genio-minimize-button" title="Minimize">−</button>
                <button class="genio-close-button" title="Close">×</button>
            </div>
        </div>
        <div id="floating-chat-messages"></div>
        <div id="floating-chat-suggestions"></div>
        <div id="floating-chat-context-preview"></div>
        <div id="floating-chat-input-container">
            <div class="genio-input-wrapper">
                <textarea id="floating-chat-input" placeholder="Type your message..." rows="1"></textarea>
                <div class="genio-mode-wrapper">
                    <select id="genio-mode-selector" title="Select Answer Length">
                        <option value="smart">Smart</option>
                        <option value="inteli">Inteli</option>
                        <option value="research">Research</option>
                    </select>
                </div>
                <button id="floating-send-button">Send</button>
            </div>
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
    const floatingChatContextPreview = document.getElementById('floating-chat-context-preview');
    const floatingChatSuggestions = document.getElementById('floating-chat-suggestions');
    const genioModeSelector = document.getElementById('genio-mode-selector');

    let activeContexts = [];

    const addContext = (text) => {
        activeContexts.push(text);
        
        const chip = document.createElement('div');
        chip.className = 'genio-context-chip';
        chip.innerHTML = `
            <span class="genio-context-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
            <button class="genio-context-close" title="Remove context">×</button>
        `;
        
        chip.querySelector('.genio-context-close').addEventListener('click', () => {
            const index = activeContexts.indexOf(text);
            if (index > -1) activeContexts.splice(index, 1);
            chip.remove();
            if (activeContexts.length === 0) {
                floatingChatContextPreview.classList.remove('visible');
            }
            updateSuggestions();
        });

        floatingChatContextPreview.appendChild(chip);
        floatingChatContextPreview.classList.add('visible');
        updateSuggestions();
    };

    const createSuggestionChip = (text) => {
        const item = document.createElement('div');
        item.className = 'genio-suggestion-item';

        const textBtn = document.createElement('button');
        textBtn.className = 'genio-suggestion-text';
        textBtn.textContent = text;
        textBtn.title = "Click to send";
        textBtn.addEventListener('click', () => sendMessage(text));

        const actionBtn = document.createElement('button');
        actionBtn.className = 'genio-suggestion-action';
        actionBtn.innerHTML = '✎'; // Edit icon
        actionBtn.title = "Edit in input";
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingChatInput.value = text;
            floatingChatInput.style.height = 'auto';
            floatingChatInput.style.height = floatingChatInput.scrollHeight + 'px';
            floatingChatInput.focus();
        });
        
        item.appendChild(textBtn);
        item.appendChild(actionBtn);
        return item;
    };

    const updateSuggestions = () => {
        floatingChatSuggestions.innerHTML = '';
        
        if (activeContexts.length > 0) {
            const combinedText = activeContexts.join('\n\n');
            
            // Immediate Contextual Suggestions
            if (combinedText.length > 300) {
                floatingChatSuggestions.appendChild(createSuggestionChip("Summarize this"));
                floatingChatSuggestions.appendChild(createSuggestionChip("Key Takeaways"));
            }
            
            if (/[{};()=]/.test(combinedText) && (combinedText.includes('function') || combinedText.includes('const') || combinedText.includes('class ') || combinedText.includes('import '))) {
                floatingChatSuggestions.appendChild(createSuggestionChip("Explain this code"));
            }

            const loadingItem = document.createElement('div');
            loadingItem.className = 'genio-suggestion-item';
            loadingItem.id = 'genio-suggestion-loading';
            loadingItem.innerHTML = `<span class="genio-suggestion-text" style="cursor: default; opacity: 0.7;">✨ Thinking...</span>`;
            floatingChatSuggestions.appendChild(loadingItem);
            
            floatingChatSuggestions.classList.add('visible');
            chrome.runtime.sendMessage({ type: 'GENERATE_SUGGESTIONS', text: combinedText });
        } else {
            floatingChatSuggestions.classList.remove('visible');
        }
    };

    const clearAllContexts = () => {
        activeContexts = [];
        floatingChatContextPreview.innerHTML = '';
        floatingChatContextPreview.classList.remove('visible');
        updateSuggestions();
    };

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
    const displayMessage = (text, sender, isHtml = false) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('genio-message', `genio-${sender}-message`);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('genio-message-bubble');
        if (isHtml) {
            messageBubble.innerHTML = text;
        } else {
            messageBubble.textContent = text;
        }

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
    const sendMessage = async (text = null) => {
        const inputVal = floatingChatInput.value.trim();
        const userQuery = text || inputVal;
        const selectedMode = genioModeSelector.value;

        if (!userQuery && activeContexts.length === 0) return;
        
        let parts = [];
        let displayParts = [];

        if (activeContexts.length > 0) {
            activeContexts.forEach((ctx, i) => {
                parts.push(`Context ${i + 1}:\n${ctx}`);
                const safeCtx = ctx.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                displayParts.push(`<div class="genio-context-quote"><strong>Context:</strong> ${safeCtx}</div>`);
            });
        }
        if (userQuery) {
            parts.push(userQuery);
            const safeQuery = userQuery.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            displayParts.push(`<div>${safeQuery}</div>`);
        }
        
        const messageToSend = parts.join('\n\n');
        const messageToDisplay = displayParts.join('');

        // Display user message
        displayMessage(messageToDisplay, 'user', true);
        chatHistory.push({ text: messageToSend, sender: 'user' });
        
        if (!text) {
            floatingChatInput.value = ''; // Clear input only if typed
            floatingChatInput.style.height = 'auto'; // Reset height
        }
        
        // Clear context after sending regardless of input method
        if (activeContexts.length > 0) clearAllContexts();

        // Show loading indicator(s)
        showAILoadingIndicator();

        // Set a timeout to hide loading indicators if no response comes back
        const responseTimeout = setTimeout(() => {
            hideAILoadingIndicators();
            displayMessage("Apologies, I'm having trouble connecting to the AI right now. Please try again later.", 'ai');
        }, 10000); // 10 seconds timeout

        // Send user message to background script for AI processing
        chrome.runtime.sendMessage({ type: 'CHAT_MESSAGE', text: messageToSend, mode: selectedMode }, (response) => {
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
    floatingSendButton.addEventListener('click', () => sendMessage());
    floatingChatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
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
        } else if (message.type === 'SUGGESTIONS_RESPONSE') {
            if (activeContexts.length > 0) {
                const loader = document.getElementById('genio-suggestion-loading');
                if (loader) loader.remove();
                
                const lines = message.text.split('\n');
                const existingTexts = Array.from(floatingChatSuggestions.querySelectorAll('.genio-suggestion-text')).map(el => el.textContent);
                
                lines.forEach(line => {
                    const cleanLine = line.replace(/^[\d\-\.\)\s]+/, '').trim();
                    if (cleanLine && cleanLine.length < 100 && !cleanLine.toLowerCase().startsWith('error') && !existingTexts.includes(cleanLine)) {
                        floatingChatSuggestions.appendChild(createSuggestionChip(cleanLine));
                    }
                });
            }
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

    // --- Selection Popup Logic ---
    document.addEventListener('mouseup', (e) => {
        const existingBtn = document.getElementById('genio-selection-popup');

        // If clicking on the popup button itself, ignore this event to allow the click handler to run
        if (existingBtn && existingBtn.contains(e.target)) return;

        // Don't show if clicking inside chat window or on the floating button
        if (floatingChatWindow.contains(e.target) || genioFloatingButton.contains(e.target)) return;

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (existingBtn) existingBtn.remove();

        if (selectedText.length > 0) {
            const btn = document.createElement('button');
            btn.id = 'genio-selection-popup';
            btn.textContent = 'Ask Genio';
            
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Calculate position (absolute relative to document)
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            btn.style.top = `${rect.top + scrollTop - 45}px`; // Position above selection
            btn.style.left = `${rect.left + scrollLeft + (rect.width / 2)}px`; // Center horizontally
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Open chat if closed
                if (!isChatWindowOpen) {
                    isChatWindowOpen = true;
                    floatingChatWindow.classList.add('open');
                }
                // Restore if minimized
                if (floatingChatWindow.classList.contains('minimized')) {
                    floatingChatWindow.classList.remove('minimized');
                    minimizeButton.textContent = '−';
                    minimizeButton.title = 'Minimize';
                }

                addContext(selectedText);
                floatingChatInput.focus();
                btn.remove();
                window.getSelection().removeAllRanges();
            });

            document.body.appendChild(btn);
        }
    });

    document.addEventListener('mousedown', (e) => {
        const btn = document.getElementById('genio-selection-popup');
        if (btn && !btn.contains(e.target)) {
            btn.remove();
        }
    });
