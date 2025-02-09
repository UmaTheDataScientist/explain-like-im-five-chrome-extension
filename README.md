# Explain Like I'm Five - Chrome Extension

A Chrome Extension that uses OpenAI to explain any selected text like you're 5 years old.

## Features
- Select any text on a webpage, right-click, and choose "Explain Like I'm Five" to get a simple explanation.
- Powered by OpenAI and AWS Lambda.
- Includes a custom popup with options to copy the explanation or close the popup.

## Setup Instructions

### 1. Chrome Extension
1. Clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (toggle in the top-right corner).
4. Click "Load unpacked" and select the `chrome-extension/` folder.

### 2. AWS Lambda Function
1. Navigate to the `aws-lambda/` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt -t ./
