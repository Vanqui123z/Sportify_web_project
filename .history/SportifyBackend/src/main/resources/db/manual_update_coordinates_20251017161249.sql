-- Kiểm tra tọa độ cho tất cả các sân bóng
SELECT fieldid, namefield, address, latitude, longitude
FROM field
ORDER BY fieldid;

-- Đếm số sân bóng có tọa độ và không có tọa độ
SELECT 
    COUNT(*) AS total_fields,
    SUM(CASE WHEN latitude IS NULL OR longitude IS NULL THEN 1 ELSE 0 END) AS fields_without_coordinates,
    SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) AS fields_with_coordinates
FROM field;

-- Cập nhật tọa độ cho sân có ID cụ thể (thay giá trị theo nhu cầu)
-- UPDATE field SET latitude = 10.8408233, longitude = 106.6802108 WHERE fieldid = 1;

-- Cập nhật tọa độ mặc định cho tất cả sân chưa có tọa độ
-- Tọa độ mặc định: Trung tâm TP HCM
UPDATE field 
SET 
    latitude = 10.7769,
    longitude = 106.7009
WHERE 
    latitude IS NULL OR longitude IS NULL;

-- Kiểm tra lại sau khi cập nhật
SELECT fieldid, namefield, address, latitude, longitude
FROM field
ORDER BY fieldid;