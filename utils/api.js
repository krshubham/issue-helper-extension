const PROMPT = `You are a Github Issue Expert. You can take a look at a github issue and summarize it into the problem, the reason and the possible fixes in a nice and detailed way. You should also mention on top if there is a solution or if it is just a discussion around a potential solution.You return data using html and use appropriate markup to differentiate code blocks and text. Given the issue title and text summarize it into the problem, the reason and the possible fixes in a nice and detailed way. You only know html and css and you always return ONLY HTML with styled inline CSS. If there are no good fixes, you can clearly say that the issue doesnt mention any fixes.When possible fixes are available explain them in as many details as possible and using code blocks as much as required.Return ONLY SEMANTIC HTML and NO markdown. HTML shouldn't have styles`
async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('apiKey', function(data) {
      resolve(data.apiKey);
    });
  });
}

export async function summarizeIssue(issueContent) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    return "Please set your API key in the extension options.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: {
        parts: { text: PROMPT }
      },
      contents: [{
        parts: [{ text: issueContent }]
      }],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ],
      generationConfig: {
        temperature: 1.0,
        topK: 10
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to summarize issue');
  }

  const data = await response.json();

  const result = concatenateParts(data); // Adjust this based on the actual structure of the response
  console.log(result);

  return result;
}

function concatenateParts(data) {
  if (!data || !Array.isArray(data.candidates) || data.candidates.length === 0) {
    return '';
  }

  return data.candidates.map(candidate => {
    if (candidate.content && Array.isArray(candidate.content.parts)) {
      return candidate.content.parts.map(part => part.text).join('');
    }
    return '';
  }).join('');
}