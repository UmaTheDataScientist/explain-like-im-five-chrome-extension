// Placeholder for AWS Lambda URL - Replace with your Lambda Function URL
const apiUrl = "YOUR_AWS_LAMBDA_FUNCTION_URL_HERE";

// Create the context menu item when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explainLike5", // Unique ID for the context menu item
    title: "Explain Like I'm Five", // Text displayed in the context menu
    contexts: ["selection"] // Show the menu item only when text is selected
  });
});

// Handle clicks on the context menu item
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check if the clicked menu item is "Explain Like I'm Five" and text is selected
  if (info.menuItemId === "explainLike5" && info.selectionText) {
    const selectedText = info.selectionText.trim(); // Get the selected text

    // Show the loading popup
    chrome.scripting.executeScript({
      target: { tabId: tab.id }, // Run the script in the current tab
      func: showLoadingPopup // Function to show the loading popup
    });

    try {
      // Send the selected text to the AWS Lambda function
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: selectedText }) // Send the selected text in the request body
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response JSON
      const data = await response.json();

      // Display the explanation in the popup
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, // Run the script in the current tab
        func: showExplanationPopup, // Function to show the explanation popup
        args: [data.explanation] // Pass the explanation as an argument
      });

    } catch (error) {
      // Handle errors (e.g., network issues, API errors)
      console.error("Error fetching explanation:", error);
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, // Run the script in the current tab
        func: showErrorPopup, // Function to show the error popup
        args: ["Failed to fetch explanation. Please try again later."] // Pass the error message
      });
    }
  }
});

// Function to show the loading popup
function showLoadingPopup() {
  // Remove existing popup if any
  const existingPopup = document.getElementById("elif-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup container
  const popup = document.createElement("div");
  popup.id = "elif-popup";
  popup.innerHTML = `
    <div id="elif-popup-content">
      <div id="elif-loading">
        <img src="${chrome.runtime.getURL("icon.png")}" alt="Loading" id="elif-loading-icon">
        <p>Loading explanation...</p>
      </div>
    </div>
  `;

  // Add styles for the popup
  const style = document.createElement("style");
  style.innerHTML = `
    #elif-popup {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      padding: 20px;
      border-radius: 15px;
      font-family: Arial, sans-serif;
      width: 300px;
      max-width: 90%;
      z-index: 100000;
      animation: fadeIn 0.3s ease-in-out;
    }

    #elif-popup-content {
      text-align: center;
    }

    #elif-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    #elif-loading-icon {
      width: 50px;
      height: 50px;
      animation: pulse 1.5s infinite;
    }

    #elif-loading p {
      font-size: 14px;
      color: #555;
      margin: 0;
    }

    #elif-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }

    #elif-buttons button {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    #elif-copy {
      background: #4CAF50; /* Green background for the copy button */
      color: white;
    }

    #elif-close {
        background: #ff6666; /* Lighter red background */
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Shadow for the icon */
  }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;

  // Append the popup and styles to the document
  document.body.appendChild(popup);
  document.head.appendChild(style);
}

// Function to show the explanation popup
function showExplanationPopup(explanation) {
  const popup = document.getElementById("elif-popup");
  if (popup) {
    popup.innerHTML = `
      <div id="elif-popup-content">
        <h2>🧠 Explained Like I'm Five</h2>
        <p id="elif-explanation">${explanation}</p>
        <div id="elif-buttons">
          <button id="elif-copy">📋 Copy</button>
          <button id="elif-close">❌ Close</button>
        </div>
      </div>
    `;

    // Add event listeners for the buttons
    document.getElementById("elif-close").addEventListener("click", () => {
      popup.remove(); // Remove the popup when the close button is clicked
    });

    document.getElementById("elif-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(explanation).then(() => {
        const copyButton = document.getElementById("elif-copy");
        copyButton.textContent = "✅ Copied!";
        setTimeout(() => {
          copyButton.textContent = "📋 Copy"; // Revert to copy icon after 2 seconds
        }, 2000);
      });
    });
  }
}

// Function to show the error popup
function showErrorPopup(errorMessage) {
  const popup = document.getElementById("elif-popup");
  if (popup) {
    popup.innerHTML = `
      <div id="elif-popup-content">
        <h2>❌ Error</h2>
        <p id="elif-error">${errorMessage}</p>
        <button id="elif-close">❌ Close</button>
      </div>
    `;

    // Add event listener for the close button
    document.getElementById("elif-close").addEventListener("click", () => {
      popup.remove(); // Remove the popup when the close button is clicked
    });
  }
}
