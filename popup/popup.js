// popup/popup.js

document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summaryDiv = document.getElementById('summary');

  summarizeBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getSummary"}, function(response) {
        if (response && response.summary) {
          summaryDiv.textContent = response.summary;
        } else {
          summaryDiv.textContent = "No summary available. Make sure you're on a GitHub issue page.";
        }
      });
    });
  });
});