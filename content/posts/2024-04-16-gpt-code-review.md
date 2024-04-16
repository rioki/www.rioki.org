
# GPT Code Review

In my hobby and open source projects, I often work alone. This can result in becoming somewhat insulated while working in my own bubble. Some time ago, I began using a [pull request workflow with self-review](/2022/11/12/github-self-review.html). This method has proven quite effective, though occasionally, minor oversights still slip through the cracks.

Recently, with the rise of large language models (LLMs) like ChatGPT, we have access to remarkable language understanding tools. I've now automated the process to submit a code review request for every pull request I make.

<!--more-->

Here's a brief overview of the GitHub workflow I created:


```yaml
name: Automated Code Review

on:
  pull_request:
    types: [opened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    name: GPT-4 Code Review
    
    steps:
      - name: 'Set PR Fetch Depth'
        run: echo "PR_FETCH_DEPTH=$(( ${{ github.event.pull_request.commits }} + 1 ))" >> "${GITHUB_ENV}"

      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: ${{ env.PR_FETCH_DEPTH }}

      - name: Custom Code Review and Comment
        uses: actions/github-script@v7
        env:
          CUSTOM_PROMPT: 'Analyze the following code snippet and identify any issues, such as syntax errors, logical errors, potential bugs, performance issues, non-adherence to best practices, or security vulnerabilities. For each issue identified, specify the file name, the line number (if unknown, use 1), and a brief description of the issue. Format your response as JSON array, with each issue an object with fields path, line (as integer) and body.'
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          script: |
            (async () => {
              const { execSync } = require('child_process');
              const customPrompt = process.env.CUSTOM_PROMPT;
              
              // Fetch diff
              const diff = execSync(`git diff ${{ github.event.pull_request.base.sha }} HEAD`).toString();
              
              // Request GPT-4 review
              const prompt     = `${customPrompt} ${diff}`;
              const max_tokens = Math.min(Math.ceil(prompt.length / 4), 4096);

              const payload = {
                model: 'gpt-4-turbo-preview',
                max_tokens: max_tokens,
                messages: [
                  {
                    role: 'user',
                    content: prompt
                  }
                ]
              };
              try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                });
                if (response.ok) {
                  const responseData = await response.json();
                  try {
                    const regex = /\```json\n([\s\S]*?)\n\```/;

                    const review = responseData.choices[0].message.content;

                    // Extract JSON
                    const match = review.match(regex);
                    const comments = JSON.parse(match[1]);

                    // Create GitHub review
                    await github.rest.pulls.createReview({
                      owner: context.repo.owner,
                      repo: context.repo.repo,
                      pull_number: context.issue.number,
                      commit_id: '${{ github.event.pull_request.head.sha }}',
                      event: 'REQUEST_CHANGES',
                      comments: comments
                    });
                  } 
                  catch (error) {
                    console.error('Failed to parse review:', error);
                    // Create GitHub comment
                    await github.rest.pulls.createReview({
                      owner: context.repo.owner,
                      repo: context.repo.repo,
                      pull_number: context.issue.number,
                      commit_id: '${{ github.event.pull_request.head.sha }}',
                      event: 'COMMENT',
                      body: responseData.choices[0].message.content
                    })
                  }                 
                } else {
                  console.error('Failed to get review:', await response.text());
                }
              } catch (error) {
                console.error('An error occurred:', error);
              }
            })();
        
```

Since this setup might change or need customization in the future, let's discuss it in detail.

```yaml
name: Automated Code Review

on:
  pull_request:
    types: [opened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    name: GPT-4 Code Review
    
    steps:
      - name: 'Set PR Fetch Depth'
      - name: Checkout code
      - name: Custom Code Review and Comment
```

This workflow is similar to the [LGTM workflow](/2022/11/12/github-self-review.html), setting up an environment with one crucial step implemented using inline JavaScript.

A few key points to note:

The trigger for this workflow is on `pull_request` when opened. I want only one review per pull request, as each request incurs a cost. If significant changes are made, it’s more efficient to close the PR and submit a new one.

Write access to the PR is required since we're performing a code review.

```yaml
- name: 'Set PR Fetch Depth'
  run: echo "PR_FETCH_DEPTH=$(( ${{ github.event.pull_request.commits }} + 1 ))" >> "${GITHUB_ENV}"

- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: ${{ env.PR_FETCH_DEPTH }}
```

This section handles the custom checkout. The default `actions/checkout` action checks out with a depth of 1, which is sufficient for building software but not for getting a complete git diff of the entire PR. These steps calculate the necessary depth and instruct `actions/checkout` to fetch accordingly.

```yaml
- name: Custom Code Review and Comment
  uses: actions/github-script@v7
  env:
    FILE_PATTERN: '*.cpp *.h *.md *.glsl *.yml *.json'
    CUSTOM_PROMPT: 'Analyze the following code snippet and identify any issues, such as syntax errors, logical errors, potential bugs, performance issues, non-adherence to best practices, or security vulnerabilities. For each issue identified, specify the file name, the line number (if unknown, use 1), and a brief description of the issue. Format your response as JSON array, with each issue an object with fields path, line (as integer) and body.'
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  with:
    script:
```

The core script uses `actions/github-script` for inline JavaScript on GitHub. Here are a few customizations:

`CUSTOM_PROMPT`: Contains instructions for the analysis, detailing the desired format for the output. This fine-tuning is crucial as it enables us to use the output to submit line-specific comments on GitHub, although it occasionally misidentifies line numbers.

`OPENAI_API_KEY`: This is your API access key, which must be securely stored in your secrets.

```js
const { execSync } = require('child_process');

const diff = execSync(`git diff ${{ github.event.pull_request.base.sha }} HEAD`).toString();
```

This script fetches the git diff and submits it along with the prompt to ChatGPT. I'm currently using the `gpt-4-turbo-preview` model. Older models required a file-by-file submission which could be an alternative if you hit token limits with this setup.

```js
const customPrompt = process.env.CUSTOM_PROMPT;

// Request GPT-4 review
const prompt     = `${customPrompt} ${diff}`;
const max_tokens = Math.min(Math.ceil(prompt.length / 4), 4096);

const payload = {
  model: 'gpt-4-turbo-preview',
  max_tokens: max_tokens,
  messages: [
    {
      role: 'user',
      content: prompt
    }
  ]
};
try {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  // [...]
} catch (error) {
  console.error('An error occurred:', error);
}
```

This block submits the diff and prompt to ChatGPT. The calculation for `max_tokens` is somewhat crude and its exact implications on the limitations of the model's response are not fully clear to me yet. The setup is wrapped in a try-catch block to handle potential failures, such as exhausting your OpenAI API credits.

```js
if (response.ok) {
  const responseData = await response.json();
  try {
    const regex = /\```json\n([\s\S]*?)\n\```/;

    const review = responseData.choices[0].message.content;

    // Extract JSON
    const match = review.match(regex);
    const comments = JSON.parse(match[1]);

    // Create GitHub review
    await github.rest.pulls.createReview({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      commit_id: '${{ github.event.pull_request.head.sha }}',
      event: 'REQUEST_CHANGES',
      comments: comments
    });
  } 
  catch (error) {
    console.error('Failed to parse review:', error);
    // Create GitHub comment
    await github.rest.pulls.createReview({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      commit_id: '${{ github.event.pull_request.head.sha }}',
      event: 'COMMENT',
      body: responseData.choices[0].message.content
    })
  }                 
} else {
  console.error('Failed to get review:', await response.text());
}
```

If the response is successful, the script parses it. The response from ChatGPT is formatted per our request as a JSON array, which is directly usable in the GitHub review API.

The fallback mechanism creates a generic comment in the PR if parsing fails or if there's a change in the GitHub API, which has happened in the past.

And there you have it—automated code reviews by ChatGPT, enhancing code quality and catching errors efficiently.
