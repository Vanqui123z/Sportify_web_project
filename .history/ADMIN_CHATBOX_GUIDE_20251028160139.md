# 🤖 Admin AI Chatbox - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Admin AI Chatbox là một tính năng trợ lý AI thông minh giúp admin quản lý hệ thống Sportify. Nó hoạt động y hệt chatbox khách hàng nhưng với logic và context khác nhau, tối ưu hóa cho công việc quản lý.

## ✨ Tính Năng Chính

### 1. **Quản Lý Sản Phẩm**
- Xem danh sách sản phẩm
- Thống kê tồn kho
- Giá cả sản phẩm
- Danh mục sản phẩm

### 2. **Quản Lý Sân Thể Thao**
- Xem danh sách sân
- Trạng thái hoạt động
- Giá thuê sân
- Địa chỉ sân

### 3. **Quản Lý Tài Khoản**
- Xem tổng số người dùng
- Số người dùng hoạt động
- Chi tiết tài khoản
- Khóa/mở khóa tài khoản

### 4. **Quản Lý Sự Kiện**
- Xem danh sách sự kiện/đội
- Tạo sự kiện mới
- Sửa/xóa sự kiện

### 5. **Quản Lý Đặt Sân**
- Xem danh sách đặt sân
- Chi tiết booking
- Hủy/xác nhận đặt sân

### 6. **Quản Lý Danh Mục**
- Danh sách danh mục
- Quản lý danh mục sản phẩm

### 7. **Ca Sân & Giờ Mở Cửa**
- Xem danh sách ca sân
- Thêm/xóa ca sân

### 8. **Doanh Thu & Báo Cáo**
- Xem tổng doanh thu
- Thống kê theo tháng
- Báo cáo chi tiết

## 🏗️ Cấu Trúc Thư Mục

### Frontend
```
SportifyFrontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminAIChatbox.tsx          ✨ Main component
│   │   └── Others/
│   │       └── AIChatInputWithMedia.tsx     (Reused)
│   └── layouts/
│       └── LayoutAdmin.tsx                  (Import AdminAIChatbox)
```

### Backend
```
SportifyBackend/
├── src/main/java/duan/sportify/
│   ├── rest/controller/
│   │   ├── AdminAIChatController.java           ✨ Main endpoint
│   │   └── AdminAIChatHistoryController.java    ✨ History endpoints
│   ├── service/
│   │   ├── impl/AdminGeminiServiceImpl.java     ✨ AI service
│   │   └── AdminAIChatHistoryService.java       ✨ Service
│   ├── repositories/
│   │   └── AdminAIChatHistoryRepository.java    ✨ Repository
│   ├── entities/
│   │   └── AdminAIChatHistory.java              ✨ Entity
│   └── utils/AI/
│       └── AIServiceFactory.java                (Updated)
├── Database/
│   └── admin_ai_chat_history.sql                ✨ SQL script
└── resources/prompts/
    └── AI_admin_prompt.txt                      ✨ Admin prompt
```

## 🚀 Cách Hoạt Động

### Luồng Dữ Liệu

```
Admin Input
    ↓
Frontend gửi request → /sportify/rest/ai/admin-chat
    ↓
Backend nhận request
    ↓
AdminGeminiServiceImpl xử lý:
  1. Lấy dữ liệu từ các service (Product, Field, User, Event...)
  2. Build HTML context
  3. Gửi prompt lên Gemini API
  4. Nhận response
    ↓
Frontend nhận JSON response → Render
    ↓
Lưu vào localStorage + Database
```

### Hiệu Năng

- **Storage**: localStorage cho session hiện tại
- **Persistence**: Database cho lịch sử lâu dài
- **Context**: 30 phút timeout (tự động xóa nếu không dùng)
- **Retry**: 3 lần thử nếu API fail

## 📝 Cách Sử Dụng

### Cho Admin

1. **Mở Chatbox**: Click nút 🤖 ở góc phải dashboard
2. **Chat**: Gõ câu hỏi (ví dụ: "Thống kê doanh thu tháng 10")
3. **Quick Replies**: Click các nút gợi ý nhanh
4. **Xóa Lịch Sử**: Click 🗑️ để xóa toàn bộ chat

### Ví Dụ Câu Hỏi

```
- "Cho tôi xem danh sách sản phẩm"
- "Có bao nhiêu người dùng hoạt động?"
- "Doanh thu của tháng 10 là bao nhiêu?"
- "Quản lý sân nào được đặt nhiều nhất?"
- "Liệt kê các đơn đặt chưa xác nhận"
- "Số lượng tồn kho sản phẩm loại A"
- "Thêm ca sân mới 16:00-17:00"
```

## 🔧 Cài Đặt & Triển Khai

### 1. Database

Chạy SQL script:
```sql
-- File: SportifyBackend/Database/admin_ai_chat_history.sql
CREATE TABLE admin_ai_chat_history (...)
```

### 2. Compile & Build

**Frontend:**
```bash
cd SportifyFrontend
npm install
npm run build
```

**Backend:**
```bash
cd SportifyBackend
mvn clean install
mvn spring-boot:run
```

### 3. Kiểm Tra API

```bash
# Test endpoint
curl -X POST http://localhost:8081/sportify/rest/ai/admin-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Cho tôi xem danh sách sản phẩm"}'

# Expected response:
{
  "reply": "<h3>📦 Quản Lý Sản Phẩm</h3>...",
  "status": "success"
}
```

## 🔐 Bảo Mật

- **Access Control**: Chỉ admin có thể truy cập
  - Kiểm tra role = "Admin" trong LayoutAdmin.tsx
- **Data Validation**: Validate message không rỗng
- **API Key**: Gemini API key trong properties
- **CORS**: Configured cho localhost + production

## 📊 Database Schema

```sql
admin_ai_chat_history:
├── id (BIGINT, PK)
├── admin_id (VARCHAR 100)
├── message (LONGTEXT)
├── response (LONGTEXT)
├── role (VARCHAR 20) -- 'user' hoặc 'bot'
├── message_data (LONGTEXT) -- JSON
└── created_at (TIMESTAMP)

Indexes:
├── idx_admin_id
└── idx_created_at
```

## 🎨 Styling

- Reuse CSS từ AIChatbox: `AIChatbox.css`, `GroupChat.css`, `AIChatInputWithMedia.css`
- Tất cả styling được tái sử dụng
- FAB button icon: 🤖 (khác với 💬 của customer)

## 🛠️ Troubleshooting

| Lỗi | Giải Pháp |
|-----|----------|
| API connection error | Kiểm tra `localhost:8081` có chạy không |
| Gemini API key invalid | Cập nhật key trong `application.properties` |
| CORS error | Kiểm tra `@CrossOrigin("*")` trong controller |
| Database connection | Chạy SQL migration script |
| Component not rendering | Kiểm tra AdminAIChatbox import trong LayoutAdmin |

## 📈 Tương Lai

### Cải Tiến Tiềm Năng

1. **Advanced Analytics**: Biểu đồ doanh thu realtime
2. **Export Reports**: Export PDF, Excel
3. **Scheduled Messages**: Nhắc nhở định kỳ
4. **Multi-language**: Tiếng Anh, Trung Quốc
5. **Voice Commands**: Điều khiển bằng giọng nói
6. **Advanced Filtering**: Tìm kiếm nâng cao
7. **Webhooks**: Tích hợp external services

## 👨‍💻 Nhà Phát Triển

- **Frontend**: React + TypeScript
- **Backend**: Spring Boot + Gemini API
- **Database**: MySQL
- **AI Model**: Google Generative AI (Gemini 2.0 Flash)

## 📞 Support

Nếu có vấn đề, hãy kiểm tra:
1. Browser console (F12)
2. Server logs (terminal)
3. Database logs
4. API response (Network tab)

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28
