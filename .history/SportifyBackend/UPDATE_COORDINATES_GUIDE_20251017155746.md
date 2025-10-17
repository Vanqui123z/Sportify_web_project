## Hướng dẫn cập nhật tọa độ cho các sân bóng

### Phương pháp 1: Sử dụng API cập nhật tự động

1. Khởi động ứng dụng Backend
2. Truy cập API cập nhật tọa độ:
   ```
   http://localhost:8081/api/admin/field/update-coordinates
   ```
3. Hệ thống sẽ tự động cập nhật tọa độ cho các sân bóng dựa trên tên và địa chỉ

### Phương pháp 2: Sử dụng script SQL

1. Mở phpMyAdmin hoặc bất kỳ công cụ quản lý MySQL nào
2. Kết nối đến database Sportify
3. Thực thi script SQL từ file: `sql/update_field_coordinates.sql`

### Kiểm tra sau khi cập nhật

1. Thực hiện truy vấn SQL để xem các sân đã có tọa độ:
   ```sql
   SELECT fieldid, namefield, latitude, longitude FROM field;
   ```

2. Truy cập tính năng "Tìm sân gần nhất" để kiểm tra xem kết quả có hiển thị đúng không

### Lưu ý quan trọng

- Tọa độ được cập nhật dựa trên thông tin địa chỉ hoặc tên sân
- Nếu không tìm thấy thông tin phù hợp, hệ thống sẽ đặt tọa độ ngẫu nhiên xung quanh trung tâm TP.HCM
- Để có tọa độ chính xác hơn, bạn nên thủ công cập nhật tọa độ cho từng sân bóng qua giao diện Admin