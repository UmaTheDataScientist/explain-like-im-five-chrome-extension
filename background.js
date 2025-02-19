// Placeholder for AWS Lambda URL - Replace with your Lambda Function URL
const apiUrl = "https://7ggyiqxl645l4rhiq227l7sfse0dewpu.lambda-url.us-east-2.on.aws/";

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
  @import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');
    #elif-popup {
      position: fixed;
      bottom: 10px;
      right: 20px;
      background: #F8E7E7;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      font-family: "Public Sans";
      width: 355px;
      max-width: 90%;
      max-height: 95%;
      z-index: 100000;
      animation: fadeIn 0.3s ease-in-out;
    }

    #elif-popup-content {
      padding: 20px;
      color: #494848;
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
      font-size: 13px;
      color: #555;
      margin: 0;
    }

    #elif-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }

    .header {
    background: #8A9A5B;
    height: 60px;
    display: flex;
    flex-direction: row;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    }

    .header .brand h1 {
        font-size: 20px;
        color: white;
        font-weight: 700;
    }

    .header #elif-close {
        cursor: pointer;
    }

    .elif-content {
        color: #494848;
    }

    #elif-title {
       font-size: 16px;
       font-weight: 700;
       margin: 0;
    }

    #elif-explanation {
        font-weight: 400;
        width: 310px;
        max-height: 230px; 
        line-height: 18px;
        overflow-y: auto; 
        background: transparent; 
        padding-right: 10px;
        font-size: 14px;
        color: #494848;
          /* text-align: justify; */
    }

    #elif-explanation::-webkit-scrollbar {
      width: 6px; 
      background: transparent; 
    }
  
    #elif-explanation::-webkit-scrollbar-thumb {
      background: rgb(248 197 197 / 50%);
      border-radius: 3px;
    }
  
    #elif-explanation::-webkit-scrollbar-thumb:hover {
      background: rgba(106, 77, 77, 0.8);
    }

    #elif-copy {
        display: flex;
        place-self: end;
        cursor: pointer;
        padding: 10px;
    }

    .dropdown-container {
        margin-top: 0.5rem;
        background: #ECD6C1;
        display: flex;
        width: 100%;
        border-radius: 8px;
        box-shadow: 1px 2px 2px #8c8c8c;
        padding: 10px;
        align-items: center;
        justify-content: space-between;
        font-family: "Public Sans" !important;
        font-size: 13px;
        font-weight: 600;
        border: none;
        outline: none;
        color: #494848;
        cursor: pointer;
    }

    .input-container {
      position: relative;
      display: inline-block;
    }

    .context-container {
      margin-top: 1rem;
      width: 100%;
    }
    
    .context-field {
      padding: 3px 17px 3px 15px; /* Space for the close icon */
      width: 278px;
      height: 30px;
      font-size: 13px;
      margin-top: 5px;
      background: #ECD6C1;
      font-family:  "Public Sans";
      box-shadow: 1px 2px 2px #8c8c8c;
      border: none;
      outline: none;
      border-radius: 8px;
      color: #666;
    }
    
    .clear-icon {
      position: absolute;
      right: 8px;
      top: 56%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 18px;
      color: #999;
      display: none; /* Initially hidden */
    }
  
    .clear-icon:hover {
      color: #000;
    }

     .context-label {
        font-size: 13px;
        font-weight: 400;
        color: #494848;
    } 


    .regenerate-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .regenerate-btn {
        box-shadow: 1px 2px 6px #717171;
        width: 170px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ECD6C1;
        border: none;
        border-radius: 24px;
        padding: 10px 15px;
        margin-top: 3rem;
        cursor: pointer;
        gap: 10px;
    }

    .btn-text {
        color: #494848;
        font-size: 13px;
        font-family: "Public Sans";
        font-weight: 600;
    }

    #elif-buttons button {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
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
    <div>
    <div class="header">
            <div class="header-logo">
                <img src="${chrome.runtime.getURL("brandLogo.png")}" alt="">
            </div>
            <div class="brand">
                <h1>ELIF</h1>
            </div>
            <div id="elif-close">
                <img src="${chrome.runtime.getURL("cancel.png")}" alt="">
            </div>
        </div>
      <div id="elif-popup-content">
            <h4 id="elif-title"></h4>
            <p id="elif-explanation"></p>

        <div id="elif-copy">
            <img src="${chrome.runtime.getURL('copy.png')}" alt="" width="20px" height="20px">
        </div>

        <select class="dropdown-container" id="explanation-dropdown">
            <option value="five" selected>Explain like I'm five</option>
            <option value="summarize">Summarize content</option>
        </select>

        <div class="context-container">
            <label class="context-label">Enter context to get relevant results(Optional):</label>
            <div class="input-container">
                <input class="context-field" type="text" placeholder="Example: Editorial and Publishing ">
                <span class="clear-icon">&times;</span>
            </div>
        </div>

        <div class="regenerate-container">
            <button class="regenerate-btn">
                <img src="${chrome.runtime.getURL("brandLogo.png")}" alt="" width="20px" height="20px">
                <span class="btn-text">Regenerate</span>
            </button>
        </div>
      </div>
      </div>
    `;

    function updateExplanation(selectedValue) {
      const titleText = document.getElementById("elif-title");
      const explanationText = document.getElementById("elif-explanation");
      if (selectedValue === "five") {
          //Dummy value placed instead of ${explanation}
          explanationText.textContent = "Alright, imagine you have a big box of Lego blocks. You want to build something amazing, but first, you need to figure out what to build and how to use those blocks. A real-world example would be a content strategist at Nike, who develops engaging content about new products, workout tips, and athlete stories, and promotes it through different platforms to connect with their audience and boost sales. A real-world example would be a content strategist at Nike, who develops engaging content about new products, workout tips, and athlete stories, and promotes it through different platforms to connect with their audience and boost sales.";
          titleText.textContent = "Explained Like I'm Five";
      } else if (selectedValue === "summarize") {
          explanationText.textContent = "A content strategist researches audience needs, plans and creates content, and ensures it is engaging and aligned with the organization's goals. A real-world example would be a content strategist at Nike, who develops engaging content about new products, workout tips, and athlete stories, and promotes it through different platforms to connect with their audience and boost sales. 🌟📈";
          titleText.textContent = "Content Summary";
      }
  }

      updateExplanation("five");

    // Update explanation when dropdown changes
      document.getElementById("explanation-dropdown").addEventListener("change", function () {
      updateExplanation(this.value);
  });

  const inputField = document.querySelector(".context-field");
  const clearIcon = document.querySelector(".clear-icon");

  inputField.addEventListener("input", () => {
    clearIcon.style.display = inputField.value ? "block" : "none";
  });

  clearIcon.addEventListener("click", () => {
    inputField.value = "";
    clearIcon.style.display = "none";
  });

    document.getElementById("elif-close").addEventListener("click", () => {
      popup.remove(); // Remove the popup when the close button is clicked
    });

    document.getElementById("elif-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(explanation).then(() => {
        const copyButton = document.getElementById("elif-copy");

        copyButton.innerHTML = `
        <span style="margin-right: 5px;">Copied!</span>
        <img src="${chrome.runtime.getURL("copied.png")}" alt="Copied" width="20px" height="20px">
    `;

        setTimeout(() => {
          copyButton.innerHTML = `
            <img src="${chrome.runtime.getURL("copy.png")}" alt="Copy" width="20px" height="20px">
        `;
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
