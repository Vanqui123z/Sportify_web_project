import React, { useRef, useState } from "react";
import AIChatInputWithMedia from "../Others/AIChatInputWithMedia";
import "../../styles/GroupChat.css";
import "../../styles/AIChatbox.css";
import "../../styles/AIChatInputWithMedia.css";

type Message = { 
  role: "user" | "bot" | "typing"; 
  text?: string;
  unknownData?: any;
  infoNeededData?: any;
};

interface UnknownResponse {
  action: string;
  message: string;
}

interface InfoNeededResponse {
  message: string;
}

// Typing indicator component that matches GroupChat styling
const TypingIndicator: React.FC = () => {
  return (
    <div className="ai-typing-container">
      <div className="ai-typing-bubble">
        <div className="typing-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

const AdminAIChatbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [adminId, setAdminId] = useState<string>("");
  const [scale, setScale] = useState(1);

  // Quick replies suggestions for admin
  const quickReplies = [
    "📊 Thống kê doanh thu",
    "🛍️ Quản lý sản phẩm",
    "⚽ Quản lý sân thể thao",
    "👥 Quản lý tài khoản",
    "📅 Quản lý sự kiện",
    "📋 Xem danh sách đặt"
  ];

  // Initialize adminId from localStorage
  React.useEffect(() => {
    let storedAdminId = localStorage.getItem("adminaichatbox_adminId");
    if (!storedAdminId) {
      // Generate a unique adminId if not exists
      storedAdminId = "admin_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("adminaichatbox_adminId", storedAdminId);
    }
    setAdminId(storedAdminId);
  }, []);

  // Load messages from localStorage on mount
  // Track if we've loaded from database
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const loadInitialMessages = async () => {
      const savedMessages = localStorage.getItem("adminaichatbox_messages");
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (error) {
          console.error("Error loading messages from localStorage:", error);
        }
      } else {
        // Only load from database if localStorage is empty
        await loadChatHistoryFromDatabase();
      }
      setIsLoaded(true);
    };
    
    loadInitialMessages();
  }, []);

  // Save messages to localStorage whenever they change (but only after initial load)
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("adminaichatbox_messages", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  // Load chat history from database
  const loadChatHistoryFromDatabase = async () => {
    if (!adminId) return; // Wait until adminId is set
    
    try {
      const res = await fetch(`http://localhost:8081/sportify/rest/ai/admin/history/get-history?adminId=${encodeURIComponent(adminId)}`);
      const data = await res.json();
      
      if (data.status === "success" && data.data && data.data.length > 0) {
        // Convert database format to frontend format
        const dbMessages = data.data.map((item: any) => {
          try {
            const parsedData = item.messageData ? JSON.parse(item.messageData) : {};
            return {
              role: item.role,
              text: item.message || item.response,
              ...parsedData
            };
          } catch {
            return {
              role: item.role,
              text: item.message || item.response
            };
          }
        });
        
        // Load from database only if localStorage is empty
        setMessages(dbMessages);
      }
    } catch (error) {
      console.error("Error loading chat history from database:", error);
    }
  };

  // Save message to database
  const saveMessageToDatabase = async (msg: string, response: any, role: string) => {
    if (!adminId) return; // Wait until adminId is set
    
    try {
      await fetch("http://localhost:8081/sportify/rest/ai/admin/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: adminId,
          message: msg,
          response: typeof response === 'string' ? response : JSON.stringify(response),
          role: role,
          messageData: JSON.stringify(response)
        })
      });
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  };

  React.useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open, isLoading]);

  const appendUserMessage = (text: string) => {
    setMessages((msgs) => [...msgs, { role: "user", text }]);
  };

  const appendBotMessage = (responseData: any) => {
    // Remove typing indicator first
    setIsLoading(false);
    
    // Parse the response based on its structure
    if (typeof responseData === 'string') {
      setMessages((msgs) => [...msgs, { role: "bot", text: responseData }]);
      return;
    }

    // Handle different response types
    if (responseData.action === "UNKNOWN") {
      // Unknown response
      setMessages((msgs) => [...msgs, { role: "bot", unknownData: responseData }]);
    } else if (responseData.message && !responseData.action) {
      // Info needed response
      setMessages((msgs) => [...msgs, { role: "bot", infoNeededData: responseData }]);
    } else {
      // Default case
      setMessages((msgs) => [...msgs, { role: "bot", text: JSON.stringify(responseData) }]);
    }
  };

  const ask = async (msg: string, attachments: File[] = []) => {
    // Validate message is not empty
    if (!msg || !msg.trim()) {
      console.warn("Message is empty, not sending");
      return;
    }

    appendUserMessage(msg);
    // Save user message to database
    await saveMessageToDatabase(msg, null, "user");
    
    setInput("");
    setIsLoading(true);
    
    try {
      // Prepare FormData if there are attachments
      const formData = new FormData();
      formData.append("message", msg.trim());
      
      // Add files to FormData
      attachments.forEach((file) => {
        formData.append("files", file);
      });

      // Sử dụng endpoint admin-chat cho AI trợ lý admin
      const res = await fetch("http://localhost:8081/sportify/rest/ai/admin-chat", {
        method: "POST",
        body: attachments.length > 0 ? formData : JSON.stringify({ message: msg }),
        headers: attachments.length > 0 
          ? undefined 
          : { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Admin Chat Response:", data);
      
      if (data && data.reply) {
        // Nếu reply là HTML, hiển thị nó trực tiếp
        if (typeof data.reply === 'string' && data.reply.includes('<')) {
          setMessages((msgs) => [...msgs, { role: "bot", text: data.reply }]);
          // Save bot response to database
          await saveMessageToDatabase(msg, data.reply, "bot");
        } else {
          appendBotMessage(data.reply);
          // Save bot response to database
          await saveMessageToDatabase(msg, data.reply, "bot");
        }
      } else {
        const fallbackMsg = "Xin lỗi, hiện chưa nhận được phản hồi.";
        appendBotMessage(fallbackMsg);
        // Save bot response to database
        await saveMessageToDatabase(msg, fallbackMsg, "bot");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = "Lỗi kết nối đến AI.";
      appendBotMessage(errorMsg);
      // Save error message to database
      await saveMessageToDatabase(msg, errorMsg, "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const v = input.trim();
    if (v) ask(v);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.7));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Render a message based on its type
  const renderMessage = (message: Message, index: number) => {
    if (message.role === "user") {
      return (
        <div key={index} className="ai-msg ai-user">
          <div className="ai-msg-content">{message.text}</div>
        </div>
      );
    }
    
    if (message.role === "typing") {
      return <TypingIndicator key={index} />;
    }
    
    // Bot responses
    if (message.text) {
      // Nếu text chứa HTML, hiển thị dưới dạng HTML
      if (message.text.includes('<')) {
        return (
          <div 
            key={index} 
            className="ai-msg ai-bot"
          >
            <div
              className="ai-msg-content ai-html-content"
              dangerouslySetInnerHTML={{ __html: message.text }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'A') {
                  const href = target.getAttribute('href');
                  if (href) {
                    // Nếu là absolute URL hoặc relative URL
                    if (href.startsWith('/')) {
                      window.location.href = href;
                    } else if (href.startsWith('http')) {
                      window.open(href, '_blank');
                    }
                    e.preventDefault();
                  }
                }
              }}
            />
          </div>
        );
      }
      return (
        <div key={index} className="ai-msg ai-bot">
          <div className="ai-msg-content">{message.text}</div>
        </div>
      );
    }
    
    if (message.unknownData) {
      return (
        <div key={index} className="ai-msg ai-bot ai-unknown">
          <div className="ai-msg-content">
            {message.unknownData.message}
          </div>
        </div>
      );
    }
    
    if (message.infoNeededData) {
      return (
        <div key={index} className="ai-msg ai-bot ai-info-needed">
          <div className="ai-msg-content">
            {message.infoNeededData.message}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <div
        className="ai-chat-fab"
        title="Chat với Admin AI"
        onClick={() => setOpen((o) => !o)}
        style={{ display: open ? "none" : "flex" }}
      >
        🤖
      </div>
      <div
        className="ai-chat-panel"
        style={{ 
          display: open ? "flex" : "none", 
          flexDirection: "column",
          height: `${600 * scale}px`,
          width: `${450 * scale}px`
        }}
      >
        <div className="ai-chat-header">
          <span>Sportify Admin AI</span>
          <div className="ai-header-actions">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử chat?")) {
                    setMessages([]);
                    localStorage.removeItem("adminaichatbox_messages");
                  }
                }}
                aria-label="Xóa lịch sử"
                title="Xóa lịch sử chat"
                className="ai-clear-btn"
              >
                🗑️
              </button>
            )}
            <button
              onClick={handleZoomOut}
              aria-label="Thu nhỏ"
              title="Thu nhỏ"
              className="ai-zoom-btn"
            >
              ➖
            </button>
            <span className="ai-zoom-display">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              aria-label="Phóng to"
              title="Phóng to"
              className="ai-zoom-btn"
            >
              ➕
            </button>
            {scale !== 1 && (
              <button
                onClick={handleResetZoom}
                aria-label="Reset"
                title="Reset kích thước"
                className="ai-zoom-btn"
              >
                🔄
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
        </div>
        <div 
          className="ai-chat-body" 
          ref={bodyRef}
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          {messages.length === 0 ? (
            <div className="ai-welcome-container">
              <div className="ai-welcome-emoji">🤖</div>
              <div className="ai-welcome-title">
                Xin chào Admin! Tôi là Sportify Admin AI
              </div>
              <div className="ai-welcome-text">
                Hỏi tôi về quản lý sản phẩm, sân, tài khoản, sự kiện, đặt sân, doanh thu hoặc bất cứ điều gì!
              </div>
              <div className="ai-quick-replies">
                {quickReplies.map((reply, i) => (
                  <button 
                    key={i}
                    className="ai-quick-reply"
                    onClick={() => ask(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => renderMessage(message, index))}
              {isLoading && <TypingIndicator />}
            </>
          )}
        </div>
        <AIChatInputWithMedia
          onSendMessage={ask}
          onStartRecording={() => console.log("Recording started")}
          onStopRecording={() => console.log("Recording stopped")}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default AdminAIChatbox;
