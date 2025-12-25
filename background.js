chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: () => document.body.innerText,
        },
        (injectionResults) => {
          const pageText = injectionResults[0].result;
          // In a real extension, you would send the pageText to a backend service
          // that has access to a generative AI model.
          // For this example, we'll just use a placeholder summary.
          const summary = "This is a summary of the page: " + pageText.substring(0, 200) + "...";
          chrome.runtime.sendMessage({ action: 'displaySummary', summary: summary });
        }
      );
    });
  }
});

