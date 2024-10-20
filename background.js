// background.js

import { summarizeIssue } from './utils/api.js';

chrome.runtime.onInstalled.addListener(() => {
  console.log('GitHub Issue Helper Extension Installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarizeIssue') {
    console.log('Received summarizeIssue request:', request.issueContent);

    summarizeIssue(request.issueContent)
      .then(summary => {
        console.log('Summary generated:', summary);
        sendResponse({ summary });
      })
      .catch(error => {
        console.error('Error summarizing issue:', error);
        sendResponse({ error: 'Failed to summarize issue' });
      });

    return true; // Keep the message channel open for sendResponse
  }
});