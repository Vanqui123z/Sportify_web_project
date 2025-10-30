-- V3__Add_Index_To_Coordinates.sql
-- Thêm chỉ mục (index) cho các cột tọa độ để tìm kiếm nhanh hơn

CREATE INDEX idx_field_coordinates ON field(latitude, longitude);
CREATE INDEX idx_field_sporttype ON field(sporttypeid, status);