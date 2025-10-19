import React, { useRef, useState } from "react";
import CustomCard from "../user/CustomCard";
import "../../styles/GroupChat.css";
import "../../styles/AIChatbox.css";
import getImageUrl from "../../helper/getImageUrl";

type Message = { 
  role: "user" | "bot" | "typing"; 
  text?: string;
  fieldData?: any;
  shiftData?: any;
  bookingData?: any;
  unknownData?: any;
  infoNeededData?: any;
};

// Type definition for API responses
interface Field {
  fieldid: number;
  namefield: string;
  descriptionfield: string;
  address: string;
  price: number;
  image: string;
  sporttype: {
    sporttypeid: string;
    categoryname: string;
  };
  status: boolean;
}

interface Shift {
  shiftid: number;
  timeStart: string;
  timeEnd: string;
  nameshift?: string;
  price?: number;
}

// Updated interface for the new shift response format
interface AvailableShiftsResponse {
  fieldId: number;
  fieldName: string;
  date: string;
  message: string;
  availableShifts: Shift[];
}

interface FieldResponse {
  fields: Field[];
}

interface BookingResponse {
  fieldName: string;
  date: string;
  time: string;
  redirectUrl: string;
  message: string;
}

interface UnknownResponse {
  action: string;
  message: string;
}

interface InfoNeededResponse {
  message: string;
}

// Field list component
const FieldList: React.FC<{ fields: Field[] }> = ({ fields }) => {
  return (
    <div className="ai-field-grid">
      {fields.map((field) => (
        <CustomCard
          key={field.fieldid}
          id={field.fieldid}
          title={field.namefield}
          image={getImageUrl(field.image)}
          link={`/sportify/field/detail/${field.fieldid}`}
          badgeText={field.sporttype.categoryname}
          badgeColor="bg-success"
          extraInfo={
            <div>
              <div><i className="fas fa-map-marker-alt me-1"></i>{field.address}</div>
              <div className="mt-1 fw-bold text-primary">
                <i className="fas fa-tag me-1"></i>{field.price.toLocaleString('vi-VN')}đ/giờ
              </div>
            </div>
          }
          buttonText="Xem chi tiết"
        />
      ))}
    </div>
  );
};

// New component for displaying available shifts
const AvailableShifts: React.FC<{ data: AvailableShiftsResponse }> = ({ data }) => {
  return (
    <div className="ai-shifts-container">
      <div className="fw-bold mb-2">{data.message}</div>
      <div className="text-muted mb-2">Sân: {data.fieldName} - Ngày: {data.date}</div>
      
      <div className="ai-shifts-list">
        {data.availableShifts.map(shift => (
          <div key={shift.shiftid} className="ai-shift-card">
            <div className="ai-shift-time">{shift.timeStart} - {shift.timeEnd}</div>
            <div className="ai-shift-name">{shift.nameshift || `Ca ${shift.shiftid}`}</div>
            {shift.price && <div className="text-primary fw-bold">{shift.price.toLocaleString('vi-VN')}đ</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for groups of shifts - keeping for backward compatibility
const ShiftGroups: React.FC<{ data: any }> = ({ data }) => {
  // Handle both old and new format
  if (data.availableShifts) {
    return <AvailableShifts data={data} />;
  }
  
  return (
    <div>
      <div className="fw-bold mb-2">{data.message}</div>
      <div className="text-muted mb-2">Sân: {data.fieldName} - Ngày: {data.date}</div>
      
      {data.availableShiftGroups?.map((group: any, index: number) => (
        <div key={index} className="ai-shift-group">
          <div className="fw-bold mb-2">Nhóm ca {index + 1}:</div>
          {group.map((shift: any) => (
            <div key={shift.shiftid} className="ai-shift-item">
              <div>{shift.timeStart} - {shift.timeEnd}</div>
              <div className="text-primary fw-bold">{shift.nameshift}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Booking info component
const BookingInfo: React.FC<{ data: BookingResponse }> = ({ data }) => {
  React.useEffect(() => {
    // Redirect after showing message
    const timer = setTimeout(() => {
      window.location.href = data.redirectUrl;
    }, 3000);
    return () => clearTimeout(timer);
  }, [data.redirectUrl]);

  return (
    <div className="ai-book-info">
      <div className="fw-bold">{data.message}</div>
      <div>Sân: {data.fieldName}</div>
      <div>Ngày: {data.date}</div>
      <div>Giờ: {data.time}</div>
      <div className="mt-2">
        <a href={data.redirectUrl} className="btn btn-sm btn-primary">
          Đặt ngay
        </a>
      </div>
    </div>
  );
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

const AIChatbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

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
    if (responseData.fields) {
      // Fields response
      setMessages((msgs) => [...msgs, { role: "bot", fieldData: responseData }]);
    } else if (responseData.availableShifts || responseData.availableShiftGroups) {
      // Shifts response - handle both formats
      setMessages((msgs) => [...msgs, { role: "bot", shiftData: responseData }]);
    } else if (responseData.redirectUrl) {
      // Booking response
      setMessages((msgs) => [...msgs, { role: "bot", bookingData: responseData }]);
    } else if (responseData.action === "UNKNOWN") {
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

  const ask = async (msg: string) => {
    appendUserMessage(msg);
    setInput("");
    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:8081/sportify/rest/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      console.log(data);
      
      if (data && data.reply) {
        appendBotMessage(data.reply);
      } else {
        appendBotMessage("Xin lỗi, hiện chưa nhận được phản hồi.");
      }
    } catch {
      setIsLoading(false);
      appendBotMessage("Lỗi kết nối đến AI.");
    }
  };

  const handleSend = () => {
    const v = input.trim();
    if (v) ask(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Render a message based on its type
  const renderMessage = (message: Message, index: number) => {
    if (message.role === "user") {
      return <div key={index} className="ai-msg ai-user">{message.text}</div>;
    }
    
    if (message.role === "typing") {
      return <TypingIndicator key={index} />;
    }
    
    // Bot responses
    if (message.text) {
      return <div key={index} className="ai-msg ai-bot">{message.text}</div>;
    }
    
    if (message.fieldData) {
      return (
        <div key={index} className="ai-msg ai-bot">
          <FieldList fields={message.fieldData.fields} />
        </div>
      );
    }
    
    if (message.shiftData) {
      return (
        <div key={index} className="ai-msg ai-bot">
          <ShiftGroups data={message.shiftData} />
        </div>
      );
    }
    
    if (message.bookingData) {
      return (
        <div key={index} className="ai-msg ai-bot">
          <BookingInfo data={message.bookingData} />
        </div>
      );
    }
    
    if (message.unknownData) {
      return (
        <div key={index} className="ai-msg ai-bot ai-unknown">
          {message.unknownData.message}
        </div>
      );
    }
    
    if (message.infoNeededData) {
      return (
        <div key={index} className="ai-msg ai-bot ai-info-needed">
          {message.infoNeededData.message}
        </div>
      );
    }
    
    return null;
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
            onClick={() => setOpen(false)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="ai-chat-body" ref={bodyRef}>
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && <TypingIndicator />}
        </div>
        <div className="ai-chat-input">
          <input
            type="text"
            placeholder="Nhập câu hỏi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            Gửi
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatbox;
    