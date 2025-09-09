(() => {
  const style = document.createElement("style");
  style.textContent = `
  .ai-chat-fab { position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px; border-radius: 50%; background: #0ea5e9; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 9999; }
  .ai-chat-panel { position: fixed; right: 20px; bottom: 90px; width: 320px; height: 420px; background: #fff; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.25); display: none; flex-direction: column; overflow: hidden; z-index: 9999; border: 1px solid #e5e7eb; }
  .ai-chat-header { padding: 10px 12px; background: #0ea5e9; color: #fff; font-weight: 600; display:flex; align-items:center; justify-content: space-between; }
  .ai-chat-body { flex: 1; padding: 12px; overflow-y: auto; background: #f8fafc; }
  .ai-chat-input { display: flex; border-top: 1px solid #e5e7eb; }
  .ai-chat-input input { flex: 1; padding: 10px; border: none; outline: none; }
  .ai-chat-input button { padding: 0 14px; background: #0ea5e9; color: #fff; border: none; cursor: pointer; }
  .ai-msg { margin: 6px 0; padding: 8px 10px; border-radius: 10px; max-width: 90%; white-space: pre-wrap; }
  .ai-user { background: #dbeafe; margin-left: auto; }
  .ai-bot { background: #e5e7eb; margin-right: auto; }
  `;
  document.head.appendChild(style);

  const fab = document.createElement("div");
  fab.className = "ai-chat-fab";
  fab.title = "Chat với AI";
  fab.innerHTML = "💬";

  const panel = document.createElement("div");
  panel.className = "ai-chat-panel";
  panel.innerHTML = `
    <div class="ai-chat-header">
      <span>Sportify AI</span>
      <button id="aiClose" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer">×</button>
    </div>
    <div class="ai-chat-body" id="aiBody"></div>
    <div class="ai-chat-input">
      <input id="aiInput" type="text" placeholder="Nhập câu hỏi..." />
      <button id="aiSend">Gửi</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector("#aiBody");
  const input = panel.querySelector("#aiInput");
  const send = panel.querySelector("#aiSend");
  const close = panel.querySelector("#aiClose");

  function append(role, text) {
    const el = document.createElement("div");
    el.className = `ai-msg ${role === "user" ? "ai-user" : "ai-bot"}`;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  async function ask(msg) {
    append("user", msg);
    input.value = "";
    try {
      const res = await fetch("/sportify/rest/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (data && data.reply) append("bot", String(data.reply).trim());
      else append("bot", "Xin lỗi, hiện chưa nhận được phản hồi.");
    } catch (e) {
      append("bot", "Lỗi kết nối đến AI.");
    }
  }

  fab.onclick = () => {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
    panel.style.display === "flex" && input.focus();
  };
  close.onclick = () => {
    panel.style.display = "none";
  };
  send.onclick = () => {
    const v = input.value.trim();
    if (v) ask(v);
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = input.value.trim();
      if (v) ask(v);
    }
  });
})();
