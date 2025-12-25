// Inject CSS for the typewriter and pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    .genio-response-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        max-height: 200px;
        background-color: #333;
        color: #eee;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap; /* Allows words to wrap naturally */
        align-items: flex-start;
        line-height: 1.5;
    }

    .genio-response-word {
        display: inline-block; /* Treat words as blocks for animation */
        opacity: 0; /* Start invisible */
        transform: translateY(10px); /* Start slightly below */
        animation-fill-mode: forwards; /* Keep the end state of the animation */
        margin-right: 0.25em; /* Space between words */
        white-space: pre-wrap; /* Preserve whitespace and allow wrapping */
    }

    .genio-cursor {
        display: inline-block;
        width: 8px;
        height: 1.2em; /* Match line height */
        background-color: #eee;
        margin-left: 2px;
        vertical-align: middle;
    }
`;
document.head.appendChild(style);

// Create the display container
const responseContainer = document.createElement('div');
responseContainer.className = 'genio-response-container';
document.body.appendChild(responseContainer);

// Function to simulate typing with pulse effect
async function typeWriter(text, element, wordDelay = 70, paragraphDelay = 500) {
    element.innerHTML = ''; // Clear previous content
    const cursor = document.createElement('span');
    cursor.className = 'genio-cursor';
    element.appendChild(cursor); // Append cursor initially

    const words = text.split(/(\s+)/); // Split by whitespace, keeping whitespace

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // If it's just whitespace, append it directly without animation
        if (word.match(/^\s+$/)) {
            element.insertBefore(document.createTextNode(word), cursor);
            await new Promise(resolve => setTimeout(resolve, wordDelay / 2)); // Shorter delay for spaces
            continue;
        }

        const wordSpan = document.createElement('span');
        wordSpan.className = 'genio-response-word';
        wordSpan.textContent = word;
        element.insertBefore(wordSpan, cursor);

        // Trigger animation
        wordSpan.style.animation = `fadeIn 0.3s ease-out ${i * (wordDelay / 1000)}s forwards, slideUp 0.3s ease-out ${i * (wordDelay / 1000)}s forwards`;

        await new Promise(resolve => setTimeout(resolve, wordDelay));

        // Add a slight delay after punctuation or at paragraph end
        if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
            await new Promise(resolve => setTimeout(resolve, paragraphDelay));
        }
    }
    // cursor.style.animation = 'blink 1s step-end infinite'; // Ensure cursor keeps blinking
}

// Listen for messages from the extension (e.g., popup.js or background.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AI_RESPONSE' && message.text) {
        console.log('Received AI response:', message.text);
        typeWriter(message.text, responseContainer);
    }
    // You can send a response back if needed, e.g., to confirm receipt
    // sendResponse({status: "received"});
});

// --- For testing purposes (remove in production) ---
// To test, open any webpage, open the console (F12), and type:
// chrome.runtime.sendMessage({ type: 'AI_RESPONSE', text: 'Hello there! This is a test message from the Genio summarizer AI. It will type out word by word with a pulse effect.' });
// You can also try with multiple sentences. This is the second sentence. And this is the third one.
// ----------------------------------------------------
