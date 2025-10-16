# Sportify - Hệ thống đặt sân thể thao

## Tính năng mới - Hệ thống Thông báo

### Mô tả
Hệ thống thông báo được thêm vào để cải thiện trải nghiệm người dùng, giúp người dùng nhận được thông tin kịp thời về các hành động họ thực hiện trong hệ thống như:
- Đặt sân thể thao
- Đặt đội
- Mua hàng và thêm vào giỏ hàng
- Thanh toán thành công
- Và các sự kiện khác

### Cách hoạt động
1. **Hiển thị thông báo**: Thông báo sẽ hiển thị bên cạnh nút giỏ hàng trên thanh điều hướng
2. **Loại thông báo**:
   - Thành công (success): Màu xanh lá
   - Lỗi (error): Màu đỏ
   - Thông tin (info): Màu xanh dương
   - Cảnh báo (warning): Màu vàng

3. **Cách sử dụng**:
   - Click vào biểu tượng thông báo để xem danh sách thông báo
   - Số hiển thị trên biểu tượng thể hiện số thông báo chưa đọc
   - Mỗi thông báo hiển thị nội dung và thời gian nhận được
   - Có thể đánh dấu tất cả là đã đọc hoặc xóa tất cả thông báo

4. **Riêng tư và phân tách dữ liệu**:
   - Mỗi người dùng chỉ nhìn thấy thông báo của riêng mình
   - Thông báo được lưu trữ theo username để đảm bảo tính riêng tư
   - Dữ liệu thông báo được làm mới khi người dùng đăng nhập/đăng xuất

### Công nghệ sử dụng
- React Context API để quản lý trạng thái thông báo
- LocalStorage để lưu trữ thông báo giữa các phiên, sử dụng khóa riêng cho từng người dùng
- Tích hợp với AuthContext để phân biệt thông báo theo người dùng
- REST API để gửi và nhận thông báo từ server

### Cách triển khai
- Frontend: Sử dụng React hooks và Context API
- Quản lý thông báo dựa trên người dùng đăng nhập
- Lưu trữ dữ liệu với cấu trúc `sportifyNotifications_${username}`
- Backend: API endpoints để lưu trữ và quản lý thông báo

### Lợi ích
- Cải thiện UX bằng cách cung cấp phản hồi tức thì cho người dùng
- Giúp người dùng theo dõi lịch sử hoạt động
- Tăng tính tương tác của ứng dụng

## Các tính năng hiện có

- Đối với trang người dùng
  - Đặt sân
  - Mua sắm
  - Tạo đội
  - Sự kiện
  - Nhận thông báo (tính năng mới)

- Đối với trang quản trị
  - Quản lý hóa đơn
  - Quản lý sân thể thao
  - Quản lý sự kiện
  - Báo cáo và thống kê