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

/**
 * Làm sạch markdown formatting từ text
 */
const cleanMarkdownFormatting = (text: string): string => {
  if (!text) return "";
  
  // Loại bỏ các dòng ngang Markdown (---, ___, ***)
  text = text.replace(/^(---|__|___|\*\*\*)(\s|$)/gm, "\n");
  
  // Loại bỏ các header Markdown (###, ##, #)
  text = text.replace(/^#+\s+/gm, "");
  
  // Loại bỏ bold formatting (**text** hoặc __text__)
  text = text.replace(/\*\*(.+?)\*\*/g, "$1");
  text = text.replace(/__(.+?)__/g, "$1");
  
  // Loại bỏ italic formatting (*text* hoặc _text_)
  text = text.replace(/\*(.+?)\*/g, "$1");
  text = text.replace(/_(.+?)_/g, "$1");
  
  // Loại bỏ backticks (code formatting)
  text = text.replace(/`(.+?)`/g, "$1");
  
  // Loại bỏ highlight/emphasis (~~text~~)
  text = text.replace(/~~(.+?)~~/g, "$1");
  
  // Loại bỏ các bullet points Markdown (-, *, +) nhưng giữ lại content
  text = text.replace(/^\s*[\-\*\+]\s+/gm, "• ");
  
  // Dọn sạch khoảng trắng thừa
  text = text.replace(/\n\n\n+/g, "\n\n");
  text = text.trim();
  
  return text;
};

const OwnerAIChatbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [ownerId, setOwnerId] = useState<string>("");

  // Quick replies suggestions for owner
  const quickReplies = [
    "📊 Quản lý sân thể thao",
    "🕐 Quản lý thời gian mở cửa",
    "📅 Quản lý đặt sân",
    "💰 Thống kê doanh thu",
    "👥 Quản lý khách hàng",
    "📝 Xem đánh giá"
  ];

  // Initialize ownerId from localStorage
  React.useEffect(() => {
    let storedOwnerId = localStorage.getItem("owneraichatbox_ownerId");
    if (!storedOwnerId) {
      // Generate a unique ownerId if not exists
      storedOwnerId = "owner_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("owneraichatbox_ownerId", storedOwnerId);
    }
    setOwnerId(storedOwnerId);
  }, []);

  // Load messages from localStorage on mount
  // Track if we've loaded from database
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const loadInitialMessages = async () => {
      const savedMessages = localStorage.getItem("owneraichatbox_messages");
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
      localStorage.setItem("owneraichatbox_messages", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  // Load chat history from database (using admin endpoint for owner)
  const loadChatHistoryFromDatabase = async () => {
    if (!ownerId) return; // Wait until ownerId is set
    
    try {
      const res = await fetch(`http://localhost:8081/sportify/rest/ai/admin/history/get-history?adminId=${encodeURIComponent(ownerId)}`);
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

  // Save message to database (using admin endpoint for owner)
  const saveMessageToDatabase = async (msg: string, response: any, role: string) => {
    if (!ownerId) return; // Wait until ownerId is set
    
    try {
      await fetch("http://localhost:8081/sportify/rest/ai/admin/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: ownerId,
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
    
    // setInput("");  // input state not currently used in this component
    setIsLoading(true);
    
    try {
      // Prepare FormData if there are attachments
      const formData = new FormData();
      formData.append("message", msg.trim());
      
      // Add files to FormData
      attachments.forEach((file) => {
        formData.append("files", file);
      });

      // Sử dụng endpoint admin-chat cho AI trợ lý owner (sử dụng cùng endpoint với admin)
      const res = await fetch("http://localhost:8081/sportify/rest/ai/admin-chat", {
        method: "POST",
        body: attachments.length > 0 ? formData : JSON.stringify({ message: msg }),
        headers: attachments.length > 0 
          ? undefined 
          : { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Owner Chat Response:", data);
      
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
      // Plain text - apply markdown cleanup
      const cleanedText = cleanMarkdownFormatting(message.text);
      return (
        <div key={index} className="ai-msg ai-bot">
          <div className="ai-msg-content ai-text-plain">{cleanedText}</div>
        </div>
      );
    }
    
    if (message.unknownData) {
      const cleanedMessage = cleanMarkdownFormatting(message.unknownData.message);
      return (
        <div key={index} className="ai-msg ai-bot ai-unknown">
          <div className="ai-msg-content ai-text-plain">
            {cleanedMessage}
          </div>
        </div>
      );
    }
    
    if (message.infoNeededData) {
      const cleanedMessage = cleanMarkdownFormatting(message.infoNeededData.message);
      return (
        <div key={index} className="ai-msg ai-bot ai-info-needed">
          <div className="ai-msg-content ai-text-plain">
            {cleanedMessage}
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
        title="Chat với Owner AI"
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
          width: isMaximized ? "100%" : "450px",
          height: isMaximized ? "100%" : "600px",
          right: isMaximized ? "0" : "20px",
          bottom: isMaximized ? "0" : "90px",
          borderRadius: isMaximized ? "0" : "16px",
          maxHeight: isMaximized ? "100vh" : "600px",
        }}
      >
        <div className="ai-chat-header">
          <span>Sportify Owner AI</span>
          <div className="ai-header-actions">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử chat?")) {
                    setMessages([]);
                    localStorage.removeItem("owneraichatbox_messages");
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
              onClick={() => setIsMaximized(!isMaximized)}
              aria-label="Phóng to/Khôi phục"
              title="Phóng to/Khôi phục kích thước"
              className="ai-window-btn"
            >
              {isMaximized ? "❐" : "□"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setIsMaximized(false);
              }}
              aria-label="Đóng"
              title="Đóng"
              className="ai-window-btn"
            >
              ×
            </button>
          </div>
        </div>
        <div className="ai-chat-body" ref={bodyRef}>
          {messages.length === 0 ? (
            <div className="ai-welcome-container">
              <div className="ai-welcome-emoji">🤖</div>
              <div className="ai-welcome-title">
                Xin chào chủ sân! Tôi là Sportify Owner AI
              </div>
              <div className="ai-welcome-text">
                Hỏi tôi về quản lý sân, thời gian mở cửa, đặt sân, doanh thu, khách hàng, đánh giá hoặc bất cứ điều gì!
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

export default OwnerAIChatbox;
