import React, { createContext, useContext, useState, useContext as reactUseContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: Date;
  read: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: "success" | "error" | "info" | "warning") => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = reactUseContext(AuthContext);
  const username = user?.username || "guest";
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Khôi phục thông báo từ localStorage nếu có, dựa trên username
    const savedNotifications = localStorage.getItem(`sportifyNotifications_${username}`);
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Cập nhật notifications khi username thay đổi
  React.useEffect(() => {
    if (username) {
      const savedNotifications = localStorage.getItem(`sportifyNotifications_${username}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        setNotifications([]);
      }
    }
  }, [username]);

  // Lưu thông báo vào localStorage khi thay đổi, dựa trên username
  React.useEffect(() => {
    if (username) {
      localStorage.setItem(`sportifyNotifications_${username}`, JSON.stringify(notifications));
    }
  }, [notifications, username]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (message: string, type: "success" | "error" | "info" | "warning") => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Giữ tối đa 20 thông báo
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};