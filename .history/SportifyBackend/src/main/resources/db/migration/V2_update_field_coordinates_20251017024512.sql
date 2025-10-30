-- Thêm mẫu dữ liệu tọa độ cho các sân bóng

-- 1. Tạo bảng tạm để lưu thông tin tọa độ
CREATE TABLE IF NOT EXISTS temp_field_coordinates (
    address_pattern VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE
);

-- 2. Thêm dữ liệu tọa độ vào bảng tạm
INSERT INTO temp_field_coordinates (address_pattern, latitude, longitude) VALUES
('An Hội', 10.762622, 106.682297),
('TNG', 10.806052, 106.714511),
('Phan Huy Ích', 10.828109, 106.646340),
('Tô Ngọc Vân', 10.825708, 106.705988),
('Gò Vấp', 10.828529, 106.666657),
('Thủ Đức', 10.869729, 106.741545),
('Bình Thạnh', 10.802074, 106.714981),
('Quận 1', 10.776532, 106.700981),
('Quận 2', 10.776786, 106.749507),
('Quận 3', 10.777731, 106.682315),
('Quận 4', 10.756555, 106.704437),
('Quận 5', 10.755341, 106.666650),
('Quận 6', 10.744858, 106.641501),
('Quận 7', 10.739177, 106.720810),
('Quận 8', 10.722591, 106.626297),
('Quận 9', 10.840302, 106.810682),
('Quận 10', 10.772411, 106.667449),
('Quận 11', 10.762046, 106.649836),
('Quận 12', 10.867308, 106.647041),
('Phú Nhuận', 10.799635, 106.680352),
('Tân Bình', 10.798992, 106.650026),
('Tân Phú', 10.789484, 106.625099),
('Bình Tân', 10.765468, 106.611133);

-- 3. Cập nhật tọa độ cho các sân dựa vào địa chỉ
UPDATE field f
LEFT JOIN temp_field_coordinates t ON f.address LIKE CONCAT('%', t.address_pattern, '%')
SET 
    f.latitude = COALESCE(f.latitude, t.latitude),
    f.longitude = COALESCE(f.longitude, t.longitude);

-- 4. Cập nhật các sân còn lại với tọa độ mặc định (Trung tâm Sài Gòn)
UPDATE field
SET 
    latitude = COALESCE(latitude, 10.776532),
    longitude = COALESCE(longitude, 106.700981)
WHERE latitude IS NULL OR longitude IS NULL;

-- 5. Xóa bảng tạm
DROP TABLE IF EXISTS temp_field_coordinates;