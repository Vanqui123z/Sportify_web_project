-- Đảm bảo tất cả sân đều có tọa độ hợp lệ
-- Loại bỏ tọa độ không hợp lệ và cập nhật lại

-- 1. Kiểm tra và sửa tọa độ âm không hợp lệ
UPDATE field 
SET longitude = ABS(longitude)
WHERE longitude < 0 AND longitude IS NOT NULL;

-- 2. Kiểm tra và đảm bảo tất cả sân đều có tọa độ hợp lệ trong phạm vi Việt Nam
UPDATE field 
SET 
    latitude = CASE 
        WHEN latitude < 8 OR latitude > 23 OR latitude IS NULL THEN 10.7769 + (RAND() * 0.1) 
        ELSE latitude
    END,
    longitude = CASE 
        WHEN longitude < 102 OR longitude > 109 OR longitude IS NULL THEN 106.7 + (RAND() * 0.1)
        ELSE longitude
    END
WHERE status = 1;

-- 3. Đặt lại một số tọa độ cho các sân đặc biệt nếu cần
UPDATE field 
SET 
    latitude = 10.8363776,
    longitude = 106.6893312
WHERE namefield LIKE '%An Hội%' OR fieldid = 1;

UPDATE field 
SET 
    latitude = 10.8408233,
    longitude = 106.6802108
WHERE namefield LIKE '%TNG%' OR fieldid = 2;

-- 4. Ghi log thành công
SELECT 'Field coordinates updated successfully' AS message;