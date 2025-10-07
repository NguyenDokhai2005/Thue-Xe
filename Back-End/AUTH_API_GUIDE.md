# Car Rental Auth API Guide

## Tổng quan
API Auth của hệ thống Car Rental cung cấp các chức năng xác thực và quản lý người dùng, bao gồm đăng ký, đăng nhập, quản lý profile và phân quyền.

## Base URL
```
http://localhost:8080/api/auth
```

## Endpoints

### 1. Đăng ký người dùng mới
**POST** `/register`

**Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "nguyenvana",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "CUSTOMER"
}
```

**Response (400 Bad Request) - Username/Email đã tồn tại:**
```json
{
  "error": "Username đã tồn tại!"
}
```

### 2. Đăng nhập
**POST** `/login`

**Request Body:**
```json
{
  "username": "nguyenvana",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "nguyenvana",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "CUSTOMER"
}
```

**Response (401 Unauthorized) - Sai thông tin đăng nhập:**
```json
{
  "error": "User không tồn tại!"
}
```

### 3. Lấy thông tin người dùng hiện tại
**GET** `/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "nguyenvana",
  "email": "user@example.com",
  "password": null,
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "CUSTOMER"
}
```

### 4. Cập nhật thông tin profile
**PUT** `/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "nguyenvana",
  "email": "user@example.com",
  "password": null,
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "role": "CUSTOMER"
}
```

### 5. Thay đổi mật khẩu
**PUT** `/change-password`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Đổi password thành công!"
}
```

**Response (400 Bad Request) - Sai mật khẩu cũ:**
```json
{
  "error": "Password cũ không đúng!"
}
```

### 6. Kiểm tra username đã tồn tại
**GET** `/check-username?username={username}`

**Response (200 OK):**
```json
{
  "exists": true
}
```

### 7. Kiểm tra email đã tồn tại
**GET** `/check-email?email={email}`

**Response (200 OK):**
```json
{
  "exists": true
}
```

### 8. Endpoint dành cho Admin
**GET** `/admin`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Chỉ admin mới thấy được message này!"
}
```

**Response (403 Forbidden) - Không có quyền admin:**
```json
{
  "error": "Access Denied"
}
```

## Các Role trong hệ thống

1. **ADMIN**: Quản trị viên hệ thống
2. **CUSTOMER**: Khách hàng (mặc định khi đăng ký)
3. **EMPLOYEE**: Nhân viên

## Xác thực JWT

### Cách sử dụng token:
1. Sau khi đăng nhập thành công, lưu token từ response
2. Gửi token trong header `Authorization` với format: `Bearer {token}`
3. Token có thời hạn 1 giờ (3600000 milliseconds)

### Ví dụ sử dụng với curl:
```bash
# Đăng nhập
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nguyenvana","password":"password123"}'

# Sử dụng token để gọi API
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Xử lý lỗi

### Các mã lỗi thường gặp:
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
- **403 Forbidden**: Không có quyền truy cập
- **500 Internal Server Error**: Lỗi server

### Ví dụ response lỗi:
```json
{
  "error": "Username đã tồn tại!"
}
```

## Validation Rules

### RegisterRequest:
- `username`: Bắt buộc, độ dài từ 3-255 ký tự, phải unique
- `email`: Bắt buộc, phải là email hợp lệ, độ dài tối đa 255 ký tự, phải unique
- `password`: Bắt buộc, tối thiểu 6 ký tự
- `fullName`: Bắt buộc, độ dài tối đa 255 ký tự
- `phone`: Tùy chọn, độ dài tối đa 255 ký tự

### LoginRequest:
- `username`: Bắt buộc
- `password`: Bắt buộc

## Database Schema

Bảng `users` có cấu trúc:
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    `full-name` VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    role ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER'
);
```

## Bảo mật

1. **Password Encoding**: Sử dụng BCrypt để mã hóa mật khẩu
2. **JWT Security**: Token được ký bằng HMAC SHA-256
3. **CORS**: Được cấu hình để hỗ trợ cross-origin requests
4. **Session Management**: Stateless với JWT, không lưu session

## Test với Postman/Insomnia

File `test_auth_api.http` đã được tạo sẵn với các test cases:
- Đăng ký user mới
- Đăng nhập
- Lấy thông tin user
- Cập nhật profile
- Thay đổi password
- Kiểm tra email
- Test các trường hợp lỗi

Sử dụng file này để test các API endpoints một cách nhanh chóng.