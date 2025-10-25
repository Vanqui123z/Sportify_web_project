# 🔧 FIX: Environment Variable Not Found

## ❌ Vấn đề

Application báo lỗi:
```
java.io.IOException: Your default credentials were not found
```

**Nguyên nhân**: Environment variable `GOOGLE_APPLICATION_CREDENTIALS` chưa được set trong terminal mà application chạy.

---

## ✅ GIẢI PHÁP - 3 CÁCH

### 🎯 CÁCH 1: Set trong VS Code Launch Configuration (KHUYẾN NGHỊ)

1. **Mở file `.vscode/launch.json`** (hoặc tạo mới nếu chưa có)
2. **Thêm environment variable vào config:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Spring Boot-SportifyApplication",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "mainClass": "duan.sportify.SportifyApplication",
      "projectName": "Sportify",
      "args": "",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "D:\\Doan\\Khoa_Luan_Tot_Nghiep\\SportifyBackend\\credentials\\vertex-ai-key.json"
      }
    }
  ]
}
```

3. **Restart VS Code**
4. **Press F5** để run

**Ưu điểm**: 
- ✅ Tự động set mỗi lần run
- ✅ Không cần chạy script
- ✅ Team khác cũng dùng được (chỉ cần update path)

---

### 🎯 CÁCH 2: Set System Environment Variable (VĨNh VIỄN)

#### Windows:
1. **Windows Search** → "Environment Variables"
2. **System Properties** → **Environment Variables**
3. **User variables** → **New**
4. Nhập:
   - **Variable name**: `GOOGLE_APPLICATION_CREDENTIALS`
   - **Variable value**: `D:\Doan\Khoa_Luan_Tot_Nghiep\SportifyBackend\credentials\vertex-ai-key.json`
5. **OK** → **OK**
6. **RESTART VS Code** (quan trọng!)
7. **Press F5**

**Ưu điểm**:
- ✅ Set 1 lần, dùng mãi mãi
- ✅ Áp dụng cho tất cả terminal/application

**Nhược điểm**:
- ❌ Phải restart VS Code
- ❌ Mỗi máy phải set riêng

---

### 🎯 CÁCH 3: Set trong PowerShell trước khi run (TẠM THỜI)

```powershell
# Set environment variable
$env:GOOGLE_APPLICATION_CREDENTIALS="D:\Doan\Khoa_Luan_Tot_Nghiep\SportifyBackend\credentials\vertex-ai-key.json"

# Verify
Write-Host "Environment variable: $env:GOOGLE_APPLICATION_CREDENTIALS"

# Run application using Maven (trong cùng terminal)
cd D:\Doan\Khoa_Luan_Tot_Nghiep\SportifyBackend
mvn spring-boot:run
```

**Ưu điểm**:
- ✅ Nhanh, không cần config

**Nhược điểm**:
- ❌ Phải set lại mỗi lần mở terminal mới
- ❌ Không work nếu run bằng F5 trong VS Code

---

## 🚀 KHUYẾN NGHỊ: Dùng CÁCH 1

Tôi sẽ tạo file `.vscode/launch.json` cho bạn:

