# Hướng dẫn tạo tài khoản Admin

## 📋 Tổng quan
File `AdminController.java` cung cấp các API endpoints để tạo và quản lý tài khoản admin một cách dễ dàng.

## 🚀 Các API Endpoints

### 1. Kiểm tra admin có tồn tại
```http
GET http://localhost:8080/api/admin-setup/check-admin
```

**Response:**
```json
{
  "adminExists": true,
  "adminCount": 1,
  "admins": [
    {
      "id": 1,
      "username": "admin",
      "fullName": "System Administrator",
      "phone": "0123456789"
    }
  ]
}
```

### 2. Tạo admin với thông tin tùy chỉnh
```http
POST http://localhost:8080/api/admin-setup/create-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully!",
  "username": "admin",
  "action": "created"
}
```

### 3. Tạo admin với thông tin mặc định (Nhanh nhất)
```http
POST http://localhost:8080/api/admin-setup/create-default-admin
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully!",
  "username": "admin",
  "action": "created"
}
```

### 4. Liệt kê tất cả admin
```http
GET c
```

**Response:**
```json
{
  "success": true,
  "adminCount": 1,
  "admins": [
    {
      "id": 1,
      "username": "admin",
      "fullName": "System Administrator",
      "phone": "0123456789",
      "role": "ADMIN"
    }
  ]
}
```

## 📝 Cách sử dụng

### Bước 1: Khởi động ứng dụng
```bash
.\mvnw.cmd spring-boot:run
```

### Bước 2: Tạo admin (chọn 1 cách)

#### Cách A: Tạo admin nhanh với thông tin mặc định
```http
POST http://localhost:8080/api/admin-setup/create-default-admin
```

#### Cách B: Tạo admin với thông tin tùy chỉnh
```http
POST http://localhost:8080/api/admin-setup/create-admin
Content-Type: application/json

{
  "username": "myadmin",
  "password": "mypassword123",
  "fullName": "My Administrator",
  "phone": "0987654321"
}
```

### Bước 3: Kiểm tra admin đã được tạo
```http
GET http://localhost:8080/api/admin-setup/check-admin
```

### Bước 4: Đăng nhập admin
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Bước 5: Test quyền admin
```http
GET http://localhost:8080/api/auth/admin
Authorization: Bearer {token_from_login_response}
```

## 🎯 Thông tin admin mặc định
- **Username**: `admin`
- **Password**: `admin123`
- **Full Name**: `System Administrator`
- **Phone**: `0123456789`
- **Role**: `ADMIN`

## 🔧 Tính năng đặc biệt

### 1. Tự động cập nhật user hiện có
Nếu username đã tồn tại, API sẽ tự động cập nhật user đó thành admin thay vì tạo mới.

### 2. Mã hóa password tự động
Password được mã hóa bằng BCrypt trước khi lưu vào database.

### 3. Kiểm tra trùng lặp
API kiểm tra username đã tồn tại trước khi tạo admin mới.

## 📁 Files liên quan

### Files đã tạo:
- `AdminController.java` - Controller chính
- `ADMIN_SETUP_GUIDE.md` - Hướng dẫn này
- `setup_admin.http` - Test requests

### Files cần cập nhật:
- `SecurityConfig.java` - Đã cập nhật để permit admin-setup endpoints

## ⚠️ Lưu ý bảo mật

### Development (Hiện tại)
- Endpoints `/api/admin-setup/**` được permitAll() để dễ test
- Có thể tạo admin mà không cần authentication

### Production (Cần thay đổi)
```java
// Trong SecurityConfig.java, thay đổi:
.requestMatchers("/api/admin-setup/**").permitAll()

// Thành:
.requestMatchers("/api/admin-setup/**").hasRole("SUPER_ADMIN")
// Hoặc xóa hoàn toàn các endpoints này
```

## 🧪 Test với Postman/Insomnia

### Import collection:
1. Tạo new request
2. Copy URL và method từ hướng dẫn trên
3. Thêm headers: `Content-Type: application/json`
4. Thêm body JSON (nếu cần)
5. Send request

### Test sequence:
1. `GET /api/admin-setup/check-admin` - Kiểm tra trạng thái hiện tại
2. `POST /api/admin-setup/create-default-admin` - Tạo admin
3. `GET /api/admin-setup/check-admin` - Xác nhận admin đã tạo
4. `POST /api/auth/login` - Đăng nhập admin
5. `GET /api/auth/admin` - Test quyền admin

## 🎉 Kết quả mong đợi

Sau khi hoàn thành, bạn sẽ có:
- ✅ Tài khoản admin hoạt động
- ✅ Có thể đăng nhập với username/password
- ✅ Có thể truy cập các endpoint yêu cầu quyền admin
- ✅ JWT token hợp lệ cho các request tiếp theo










