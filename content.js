(() => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchUserData = async () => {
        try {
            const response = await fetch("https://www.etsy.com/api/v3/ajax/member/conversations/current-user", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "downlink": "0.9",
                    "dpr": "1",
                    "ect": "3g",
                    "rtt": "300",
                    "sec-ch-dpr": "1",
                    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                    "sec-ch-ua-arch": "\"x86\"",
                    "sec-ch-ua-bitness": "\"64\"",
                    "sec-ch-ua-full-version-list": "\"Chromium\";v=\"116.0.5845.188\", \"Not)A;Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"116.0.5845.188\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-ch-ua-platform-version": "\"14.0.0\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-detected-locale": "USD|en-US|US",
                    "x-page-guid": "fa36bb23fd8.7bdf7a244e1cb4ece7bb.00",
                    "Referer": "https://www.etsy.com/messages?ref=seller-platform-mcnav",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "method": "GET"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            console.log('User data received:', userData);

            return {
                user_id: userData.user_id,
                display_name: userData.display_name,
                profile_url: userData.profile_url
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const fetchPageData = async (page) => {
        try {
            const response = await fetch(`https://www.etsy.com/api/v3/ajax/bespoke/member/conversations/message-list-data?tag=system_tag.inbox&is_search=false&search_query=&page=${page}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "Referer": `https://www.etsy.com/messages?ref=seller-platform-mcnav&page=${page}`,
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "method": "GET"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Data received from page ${page}:`, data);

            return data;
        } catch (error) {
            console.error('Error fetching page data:', error);
            return null;
        }
    };

    const extractAllMessages = async () => {
        let userData = await fetchUserData();

        if (!userData) {
            console.error('Failed to fetch user data. Exiting...');
            return;
        }

        console.log('User info:', userData);

        let currentPage = 1;
        let totalPages = Infinity;
        let allMessages = [];

        while (currentPage <= totalPages) {
            const data = await fetchPageData(currentPage);

            if (!data) {
                break; // Dừng lại nếu không lấy được dữ liệu
            }

            allMessages = [...allMessages, ...data.conversations];

            if (currentPage === 1) {
                totalPages = data.pagination.total_pages;
            }

            currentPage++;
            await delay(1000); // Thêm thời gian chờ 1 giây giữa các yêu cầu để tránh lỗi "Too Many Requests"
        }
        const extractedMessages = allMessages.map(message => ({
            conversation_id: message.conversation_id,
            conversation_url: message.conversation_url,
            display_name: message.other_user.display_name,
            username: message.other_user.username,
            is_unread: message.is_unread,
        }));

        console.log('Extracted messages:', extractedMessages);
        chrome.runtime.sendMessage({ action: 'saveAllMessages', data: extractedMessages, user: userData });
        chrome.runtime.sendMessage({ action: 'sendMessagesToServer' }); // Gửi tin nhắn để bắt đầu gửi dữ liệu tới server
        console.log('Finished extracting all messages.');
    };

    const reloadPageAndExtractMessages = () => {
        window.location.reload(); // Reload the page
    };

    window.addEventListener('load', () => {
        chrome.runtime.sendMessage({ action: 'startExtraction' });
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'startExtraction') {
            extractAllMessages();
        }
    });

    // Set an interval to reload the page every 5 minutes (300000 ms)
    setInterval(reloadPageAndExtractMessages, 300000);
})();
