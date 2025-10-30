# Hướng dẫn xử lý vấn đề hiển thị sân gần nhất

## Vấn đề
Khi sử dụng tính năng "Tìm sân gần nhất", hệ thống có thể không hiển thị kết quả hoặc bị treo ở trạng thái loading liên tục. Vấn đề này thường do thiếu dữ liệu tọa độ (latitude và longitude) cho các sân bóng trong cơ sở dữ liệu.

## Nguyên nhân
- Các sân bóng trong cơ sở dữ liệu không có thông tin tọa độ (latitude và longitude)
- Khi tính năng tìm sân gần nhất cần tính toán khoảng cách, không có dữ liệu để thực hiện phép tính

## Cách giải quyết

### 1. Kiểm tra dữ liệu tọa độ trong database
Kiểm tra xem các sân bóng có dữ liệu tọa độ hay không:
```sql
SELECT fieldid, namefield, latitude, longitude 
FROM field 
WHERE latitude IS NULL OR longitude IS NULL;
```

### 2. Sử dụng API cập nhật tọa độ tự động
Hệ thống đã có sẵn API để cập nhật tọa độ cho tất cả sân bóng. Truy cập URL sau sau khi khởi động backend:
```
http://localhost:8081/api/admin/field/update-coordinates
```

API này sẽ:
- Quét tất cả sân bóng không có tọa độ
- Gán tọa độ dựa trên tên sân hoặc địa chỉ
- Nếu không thể xác định chính xác, sẽ gán tọa độ ngẫu nhiên quanh khu vực trung tâm TP.HCM

### 3. Kiểm tra API tìm sân gần nhất
API tìm sân gần nhất chỉ trả về các sân có dữ liệu tọa độ. Đảm bảo API có thể xử lý tình huống không có sân nào phù hợp.
```
GET /api/sportify/field/nearest?latitude={lat}&longitude={lng}
```

### 4. Cập nhật tọa độ thủ công (nếu cần)
Nếu muốn cập nhật tọa độ chính xác cho một số sân cụ thể, hãy sử dụng SQL:
```sql
UPDATE field 
SET latitude = {lat}, longitude = {lng} 
WHERE fieldid = {id};
```

## Lưu ý
- Đảm bảo người dùng đã cho phép truy cập vị trí trong trình duyệt
- Tọa độ được cập nhật tự động có thể không hoàn toàn chính xác, nên chỉ dùng làm tham khảo
- Nên sử dụng Google Maps API để cập nhật tọa độ chính xác trong môi trường sản xuất

## Kiểm tra hoạt động
Sau khi cập nhật tọa độ, hãy thử lại tính năng tìm sân gần nhất và kiểm tra:
- Sân gần nhất có hiển thị đúng không
- Khoảng cách có hiển thị rõ ràng không
- Thời gian phản hồi có nhanh không

Nếu vẫn gặp vấn đề, hãy kiểm tra logs của backend để tìm lỗi cụ thể.