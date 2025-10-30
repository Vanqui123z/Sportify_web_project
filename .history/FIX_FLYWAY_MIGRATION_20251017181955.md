# Hướng dẫn khắc phục lỗi "Failed migration to version 6"

## Vấn đề
Backend không thể khởi động vì lỗi: `Schema 'sportify' contains a failed migration to version 6 !`

## Nguyên nhân
- File migration `V6__Fix_All_Field_Coordinates.sql` có câu lệnh không hợp lệ khi cố gắng thêm dữ liệu vào bảng quản lý của Flyway.
- Khi migration thất bại, Flyway đánh dấu nó là thất bại trong database và từ chối khởi động ứng dụng.

## Cách khắc phục

### Bước 1: Xóa trạng thái migration thất bại
1. Mở phpMyAdmin (http://localhost/phpmyadmin)
2. Chọn database `sportify`
3. Chọn tab SQL và chạy lệnh sau:
   ```sql
   DELETE FROM flyway_schema_history
   WHERE version = '6' AND success = 0;
   ```

### Bước 2: Nếu cần, hãy sửa tọa độ trực tiếp trong database
1. Trong phpMyAdmin, chọn bảng `field`
2. Chạy lệnh sau để đảm bảo tọa độ hợp lệ:
   ```sql
   UPDATE field 
   SET longitude = ABS(longitude)
   WHERE longitude < 0 AND longitude IS NOT NULL;

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
   ```

### Bước 3: Khởi động lại ứng dụng
1. Khởi động lại backend: `mvn spring-boot:run`
2. Khởi động lại frontend (nếu cần): `npm run dev`

## Kiểm tra
Sau khi khởi động lại ứng dụng, kiểm tra tính năng tìm sân gần nhất để xác minh nó hoạt động:
1. Truy cập trang chủ
2. Nhấp vào "Tìm sân gần nhất"
3. Xem kết quả được hiển thị

## Nếu vẫn gặp vấn đề
Nếu vẫn không thể khởi động ứng dụng, hãy thử:
1. Xóa hoàn toàn bảng `flyway_schema_history` (cẩn thận!)
   ```sql
   DROP TABLE flyway_schema_history;
   ```
2. Xóa và tạo lại database từ đầu
3. Khôi phục từ bản sao lưu nếu có