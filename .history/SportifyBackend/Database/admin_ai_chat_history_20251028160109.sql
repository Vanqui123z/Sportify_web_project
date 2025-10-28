-- Create Admin AI Chat History Table
-- Table để lưu lịch sử chat giữa Admin và AI

CREATE TABLE IF NOT EXISTS admin_ai_chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(100) NOT NULL,
    message LONGTEXT,
    response LONGTEXT,
    role VARCHAR(20),
    message_data LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);

-- Thêm comment để mô tả
ALTER TABLE admin_ai_chat_history COMMENT = 'Bảng lưu lịch sử chat giữa Admin và AI Assistant';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN admin_id VARCHAR(100) COMMENT 'Admin ID hoặc username';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN message LONGTEXT COMMENT 'Tin nhắn từ admin';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN response LONGTEXT COMMENT 'Phản hồi từ AI';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN role VARCHAR(20) COMMENT 'user hoặc bot';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN message_data LONGTEXT COMMENT 'JSON data từ response';
ALTER TABLE admin_ai_chat_history MODIFY COLUMN created_at TIMESTAMP COMMENT 'Thời gian tạo bản ghi';
