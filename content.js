// 1. Prevent duplicate listeners and declarations
if (typeof window.guardianInjected === 'undefined') {
  window.guardianInjected = true;

  // Function to safely check if the extension is still "alive"
  const isContextValid = () => {
    try {
      return !!chrome.runtime?.id;
    } catch (e) {
      return false;
    }
  };

  function applyGuardian() {
    if (document.getElementById('deep-work-guardian-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'deep-work-guardian-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
      backgroundColor: 'black', zIndex: '2147483647', display: 'flex',
      justifyContent: 'center', alignItems: 'center', color: 'white',
      fontFamily: 'sans-serif'
    });
    overlay.innerHTML = '<h1 style="font-size: 25px; font-weight: bold; text-align: center;">🚨 BACK TO WORK! 🚨</h1>';
    document.body.appendChild(overlay);
  }

  function removeGuardian() {
    const existingOverlay = document.getElementById('deep-work-guardian-overlay');
    if (existingOverlay) existingOverlay.remove();
  }

  // 2. Listen for the toggle message
  chrome.runtime.onMessage.addListener((request) => {
    if (!isContextValid()) return; // Stop if extension reloaded
    if (request.toggleGuardian === true) applyGuardian();
    if (request.toggleGuardian === false) removeGuardian();
  });

  // 3. Check storage immediately on load/refresh
  chrome.storage.local.get(['isEnabled'], (result) => {
    if (isContextValid() && result.isEnabled) {
      if (document.body) applyGuardian();
      else document.addEventListener('DOMContentLoaded', applyGuardian);
    }
  });
}