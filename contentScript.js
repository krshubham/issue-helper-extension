(function () {
  const issueTitle = document.querySelector('.gh-header-title .js-issue-title').innerText.trim();
  const allComments = document.getElementsByClassName('user-select-contain');
  let issueBody = ``;
  for (const item of allComments) issueBody += item.innerText;
  const issueContent = `${issueTitle}\n\n${issueBody}`;

  // Create a shadow host
  const shadowHost = document.createElement('div');
  const shadowRoot = shadowHost.attachShadow({mode: 'closed'});

  // Create a container for the summary
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'ai-summary-container';

// Create a header for the summary container
  const summaryHeader = document.createElement('div');
  summaryHeader.className = 'ai-summary-header';

// Create a container for the text
  const headerTextContainer = document.createElement('div');
  headerTextContainer.className = 'ai-summary-header-text';
  headerTextContainer.innerHTML = '<strong>AI Summary</strong>';
  summaryHeader.appendChild(headerTextContainer);

// Create a container for the icons
  const headerIconsContainer = document.createElement('div');
  headerIconsContainer.className = 'ai-summary-header-icons';

// Create a toggle button
  const toggleButton = document.createElement('span');
  toggleButton.className = 'ai-summary-toggle';
  toggleButton.innerHTML = '▼';
  headerIconsContainer.appendChild(toggleButton);

// Create a loading icon
  const loadingIcon = document.createElement('span');
  loadingIcon.className = 'ai-summary-loading-icon';
  loadingIcon.innerHTML = '⏳';
  headerIconsContainer.appendChild(loadingIcon);

// Create a success icon
  const successIcon = document.createElement('span');
  successIcon.className = 'ai-summary-success-icon';
  successIcon.innerHTML = '✅';
  successIcon.style.display = 'none';
  headerIconsContainer.appendChild(successIcon);

  summaryHeader.appendChild(headerIconsContainer);

  // Create a content div for the summary
  const summaryContent = document.createElement('div');
  summaryContent.className = 'ai-summary-content';

  // Add loading animation
  const loadingAnimation = document.createElement('div');
  loadingAnimation.className = 'ai-summary-loading';
  loadingAnimation.innerHTML = `
    <div class="loading-spinner"></div>
    <p class="loading-text">Generating AI Summary<span class="loading-dots"></span></p>
  `;
  summaryContent.appendChild(loadingAnimation);

  // Append header and content to the container
  summaryContainer.appendChild(summaryHeader);
  summaryContainer.appendChild(summaryContent);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .ai-summary-container {
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 16px;
      margin-top: 20px;
      margin-bottom: 20px;
      background-color: #000;
      box-shadow: 0 1px 0 rgba(27,31,36,0.04);
    }
    .ai-summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    .ai-summary-header-text {
      flex-grow: 1;
    }

    .ai-summary-header-icons {
      display: flex;
      align-items: center;
    }
    .ai-summary-toggle {
      transition: transform 0.3s;
    }
    .ai-summary-loading-icon {
      margin-left: 10px;
      font-size: 16px;
      color: #0366d6;
    }
    .ai-summary-success-icon {
      margin-left: 10px;
      font-size: 16px;
      color: #28a745;
    }
    .ai-summary-content {
      display: none;
      margin-top: 10px;
    }
    .ai-summary-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .loading-spinner {
      border: 4px solid #e1e4e8;
      border-top: 4px solid #0366d6;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    .loading-text {
      margin-top: 10px;
      font-size: 16px;
      color: #24292e;
    }
    .loading-dots::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
      display: inline-block;
      width: 0;
      overflow: hidden;
      vertical-align: bottom;
    }
    @keyframes dots {
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    }
    .ai-summary-content pre {
      background: black !important;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
    }
    .ai-summary-content code {
      background: black !important;
      font-family: monospace;
      color: #24292e;
    }
    @media (prefers-color-scheme: dark) {
      .ai-summary-container {
        background-color: #161b22;
        border-color: #30363d;
      }
      .ai-summary-content pre {
        border-color: #30363d;
      }
      .ai-summary-content code {
        color: #c9d1d9;
      }
      .loading-spinner {
        border-color: #30363d;
        border-top-color: #58a6ff;
      }
      .loading-text {
        color: #c9d1d9;
      }
    }
  `;

  // Append style and summary container to shadow root
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(summaryContainer);

  // Toggle summary content visibility
  summaryHeader.addEventListener('click', () => {
    const isCollapsed = summaryContent.style.display === 'none';
    summaryContent.style.display = isCollapsed ? 'block' : 'none';
    toggleButton.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  // Insert the shadow host into the page
  const header = document.querySelector('.gh-header');
  header.parentNode.insertBefore(shadowHost, header.nextSibling);

  // Send a message to background.js to get the summary
  chrome.runtime.sendMessage({action: 'summarizeIssue', issueContent}, (response) => {
    loadingAnimation.remove(); // Remove loading animation
    loadingIcon.style.display = 'none'; // Hide loading icon
    successIcon.style.display = 'inline'; // Show success icon
    summaryContent.innerHTML = `
      <p>${response.summary}</p>
    `;
  });
})();