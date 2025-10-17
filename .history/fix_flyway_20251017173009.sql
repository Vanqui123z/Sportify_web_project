-- Script để sửa lỗi migration thất bại
-- Chạy script này trong phpMyAdmin hoặc MySQL client trước khi khởi động lại ứng dụng

-- 1. Xóa migration thất bại
DELETE FROM flyway_schema_history
WHERE version = '6' AND success = 0;

-- 2. Nếu bạn đã tạo bảng flyway_schema_history_sportify thủ công, hãy xóa nó
-- DROP TABLE IF EXISTS flyway_schema_history_sportify;

-- 3. Nếu cần thiết, đặt lại checksum để Flyway không phàn nàn về các thay đổi
-- UPDATE flyway_schema_history SET checksum = NULL WHERE version = '5';