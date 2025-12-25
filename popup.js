document.addEventListener('DOMContentLoaded', () => {
  const summaryDiv = document.getElementById('summary');
  const loader = document.getElementById('loader');

  // Show loader by default
  loader.style.display = 'block';
  summaryDiv.style.display = 'none';

  // Send a test message to content.js to trigger the typewriter effect
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'AI_RESPONSE',
      text: 'Hello there! This is a test message from the Genio summarizer AI. It will type out word by word with a pulse effect.'
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to content script:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent to content script, response:", response);
      }
    });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displaySummary') {
      loader.style.display = 'none';
      summaryDiv.style.display = 'block';
      summaryDiv.innerHTML = request.summary;
    }
  });
});
