(() => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
          await delay(1000); 
      }

      console.log('All messages:', allMessages);
      chrome.runtime.sendMessage({ action: 'saveAllMessages', data: allMessages });
      console.log('Finished extracting all messages.');
  };

  window.addEventListener('load', () => {
      chrome.runtime.sendMessage({ action: 'startExtraction' });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'startExtraction') {
          extractAllMessages();
      }
  });
})();
