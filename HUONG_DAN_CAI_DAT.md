# HƯỚNG DẪN CÀI ĐẶT WEBSITE SPORTIFY

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu cài đặt, bạn cần chuẩn bị các phần mềm sau:

### 1. Java Development Kit (JDK) 17

- **Download:** https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- **Hoặc:** https://adoptium.net/ (OpenJDK)
- **Cài đặt:** Thiết lập biến môi trường JAVA_HOME

### 2. XAMPP

- **Download:** https://www.apachefriends.org/download.html
- **Mục đích:** Cung cấp MySQL và phpMyAdmin

### 3. IDE (Tùy chọn)

- **Cursor:** https://cursor.sh/ (Khuyến nghị - AI-powered IDE)
- **Spring Tool Suite 4:** https://spring.io/tools
- **IntelliJ IDEA:** https://www.jetbrains.com/idea/
- **Eclipse:** https://www.eclipse.org/downloads/
- **Visual Studio Code:** https://code.visualstudio.com/ (với Extension Pack for Java)

## 🚀 Các bước cài đặt

### Bước 1: Chuẩn bị môi trường

1. **Cài đặt Java JDK 17**

   - Tải và cài đặt JDK 17
   - Thiết lập biến môi trường JAVA_HOME
   - Kiểm tra: Mở Command Prompt và gõ `java -version`

2. **Cài đặt XAMPP**
   - Tải và cài đặt XAMPP
   - Khởi động XAMPP Control Panel
   - Start **Apache** và **MySQL**

### Bước 2: Import dự án

1. **Mở IDE** (Cursor, Spring Tool Suite, IntelliJ IDEA, hoặc Eclipse)
2. **Import Project:**

   **Với Cursor:**

   - Mở Cursor
   - Chọn **File** → **Open Folder**
   - Browse đến thư mục chứa dự án Sportify
   - Click **Select Folder**

   **Với các IDE khác:**

   - Chọn **File** → **Import** → **Existing Maven Projects**
   - Browse đến thư mục chứa dự án Sportify
   - Chọn thư mục gốc và click **Finish**

3. **Đợi Maven download dependencies** (có thể mất vài phút)

### Bước 3: Cấu hình Database

1. **Mở phpMyAdmin:**

   - Truy cập: http://localhost/phpmyadmin
   - Username: `root`
   - Password: (để trống nếu chưa đặt)

2. **Tạo Database:**

   - Click **New** để tạo database mới
   - Đặt tên: `sportify`
   - Chọn Collation: `utf8mb4_unicode_ci`
   - Click **Create**

3. **Import Database:**
   - Chọn database `sportify` vừa tạo
   - Click tab **Import**
   - Click **Choose File** và chọn file: `Database/sportify.sql`
   - Click **Go** để import

### Bước 4: Cấu hình kết nối Database

1. **Mở file cấu hình:**

   - Đi đến: `src/main/resources/application.properties`

2. **Kiểm tra cấu hình:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sportify?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=
```

3. **Điều chỉnh nếu cần:**
   - Nếu MySQL có mật khẩu, thay đổi `spring.datasource.password=` thành mật khẩu của bạn
   - Nếu không có mật khẩu, giữ nguyên

### Bước 5: Chạy ứng dụng

1. **Trong IDE:**

   **Với Cursor:**

   - Tìm file `ApplicationConfig.java` trong package `duan.sportify`
   - Click chuột phải → **Run Java**
   - Hoặc sử dụng Command Palette (Ctrl+Shift+P) → gõ "Java: Run"
   - Hoặc click vào nút "Run" ở góc trên bên phải file

   **Với các IDE khác:**

   - Tìm file `ApplicationConfig.java` trong package `duan.sportify`
   - Click chuột phải → **Run As** → **Java Application**
   - Hoặc click chuột phải → **Run As** → **Spring Boot App**

2. **Kiểm tra log:**
   - Đợi thông báo "Started ApplicationConfig in X.XXX seconds"
   - Nếu có lỗi, kiểm tra lại cấu hình database

### Bước 6: Truy cập website

Sau khi ứng dụng chạy thành công:

- **Trang chủ người dùng:** http://localhost:8080/sportify
- **Trang quản trị:** http://localhost:8080/admin/index.html

## 👤 Tài khoản đăng nhập

### 🔑 Tài khoản Admin (Quản trị viên)

- **Username:** `adminsportify`
- **Password:** `adminsportify`
- **Quyền:** Quản lý toàn bộ hệ thống, thêm sân, sự kiện, xem báo cáo

### 👨‍💼 Tài khoản Staff (Nhân viên)

- **Username:** `nhanvien`
- **Password:** `nhanvien`
- **Quyền:** Quản lý hóa đơn trong ngày

### 👤 Tài khoản User (Người dùng)

- **Username:** `user01`
- **Password:** `password1`
- **Quyền:** Đặt sân, mua sắm, tạo đội, xem sự kiện

## 🔧 Xử lý sự cố

### Lỗi kết nối Database

- Kiểm tra XAMPP đã start MySQL chưa
- Kiểm tra username/password trong `application.properties`
- Kiểm tra database `sportify` đã được tạo và import chưa

### Lỗi Port 8080 đã được sử dụng

- Thay đổi port trong `application.properties`: `server.port=8081`
- Hoặc tắt ứng dụng đang sử dụng port 8080

### Lỗi Java Version

- Đảm bảo đã cài đặt JDK 17
- Kiểm tra JAVA_HOME trong biến môi trường

### Lỗi với Cursor

- **Extension cần thiết:** Cài đặt "Extension Pack for Java" trong Cursor
- **Maven không nhận diện:** Mở Command Palette (Ctrl+Shift+P) → "Java: Reload Projects"
- **Không chạy được:** Thử chạy qua Terminal: `mvn spring-boot:run`

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng liên hệ:

- **Email:** teamdev.sportify@gmail.com
- **Tài liệu:** `Document/Giải pháp đặt sân thể thao.docx`

---

**Chúc bạn cài đặt thành công! 🎉**
