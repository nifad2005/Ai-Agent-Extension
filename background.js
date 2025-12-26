// TODO: Replace with your actual Pollinations.AI API Key if required
// The user has indicated that Pollinations.AI works without an API key and with a "direct link + text" system.
// Therefore, API_KEY and MODEL_ID are not expected to be used in this configuration.

async function fetchPollinationsAIResponse(prompt) {
    // User provided the endpoint: https://text.pollinations.ai/{prompt}
    // This indicates a GET request where the prompt is directly embedded in the URL path.
    const encodedPrompt = encodeURIComponent(prompt);
    const API_ENDPOINT = `https://text.pollinations.ai/${encodedPrompt}`; // Embed prompt directly in path

    try {
        console.log("Making Pollinations.AI GET request to:", API_ENDPOINT);
        const response = await fetch(API_ENDPOINT, {
            method: 'GET', // Changed to GET as per the new endpoint structure
            // No custom headers or body for a simple direct link GET request with prompt in path
        });

        if (!response.ok) {
            let errorMessage = `Error from Pollinations.AI API (status ${response.status}): ${response.statusText}`;
            try {
                const errorText = await response.text();
                // Try to parse as JSON if it looks like JSON
                if (errorText.startsWith('{') || errorText.startsWith('[')) {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += ` - ${errorJson.message || errorJson.error || JSON.stringify(errorJson)}`;
                } else {
                    errorMessage += ` - ${errorText}`;
                }
            } catch (parseError) {
                // If parsing fails, just use the status text
                errorMessage += ` - Failed to parse error response body.`;
            }
            console.error("Pollinations.AI API Error:", errorMessage);
            return errorMessage;
        }

        // With the https://text.pollinations.ai/{prompt} endpoint,
        // it is highly likely that the response will be plain text.
        const generatedText = await response.text();
        
        if (!generatedText) {
             return "No response text found from Pollinations.AI.";
        }
        return generatedText;
    } catch (error) {
        console.error("Network or parsing error with Pollinations.AI API:", error);
        return `Network or parsing error: ${error.message}`;
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle SUMMARIZE_PAGE message from content.js (now directly responding to content.js)
    if (message.type === 'SUMMARIZE_PAGE') {
        console.log('SUMMARIZE_PAGE message received in background.js from content.js');

        const tabId = sender.tab.id;

        // Step 1: Get the content of the current tab
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => document.body.innerText // Function to extract text content
        }).then(async (results) => {
            const pageContent = results[0]?.result || "No content found on page.";
            console.log("Page content extracted for summarization.");

            // Step 2: Use Gemini API to summarize the content
            const summaryPrompt = `Please summarize the following text:\n\n${pageContent.substring(0, 5000)}`; // Limit content for prompt
            const generatedSummary = await fetchGeminiResponse(summaryPrompt);

            // Step 3: Send the generated summary back to the content script
            if (sender.tab) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'SUMMARIZE_PAGE_RESPONSE',
                    text: generatedSummary
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending SUMMARIZE_PAGE_RESPONSE back to content script:", chrome.runtime.lastError.message);
                    } else {
                        console.log("SUMMARIZE_PAGE_RESPONSE sent to content script, response:", response);
                    }
                });
            }
        }).catch(error => {
            console.error("Error during page content extraction or summarization:", error);
            if (sender.tab) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'SUMMARIZE_PAGE_RESPONSE',
                    text: `Error: Failed to summarize page. ${error.message}`
                });
            }
        }).finally(() => {
            sendResponse({ status: "Summarize request processed by background script." });
        });

        return true; // Indicates that sendResponse will be called asynchronously
    }

    // Handle CHAT_MESSAGE from content.js
    if (message.type === 'CHAT_MESSAGE') {
        console.log('CHAT_MESSAGE received in background.js from content.js:', message.text);

        // Call Pollinations.AI API for response
        fetchPollinationsAIResponse(message.text).then(aiResponse => {
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
        }).catch(error => {
            console.error("Failed to get Gemini response:", error);
            if (sender.tab) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: 'AI_RESPONSE_TO_CONTENT_CHAT',
                    text: `Error: Failed to get AI response. ${error.message}`
                });
            }
        }).finally(() => {
            sendResponse({ status: "Chat message received and AI response sent (or failed)." });
        });
        
        return true; // Indicates that sendResponse will be called asynchronously
    }

    // Handle GENERATE_SUGGESTIONS from content.js
    if (message.type === 'GENERATE_SUGGESTIONS') {
        console.log('GENERATE_SUGGESTIONS received');
        
        const fullText = message.text;
        const contextText = fullText.substring(0, 1500);
        
        // Contextual analysis for better prompting
        const isCode = /[{};()=]/.test(contextText) && (contextText.includes('function') || contextText.includes('const') || contextText.includes('class') || contextText.includes('import') || contextText.includes('var '));
        const isLong = fullText.length > 400;
        
        let instruction = "suggest 4 short, concise, and diverse follow-up questions or actions.";
        if (isCode) {
            instruction = "suggest 4 coding-related actions (e.g., Explain logic, Refactor, Find bugs, Convert language).";
        } else if (isLong) {
            instruction = "suggest 4 comprehension actions (e.g., Summarize, Key takeaways, Analyze tone, Simplify).";
        }

        const prompt = `Context: "${contextText}"\n\nTask: Based on the text above, ${instruction} Output ONLY the questions/actions, one per line, no numbering.`;
        
        fetchPollinationsAIResponse(prompt).then(aiResponse => {
            if (sender.tab) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: 'SUGGESTIONS_RESPONSE',
                    text: aiResponse
                });
            }
        });
        return true;
    }
});

// Example of an event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Genio Summarizer extension installed/updated.");
});
