// options/options.js

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('optionsForm');
  const status = document.getElementById('status');

  // Load saved API key
  chrome.storage.sync.get('apiKey', function(data) {
    document.getElementById('apiKey').value = data.apiKey || '';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;

    chrome.storage.sync.set({apiKey: apiKey}, function() {
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  });
});