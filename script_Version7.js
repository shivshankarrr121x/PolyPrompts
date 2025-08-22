// ---------------------------
//  FRONTEND-ONLY demo script
//  Only ChatGPT (OpenAI) works.
//  Hard-coded key below (replace with your key).
//  ---------------------------

// === REPLACE THIS with your OpenAI API key ===
const OPENAI_API_KEY = "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";

// --- DOM references
const modelSelect = document.getElementById("modelSelect");
const sendBtn = document.getElementById("chatgpt-send");
const clearBtn = document.getElementById("chatgpt-clear");
const promptEl = document.getElementById("chatgpt-prompt");
const outputEl = document.getElementById("chatgpt-output");
const errorEl = document.getElementById("chatgpt-error");

// Utility: show error
function showError(msg){
  errorEl.textContent = msg || "";
}

// Optional: Ctrl+Enter to send
promptEl.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    sendBtn.click();
  }
});

// Clear handler
clearBtn.addEventListener("click", () => {
  promptEl.value = "";
  outputEl.textContent = "";
  showError("");
});

// Send handler
sendBtn.addEventListener("click", async () => {
  showError("");
  outputEl.textContent = "";

  const prompt = promptEl.value.trim();
  const model = modelSelect.value || "gpt-4o-mini";

  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes("your_api_key_here")) {
    showError("⚠️ Please add your OpenAI API key in script.js (OPENAI_API_KEY).");
    return;
  }
  if (!prompt) {
    showError("Please type a prompt.");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking…";
  promptEl.disabled = true;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `HTTP ${res.status}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "(no response)";
    outputEl.textContent = content;
  } catch (err) {
    outputEl.textContent = "";
    showError("Error: " + (err?.message || err));
    console.error(err);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    promptEl.disabled = false;
  }
});