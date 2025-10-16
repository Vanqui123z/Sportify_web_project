import React, { useState, useRef, useEffect } from "react";
import { Bell } from "react-feather";
import { useNotification } from "../../helper/NotificationContext";
import "../../styles/Notification.css";

const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Format thời gian thân thiện
  const formatTime = (date: Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return "Vừa xong";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffMinutes < 24 * 60) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffMinutes / (60 * 24));
      return `${days} ngày trước`;
    }
  };

  // Style màu sắc dựa theo loại thông báo
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "notification-success";
      case "error":
        return "notification-error";
      case "warning":
        return "notification-warning";
      case "info":
      default:
        return "notification-info";
    }
  };

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <div className="d-flex align-items-center">
        <button
          className="notification-bell-btn"
          onClick={toggleDropdown}
          aria-label="Thông báo"
        >
          <Bell size={20} color="#fff" />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div className="notification-title">
              <i className="fa fa-bell me-2"></i>
              Thông báo
              {unreadCount > 0 && (
                <span className="ms-2 badge bg-primary rounded-pill">{unreadCount}</span>
              )}
            </div>
            <button className="mark-all-read-btn" onClick={markAllAsRead} title="Đánh dấu đã đọc">
              Đánh dấu đã đọc
            </button>
            <button className="clear-all-btn" onClick={clearNotifications} title="Xóa tất cả">
              Xóa tất cả
            </button>
          </div>

          <div className="notification-body">
            {notifications.length === 0 ? (
              <p className="no-notifications">Không có thông báo nào</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${getNotificationStyle(notification.type)}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="notification-type-icon">
                    {notification.type === 'success' && <i className="fa fa-check-circle"></i>}
                    {notification.type === 'error' && <i className="fa fa-exclamation-circle"></i>}
                    {notification.type === 'warning' && <i className="fa fa-exclamation-triangle"></i>}
                    {notification.type === 'info' && <i className="fa fa-info-circle"></i>}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <small className="notification-time">{formatTime(notification.timestamp)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;