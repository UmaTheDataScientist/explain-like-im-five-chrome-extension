chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const selectedText = message.text;
  
    if (document.getElementById("explain-overlay")) {
      return;
    }
  
    // Create the overlay
    const overlay = document.createElement("div");
    overlay.id = "explain-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "10%";
    overlay.style.right = "0";
    overlay.style.width = "350px";
    overlay.style.backgroundColor = "#f9f9f9";
    overlay.style.padding = "15px";
    overlay.style.zIndex = "10000";
    overlay.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.borderLeft = "1px solid #ddd";
    overlay.style.overflowY = "auto";
  
    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginBottom = "10px";
    closeButton.style.padding = "5px 10px";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "#e74c3c";
    closeButton.style.color = "white";
    closeButton.style.borderRadius = "4px";
    closeButton.style.cursor = "pointer";
    closeButton.style.display = "block";
    closeButton.style.marginLeft = "auto";
  
    closeButton.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(closeButton);
  
    // Add dropdown for selecting the prompt type
    const dropdown = document.createElement("select");
    dropdown.id = "promptType";
    dropdown.style.width = "100%";
    dropdown.style.marginBottom = "10px";
    dropdown.style.padding = "8px";
    dropdown.style.fontSize = "14px";
  
    const option1 = document.createElement("option");
    option1.value = "summarize";
    option1.textContent = "Summarize";
  
    const option2 = document.createElement("option");
    option2.value = "explain_like_five";
    option2.textContent = "Explain Like I'm Five";
  
    dropdown.appendChild(option1);
    dropdown.appendChild(option2);
    overlay.appendChild(dropdown);
  
    // Add input field for the hint
    const hintInput = document.createElement("input");
    hintInput.id = "hintInput";
    hintInput.type = "text";
    hintInput.placeholder = "Optional hint (e.g., 'API' for Postman)";
    hintInput.style.width = "100%";
    hintInput.style.marginBottom = "10px";
    hintInput.style.padding = "8px";
    hintInput.style.fontSize = "14px";
    overlay.appendChild(hintInput);
  
    // Add a fetch button
    const fetchButton = document.createElement("button");
    fetchButton.textContent = "Fetch Explanation";
    fetchButton.style.width = "100%";
    fetchButton.style.padding = "10px";
    fetchButton.style.fontSize = "14px";
    fetchButton.style.backgroundColor = "#4caf50";
    fetchButton.style.color = "white";
    fetchButton.style.border = "none";
    fetchButton.style.borderRadius = "4px";
    fetchButton.style.cursor = "pointer";
  
    overlay.appendChild(fetchButton);
  
    // Add loading/output area
    const output = document.createElement("div");
    output.id = "output";
    output.style.marginTop = "15px";
    output.style.padding = "10px";
    output.style.backgroundColor = "#fff";
    output.style.border = "1px solid #ddd";
    output.style.borderRadius = "4px";
    output.style.minHeight = "50px";
    overlay.appendChild(output);
  
    document.body.appendChild(overlay);
  
    fetchButton.addEventListener("click", async () => {
      const promptType = dropdown.value;
      const hint = hintInput.value.trim();
  
      output.textContent = "Loading...";
  
      try {
        const response = await fetch("http://127.0.0.1:5000/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: selectedText,
            prompt_type: promptType,
            hint: hint || null
          })
        });
  
        const data = await response.json();
        output.textContent = data.explanation || "Failed to get a response.";
      } catch (error) {
        output.textContent = "Error connecting to the server.";
        console.error(error);
      }
    });
  });
  