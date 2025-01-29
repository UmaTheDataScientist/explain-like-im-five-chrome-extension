chrome.runtime.onInstalled.addListener(() => {
    // Create context menu
    chrome.contextMenus.create({
      id: "explainLikeFive",
      title: "Explain Like I'm Five",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "explainLikeFive" && info.selectionText) {
      // Inject content script into the active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }, () => {
        // Send selected text to the content script
        chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
      });
    }
  });
  