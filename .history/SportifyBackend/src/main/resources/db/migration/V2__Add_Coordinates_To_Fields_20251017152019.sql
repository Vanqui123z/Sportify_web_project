-- V2__Add_Coordinates_To_Fields.sql
-- Thêm các trường tọa độ cho bảng field

-- Kiểm tra nếu cột chưa tồn tại thì mới thêm vào
ALTER TABLE field 
ADD COLUMN IF NOT EXISTS latitude DOUBLE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS longitude DOUBLE DEFAULT NULL;