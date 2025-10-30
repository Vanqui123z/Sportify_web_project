# Hướng dẫn giải quyết vấn đề tìm sân gần nhất

## Các vấn đề và giải pháp đã thực hiện

### Vấn đề 1: Tọa độ không hợp lệ
- **Vấn đề**: Tọa độ lấy từ trình duyệt có thể không chính xác hoặc nằm ngoài Việt Nam
- **Giải pháp**: Kiểm tra và điều chỉnh tọa độ trước khi gửi API

### Vấn đề 2: Công thức tính khoảng cách
- **Vấn đề**: Công thức SQL có thể gặp lỗi với các giá trị vượt quá phạm vi của hàm acos
- **Giải pháp**: Sử dụng LEAST(1, ...) để giới hạn giá trị trong phạm vi hợp lệ

### Vấn đề 3: Dữ liệu tọa độ thiếu hoặc không chính xác
- **Vấn đề**: Một số sân không có tọa độ hoặc có tọa độ không chính xác
- **Giải pháp**: Tạo migration để cập nhật tọa độ cho tất cả sân

## Hướng dẫn sử dụng

1. Khởi động lại cả frontend và backend:
   - Backend: `mvn spring-boot:run`
   - Frontend: `npm run dev`

2. Để tìm sân gần nhất:
   - Cho phép truy cập vị trí trong trình duyệt
   - Nhấn nút "Tìm sân gần nhất"

3. Nếu vẫn gặp lỗi:
   - Kiểm tra log backend để xác định nguyên nhân
   - Kiểm tra console trình duyệt để xem thông báo lỗi từ frontend
   - Có thể sử dụng tọa độ mặc định (10.7769, 106.7) để thử nghiệm

## Cách khắc phục lỗi thủ công

Nếu vẫn gặp lỗi, có thể thực hiện các bước sau:

1. Vào phpMyAdmin kiểm tra dữ liệu trong bảng field
2. Đảm bảo tất cả sân đều có tọa độ trong phạm vi hợp lệ của Việt Nam:
   - latitude: 8 đến 23
   - longitude: 102 đến 109
3. Chạy lệnh SQL để sửa tọa độ không hợp lệ:
   ```sql
   UPDATE field 
   SET 
       latitude = 10.7769 + (RAND() * 0.1),
       longitude = 106.7 + (RAND() * 0.1)
   WHERE latitude IS NULL OR longitude IS NULL OR 
         latitude < 8 OR latitude > 23 OR
         longitude < 102 OR longitude > 109;
   ```