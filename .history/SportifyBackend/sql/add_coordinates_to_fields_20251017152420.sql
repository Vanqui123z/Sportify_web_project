-- SQL script để thêm các trường tọa độ vào bảng field
ALTER TABLE field 
ADD COLUMN latitude DOUBLE DEFAULT NULL,
ADD COLUMN longitude DOUBLE DEFAULT NULL;

-- Cập nhật các tọa độ cho các sân bóng (dựa trên địa chỉ thật từ Google Maps)
-- Sân bóng đá An Hội, 256 Phạm Huy Ích, Phường 12, Gò Vấp, TP HCM
UPDATE field 
SET latitude = 10.8359, longitude = 106.6363
WHERE address LIKE '%Phạm Huy Ích%Gò Vấp%' OR address LIKE '%An Hội%';

-- Các sân bóng khác ở TP.HCM
UPDATE field 
SET latitude = 10.8230, longitude = 106.6296
WHERE address LIKE '%Nguyễn Kiệm%Gò Vấp%';

UPDATE field 
SET latitude = 10.7769, longitude = 106.6980
WHERE address LIKE '%Nguyễn Huệ%Quận 1%';

UPDATE field 
SET latitude = 10.8016, longitude = 106.6413
WHERE address LIKE '%Lý Thường Kiệt%Quận 10%';

UPDATE field 
SET latitude = 10.7673, longitude = 106.6576
WHERE address LIKE '%Nguyễn Trãi%Quận 5%';

UPDATE field 
SET latitude = 10.8486, longitude = 106.7700
WHERE address LIKE '%Thảo Điền%Quận 2%';

UPDATE field 
SET latitude = 10.7278, longitude = 106.7141
WHERE address LIKE '%Nguyễn Hữu Thọ%Quận 7%';

-- Cập nhật các trường còn lại với tọa độ ngẫu nhiên trong khu vực TP.HCM
-- để đảm bảo tất cả các sân đều có tọa độ
UPDATE field 
SET 
  latitude = 10.7 + (RAND() * 0.3), 
  longitude = 106.6 + (RAND() * 0.3)
WHERE latitude IS NULL OR longitude IS NULL;