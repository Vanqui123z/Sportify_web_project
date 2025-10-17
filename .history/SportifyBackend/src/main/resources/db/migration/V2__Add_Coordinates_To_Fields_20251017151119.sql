-- V2__Add_Coordinates_To_Fields.sql
-- Thêm các trường tọa độ cho bảng field

ALTER TABLE field 
ADD COLUMN latitude DOUBLE DEFAULT NULL,
ADD COLUMN longitude DOUBLE DEFAULT NULL;