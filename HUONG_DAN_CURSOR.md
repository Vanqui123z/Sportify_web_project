# 🚀 HƯỚNG DẪN CHẠY SPORTIFY TRÊN CURSOR

## ✅ Có, bạn hoàn toàn có thể chạy dự án Sportify trên Cursor!

Cursor là một IDE tuyệt vời cho Java Spring Boot với AI assistance. Dưới đây là hướng dẫn chi tiết:

## 📋 Chuẩn bị

### 1. Cài đặt Cursor

- Download tại: https://cursor.sh/
- Cài đặt như bình thường

### 2. Cài đặt Extension cần thiết

Mở Cursor và cài đặt:

- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (VMware)

### 3. Chuẩn bị môi trường

- **Java JDK 17** (như hướng dẫn chính)
- **XAMPP** (như hướng dẫn chính)

## 🎯 Các bước chạy trên Cursor

### Bước 1: Mở dự án

1. Mở Cursor
2. **File** → **Open Folder**
3. Chọn thư mục chứa dự án Sportify
4. Click **Select Folder**

### Bước 2: Cấu hình Database

1. Khởi động XAMPP (Apache + MySQL)
2. Mở phpMyAdmin: http://localhost/phpmyadmin
3. Tạo database `sportify`
4. Import file `Database/sportify.sql`

### Bước 3: Chạy ứng dụng

**Cách 1: Sử dụng nút Run**

1. Mở file `src/main/java/duan/sportify/ApplicationConfig.java`
2. Click nút **"Run"** ở góc trên bên phải file
3. Hoặc click chuột phải → **Run Java**

**Cách 2: Sử dụng Command Palette**

1. Nhấn `Ctrl+Shift+P` (Windows) hoặc `Cmd+Shift+P` (Mac)
2. Gõ "Java: Run"
3. Chọn file ApplicationConfig.java

**Cách 3: Sử dụng Terminal**

1. Mở Terminal trong Cursor (` Ctrl+``  `)
2. Chạy lệnh: `mvn spring-boot:run`

### Bước 4: Truy cập website

- **Trang chủ:** http://localhost:8080/sportify
- **Trang admin:** http://localhost:8080/admin/index.html

## 🔧 Xử lý sự cố với Cursor

### Lỗi "Java not found"

```bash
# Kiểm tra Java version
java -version

# Nếu chưa có, cài đặt JDK 17 và thiết lập JAVA_HOME
```

### Lỗi Maven không nhận diện

1. Mở Command Palette (`Ctrl+Shift+P`)
2. Gõ "Java: Reload Projects"
3. Đợi Cursor reload project

### Lỗi Extension không hoạt động

1. Mở Extensions (`Ctrl+Shift+X`)
2. Tìm "Extension Pack for Java"
3. Click **Install** nếu chưa cài
4. Restart Cursor

### Không chạy được Spring Boot

Thử chạy qua Terminal:

```bash
# Trong thư mục dự án
mvn clean install
mvn spring-boot:run
```

## 🎉 Ưu điểm của Cursor

- **AI Assistant:** Hỗ trợ code completion và debugging
- **Lightweight:** Nhanh hơn các IDE truyền thống
- **Modern UI:** Giao diện đẹp và dễ sử dụng
- **Git Integration:** Tích hợp Git tốt
- **Terminal tích hợp:** Không cần mở Terminal riêng

## 📝 Tips sử dụng Cursor hiệu quả

1. **Sử dụng AI Chat:** Nhấn `Ctrl+L` để mở AI chat
2. **Code Completion:** Cursor tự động suggest code
3. **Quick Fix:** Nhấn `Ctrl+.` để xem suggestions
4. **Search:** `Ctrl+Shift+F` để search toàn project
5. **Command Palette:** `Ctrl+Shift+P` cho mọi lệnh

## 🆘 Hỗ trợ

Nếu gặp vấn đề:

- **Email:** teamdev.sportify@gmail.com
- **Documentation:** `Document/Giải pháp đặt sân thể thao.docx`

---

**Chúc bạn code vui vẻ với Cursor! 🎯**
