-- SQL script để thêm các trường tọa độ vào bảng field
ALTER TABLE field 
ADD COLUMN latitude DOUBLE DEFAULT NULL,
ADD COLUMN longitude DOUBLE DEFAULT NULL;

-- Cập nhật một số địa điểm mẫu (có thể thay đổi tọa độ thực tế)
-- Ví dụ: Sân bóng đá An Hội nằm tại 256 Phạm Huy Ích, Phường 12, Gò Vấp, TP HCM
UPDATE field 
SET latitude = 10.8359, longitude = 106.6363
WHERE address LIKE '%Phạm Huy Ích%Gò Vấp%';

-- Thêm các tọa độ cho các sân khác tương tự
-- Khi biết địa chỉ chính xác, sử dụng tọa độ thực tế từ Google Maps