let allMessages = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveAllMessages') {
        allMessages = message.data;
        console.log('All messages saved:', allMessages);
    }

    if (message.action === 'startExtraction') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, { action: 'startExtraction' });
        });
    }
});
