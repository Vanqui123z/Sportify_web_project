import React, { useRef, useState } from "react";

const style = `
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

type Message = { role: "user" | "bot"; text: string };

const AIChatbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Inject style only once
    if (!document.getElementById("ai-chatbox-style")) {
      const s = document.createElement("style");
      s.id = "ai-chatbox-style";
      s.textContent = style;
      document.head.appendChild(s);
    }
  }, []);

  React.useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const append = (role: "user" | "bot", text: string) => {
    setMessages((msgs) => [...msgs, { role, text }]);
  };

  const ask = async (msg: string) => {
    append("user", msg);
    setInput("");
    try {
      const res = await fetch("http://localhost:8081/sportify/rest/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (data && data.reply) append("bot", String(data.reply).trim());
      else append("bot", "Xin lỗi, hiện chưa nhận được phản hồi.");
    } catch {
      append("bot", "Lỗi kết nối đến AI.");
    }
  };

  const handleSend = () => {
    const v = input.trim();
    if (v) ask(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <div
        className="ai-chat-fab"
        title="Chat với AI"
        onClick={() => setOpen((o) => !o)}
        style={{ display: open ? "none" : "flex" }}
      >
        💬
      </div>
      <div
        className="ai-chat-panel"
        style={{ display: open ? "flex" : "none", flexDirection: "column" }}
      >
        <div className="ai-chat-header">
          <span>Sportify AI</span>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => setOpen(false)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="ai-chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ai-${m.role}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="ai-chat-input">
          <input
            type="text"
            placeholder="Nhập câu hỏi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Gửi</button>
        </div>
      </div>
    </>
  );
};

export default AIChatbox;
