const toggle = document.getElementById('guardianToggle');
const statusText = document.getElementById('statusText');

chrome.storage.local.get(['isEnabled'], (result) => {
    toggle.checked = result.isEnabled || false;
    statusText.innerText = toggle.checked ? "Protection: ON" : "Protection: OFF";
});

toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ isEnabled: isEnabled });
    statusText.innerText = isEnabled ? "Protection: ON" : "Protection: OFF";

    chrome.tabs.query({ url: "*://*.reddit.com/*" }, (tabs) => {
        tabs.forEach((tab) => {
            // ALWAYS try to send a message first
            chrome.tabs.sendMessage(tab.id, { toggleGuardian: isEnabled }, (response) => {
                if (chrome.runtime.lastError) {
                    // If message fails, the script is a zombie. Re-inject it!
                    console.log("Guardian: Zombie detected in tab", tab.id);
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"]
                    }).then(() => {
                        // After injection, immediately tell it what the current state is
                        chrome.tabs.sendMessage(tab.id, { toggleGuardian: isEnabled });
                    });
                }
            });
        });
    });
});