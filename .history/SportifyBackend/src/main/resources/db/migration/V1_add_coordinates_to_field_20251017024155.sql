-- Thêm cột latitude và longitude vào bảng field nếu chưa tồn tại
ALTER TABLE field ADD COLUMN IF NOT EXISTS latitude DOUBLE;
ALTER TABLE field ADD COLUMN IF NOT EXISTS longitude DOUBLE;

-- Cập nhật dữ liệu tọa độ cho một số sân mẫu
-- Sân bóng đá An Hội
UPDATE field SET latitude = 10.762622, longitude = 106.682297 WHERE address LIKE '%An Hội%';

-- Sân bóng đá TNG
UPDATE field SET latitude = 10.806052, longitude = 106.714511 WHERE address LIKE '%TNG%';

-- Cập nhật các sân còn lại (mặc định ở trung tâm Sài Gòn)
UPDATE field SET latitude = 10.776532, longitude = 106.700981 WHERE latitude IS NULL;