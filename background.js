chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is loading and the URL is Reddit
  if (changeInfo.status === 'loading' && tab.url && tab.url.includes("reddit.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    }).catch(err => console.error("Injection failed:", err));
  }
});