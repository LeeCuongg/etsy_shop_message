let allMessages = [];
let userData = {};

const sendAllMessagesToServer = async () => {
    const unreadMessages = allMessages.filter(message => message.is_unread);

    if (unreadMessages.length === 0) {
        console.log('No unread messages to send.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/etsyMessageNotifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: userData,
                messages: unreadMessages,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data successfully sent to server:', result);
    } catch (error) {
        console.error('Error sending data to server:', error);
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveAllMessages') {
        allMessages = message.data;
        userData = message.user;
        console.log('All messages saved:', allMessages);
        console.log('User data saved:', userData);
    }

    if (message.action === 'startExtraction') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, { action: 'startExtraction' });
        });
    }

    if (message.action === 'sendMessagesToServer') {
        sendAllMessagesToServer();
    }
});
