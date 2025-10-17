-- Script để cập nhật tọa độ cho các sân bóng
-- Thực hiện chạy script này trong MySQL để cập nhật dữ liệu

-- Đảm bảo có cột latitude và longitude trong bảng field
ALTER TABLE field 
ADD COLUMN IF NOT EXISTS latitude DOUBLE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS longitude DOUBLE DEFAULT NULL;

-- Cập nhật tọa độ cho các sân bóng cụ thể
-- Sân bóng đá An Hội (địa chỉ: 256 Phạm Huy Ích, Phường 12, Gò Vấp)
UPDATE field 
SET latitude = 10.8363776, longitude = 106.6893312
WHERE address LIKE '%An Hội%' OR address LIKE '%Phạm Huy Ích%Gò Vấp%';

-- Sân bóng đá TNG (địa chỉ: Hẻm Số 2 Tô Ngọc Vân, Ấp Đei, Gò Vấp)
UPDATE field 
SET latitude = 10.8408233, longitude = 106.6802108
WHERE address LIKE '%TNG%' OR address LIKE '%Tô Ngọc Vân%Gò Vấp%';

-- Sân bóng đá Nguyễn Kiệm (Gò Vấp)
UPDATE field 
SET latitude = 10.8230, longitude = 106.6296
WHERE address LIKE '%Nguyễn Kiệm%Gò Vấp%';

-- Sân bóng đá Phan Văn Trị (Gò Vấp)
UPDATE field 
SET latitude = 10.8305, longitude = 106.6635
WHERE address LIKE '%Phan Văn Trị%Gò Vấp%';

-- Sân bóng đá Thủ Đức (Thành phố Thủ Đức)
UPDATE field 
SET latitude = 10.8484, longitude = 106.7811
WHERE address LIKE '%Thủ Đức%';

-- Sân bóng đá Rạch Chiếc (Quận 2)
UPDATE field 
SET latitude = 10.8040, longitude = 106.7605
WHERE address LIKE '%Rạch Chiếc%' OR address LIKE '%Quận 2%';

-- Sân bóng đá Quận 1 (khu vực trung tâm)
UPDATE field 
SET latitude = 10.7769, longitude = 106.6980
WHERE address LIKE '%Quận 1%';

-- Sân bóng đá Quận 10
UPDATE field 
SET latitude = 10.7732, longitude = 106.6674
WHERE address LIKE '%Quận 10%';

-- Sân bóng đá Quận 7 (Phú Mỹ Hưng)
UPDATE field 
SET latitude = 10.7278, longitude = 106.7141
WHERE address LIKE '%Quận 7%' OR address LIKE '%Phú Mỹ Hưng%';

-- Cập nhật tọa độ mặc định cho các sân còn lại chưa có tọa độ
-- Sử dụng tọa độ trung tâm TP.HCM và thêm một chút nhiễu ngẫu nhiên
-- để tránh các sân chồng chéo lên nhau
UPDATE field 
SET 
  latitude = 10.7769 + (RAND() * 0.15 - 0.075), 
  longitude = 106.7 + (RAND() * 0.15 - 0.075)
WHERE latitude IS NULL OR longitude IS NULL;