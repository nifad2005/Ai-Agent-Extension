chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle SUMMARIZE_PAGE message from content.js (now directly responding to content.js)
    if (message.type === 'SUMMARIZE_PAGE') {
        console.log('SUMMARIZE_PAGE message received in background.js from content.js');

        // Simulate summarization logic or API call
        const dummySummary = `Summary for current page (triggered by floating button): This is a simulated summary for the webpage content. Timestamp: ${new Date().toLocaleTimeString()}`;

        // Send the dummy summary directly back to the content script
        if (sender.tab) {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: 'SUMMARIZE_PAGE_RESPONSE', // New message type for content.js
                text: dummySummary
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending SUMMARIZE_PAGE_RESPONSE back to content script:", chrome.runtime.lastError.message);
                } else {
                    console.log("SUMMARIZE_PAGE_RESPONSE sent to content script, response:", response);
                }
            });
        }

        sendResponse({ status: "Summarize request processed by background script." });
        return true; // Indicates that sendResponse will be called asynchronously
    }

    // Handle CHAT_MESSAGE from content.js
    if (message.type === 'CHAT_MESSAGE') {
        console.log('CHAT_MESSAGE received in background.js from content.js:', message.text);

        // Simulate AI response logic (replace with actual AI API call)
        const aiResponse = `Background AI: You said "${message.text}". I am processing your request.`;

        // Send AI response back to the content script that sent the message
        if (sender.tab) {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: 'AI_RESPONSE_TO_CONTENT_CHAT',
                text: aiResponse
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending AI_RESPONSE_TO_CONTENT_CHAT back to content script:", chrome.runtime.lastError.message);
                } else {
                    console.log("AI_RESPONSE_TO_CONTENT_CHAT sent to content script, response:", response);
                }
            });
        }

        sendResponse({ status: "Chat message received and AI response simulated." });
        return true; // Indicates that sendResponse will be called asynchronously
    }
});

// Example of an event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Genio Summarizer extension installed/updated.");
});