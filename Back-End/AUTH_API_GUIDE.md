# Car Rental Auth API Guide

## Tổng quan
API Authentication cho hệ thống Car Rental sử dụng JWT (JSON Web Token) để xác thực và phân quyền người dùng.

## Cấu trúc Database
- **Bảng users**: Lưu trữ thông tin người dùng với email làm username
- **Roles**: ADMIN, CUSTOMER, EMPLOYEE
- **Password**: Được mã hóa bằng BCrypt

## API Endpoints

### 1. Đăng ký (Register)
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "User Name",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "fullName": "User Name",
  "phone": "0123456789",
  "role": "CUSTOMER"
}
```

### 2. Đăng nhập (Login)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** (Giống như Register)

### 3. Lấy thông tin user hiện tại
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "User Name",
  "phone": "0123456789",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00"
}
```

### 4. Cập nhật profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": 1,
  "fullName": "Updated Name",
  "phone": "0987654321"
}
```

### 5. Đổi password
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 6. Kiểm tra email tồn tại
**GET** `/api/auth/check-email?email=user@example.com`

**Response:**
```json
{
  "exists": true
}
```

### 7. Admin endpoint (chỉ admin)
**GET** `/api/auth/admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

## Cách sử dụng

### 1. Cài đặt và chạy
```bash
# Cập nhật password MySQL trong application.properties
# Chạy ứng dụng
mvn spring-boot:run
```

### 2. Test API
Sử dụng file `test_auth_api.http` với IntelliJ IDEA hoặc VS Code REST Client extension.

### 3. Flow xác thực
1. **Register/Login** → Nhận JWT token
2. **Lưu token** → Sử dụng trong header `Authorization: Bearer <token>`
3. **Gọi API** → Token được validate tự động
4. **Token hết hạn** → Cần login lại

## Security Features

### 1. JWT Token
- **Secret**: Cấu hình trong `application.properties`
- **Expiration**: 24 giờ (86400000 ms)
- **Algorithm**: HS256

### 2. Password Security
- **Encoding**: BCrypt
- **Validation**: Tối thiểu 6 ký tự

### 3. CORS
- **Origins**: Tất cả (*)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Tất cả

### 4. Role-based Access
- **@PreAuthorize**: Kiểm tra role trước khi truy cập
- **ADMIN**: Có quyền truy cập tất cả
- **CUSTOMER**: Quyền cơ bản
- **EMPLOYEE**: Quyền nhân viên

## Error Handling

### 1. Validation Errors
```json
{
  "error": "Email không được để trống!"
}
```

### 2. Authentication Errors
```json
{
  "error": "User không tồn tại!"
}
```

### 3. Authorization Errors
```json
{
  "error": "Access Denied"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    role ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Lưu ý

1. **Email làm username**: Không có trường username riêng
2. **Token trong header**: Luôn sử dụng `Authorization: Bearer <token>`
3. **Role mặc định**: CUSTOMER khi đăng ký
4. **Password**: Tự động mã hóa khi lưu
5. **Validation**: Tất cả input đều được validate

## Troubleshooting

### 1. Token không hợp lệ
- Kiểm tra secret key trong `application.properties`
- Đảm bảo token chưa hết hạn
- Kiểm tra format: `Bearer <token>`

### 2. Database connection
- Cập nhật password MySQL
- Kiểm tra database `car_rental_db` đã tạo
- Kiểm tra port 3306

### 3. CORS issues
- Kiểm tra frontend URL
- Cấu hình CORS trong `SecurityConfig`

## Development

### 1. Thêm endpoint mới
1. Tạo method trong `AuthController`
2. Thêm logic trong `UserService`
3. Cập nhật `SecurityConfig` nếu cần
4. Test với `test_auth_api.http`

### 2. Thêm role mới
1. Cập nhật enum `User.Role`
2. Thêm logic phân quyền
3. Cập nhật database schema
4. Test với các role khác nhau
