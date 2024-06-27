console.log("xxx");
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startCrawling').addEventListener('click', () => {
    console.log("xxx");
    /*chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });*/
  });
});
