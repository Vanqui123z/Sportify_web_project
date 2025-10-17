-- Kiểm tra và khắc phục tọa độ cho các sân bóng
-- Đảm bảo không có sân nào bị thiếu tọa độ hoặc có tọa độ sai
-- Tọa độ hợp lệ cho Việt Nam: vĩ độ khoảng 8-23, kinh độ khoảng 102-109

-- 1. Kiểm tra và sửa tọa độ âm không hợp lệ
UPDATE field 
SET longitude = ABS(longitude)
WHERE longitude < 0 AND longitude IS NOT NULL;

-- 2. Đảm bảo tất cả các sân đều có tọa độ hợp lệ
UPDATE field 
SET 
    latitude = CASE 
        WHEN namefield LIKE '%An Hội%' THEN 10.8363776 
        WHEN namefield LIKE '%TNG%' THEN 10.8408233
        WHEN namefield LIKE '%Nguyễn Kiệm%' OR address LIKE '%Nguyễn Kiệm%' THEN 10.8230
        WHEN namefield LIKE '%Phan Văn Trị%' OR address LIKE '%Phan Văn Trị%' THEN 10.8305
        WHEN namefield LIKE '%Thủ Đức%' OR address LIKE '%Thủ Đức%' THEN 10.8484
        WHEN namefield LIKE '%Quận 1%' OR address LIKE '%Quận 1%' THEN 10.7769
        WHEN namefield LIKE '%Quận 10%' OR address LIKE '%Quận 10%' THEN 10.7732
        WHEN namefield LIKE '%Quận 7%' OR address LIKE '%Quận 7%' THEN 10.7278
        WHEN namefield LIKE '%Quận 2%' OR address LIKE '%Quận 2%' THEN 10.7894
        ELSE 10.7769 + (RAND() * 0.1)  -- Random tọa độ trong khoảng +0.1 độ từ trung tâm TP.HCM
    END,
    longitude = CASE 
        WHEN namefield LIKE '%An Hội%' THEN 106.6893312
        WHEN namefield LIKE '%TNG%' THEN 106.6802108
        WHEN namefield LIKE '%Nguyễn Kiệm%' OR address LIKE '%Nguyễn Kiệm%' THEN 106.6296
        WHEN namefield LIKE '%Phan Văn Trị%' OR address LIKE '%Phan Văn Trị%' THEN 106.6635
        WHEN namefield LIKE '%Thủ Đức%' OR address LIKE '%Thủ Đức%' THEN 106.7811
        WHEN namefield LIKE '%Quận 1%' OR address LIKE '%Quận 1%' THEN 106.6980
        WHEN namefield LIKE '%Quận 10%' OR address LIKE '%Quận 10%' THEN 106.6674
        WHEN namefield LIKE '%Quận 7%' OR address LIKE '%Quận 7%' THEN 106.7141
        WHEN namefield LIKE '%Quận 2%' OR address LIKE '%Quận 2%' THEN 106.7501
        ELSE 106.7 + (RAND() * 0.1)  -- Random tọa độ trong khoảng +0.1 độ từ trung tâm TP.HCM
    END
WHERE latitude IS NULL OR longitude IS NULL OR 
      latitude < 8 OR latitude > 23 OR  -- Kiểm tra vĩ độ hợp lệ cho VN
      longitude < 102 OR longitude > 109;  -- Kiểm tra kinh độ hợp lệ cho VN