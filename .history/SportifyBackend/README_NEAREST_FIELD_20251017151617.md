# Hướng dẫn sử dụng tính năng tìm sân gần nhất

## Dành cho người dùng

### Cách sử dụng
1. Truy cập vào trang **Danh sách sân bóng** tại đường dẫn `/sportify/field`
2. Bấm vào nút **"Tìm sân gần nhất"**
3. Hệ thống sẽ yêu cầu quyền truy cập vị trí của bạn. Hãy chọn **"Cho phép"**
4. Hệ thống sẽ hiển thị danh sách các sân bóng được sắp xếp theo khoảng cách gần nhất từ vị trí của bạn
5. Khoảng cách đến từng sân bóng sẽ được hiển thị bên cạnh tên sân

### Lưu ý
- Tính năng này yêu cầu trình duyệt của bạn hỗ trợ Geolocation API
- Bạn cần bật định vị trên thiết bị của mình
- Nếu bạn từ chối cấp quyền truy cập vị trí, tính năng này sẽ không hoạt động

## Dành cho quản trị viên

### Cài đặt và cấu hình
1. Thêm tọa độ cho các sân bóng mới
   - Khi thêm sân bóng mới, hãy điền thông tin kinh độ và vĩ độ vào các trường tương ứng
   - Sử dụng Google Maps để xác định tọa độ của sân bóng

2. Cập nhật tọa độ cho sân bóng hiện có
   - Vào phần quản lý sân bóng
   - Chọn sân bóng cần cập nhật
   - Cập nhật thông tin tọa độ và lưu lại

### Tìm tọa độ từ Google Maps
1. Mở Google Maps và tìm kiếm địa điểm của sân bóng
2. Click chuột phải vào vị trí chính xác của sân và chọn "Thông tin về địa điểm này"
3. Tọa độ sẽ hiển thị dưới dạng hai số (vĩ độ, kinh độ) ở góc dưới
4. Nhập hai số này vào trường "Vĩ độ" và "Kinh độ" trong form quản lý sân bóng

### Lưu ý kỹ thuật
- Đảm bảo nhập đúng định dạng số thập phân cho tọa độ
- Vĩ độ của Việt Nam thường nằm trong khoảng 8-24 độ Bắc
- Kinh độ của Việt Nam thường nằm trong khoảng 102-110 độ Đông
- Nếu bạn nhập sai tọa độ, sân bóng có thể không xuất hiện trong kết quả tìm kiếm hoặc hiển thị sai khoảng cách