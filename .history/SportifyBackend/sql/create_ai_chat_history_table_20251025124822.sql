-- Tạo bảng ai_chat_history
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  message LONGTEXT,
  response LONGTEXT,
  role VARCHAR(50) NOT NULL,
  message_data LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Xóa dữ liệu cũ (tuỳ chọn)
-- TRUNCATE TABLE ai_chat_history;
