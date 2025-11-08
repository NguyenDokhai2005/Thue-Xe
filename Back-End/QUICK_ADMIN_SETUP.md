# 🚀 TẠO ADMIN NHANH - HƯỚNG DẪN 5 PHÚT

## ⚡ Cách nhanh nhất

### 1. Khởi động ứng dụng
```bash
.\mvnw.cmd spring-boot:run
```

### 2. Tạo admin với 1 click
```http
POST http://localhost:8080/api/admin-setup/create-default-admin
```

### 3. Đăng nhập admin
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 4. Test quyền admin
```http
GET http://localhost:8080/api/auth/admin
Authorization: Bearer {token_từ_bước_3}
```

## 📋 Thông tin admin mặc định
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`

## 🎯 Kết quả mong đợi
- ✅ Tài khoản admin được tạo thành công
- ✅ Đăng nhập được với admin/admin123
- ✅ Có thể truy cập endpoint `/api/auth/admin`
- ✅ Nhận được JWT token hợp lệ

## 🔧 Nếu cần tùy chỉnh

### Tạo admin với thông tin khác:
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

### Kiểm tra admin đã tạo:
```http
GET http://localhost:8080/api/admin-setup/check-admin
```

## 📁 Files để test
- `setup_admin_complete.http` - Test đầy đủ
- `ADMIN_SETUP_GUIDE.md` - Hướng dẫn chi tiết
- `AdminController.java` - Source code

## ⚠️ Lưu ý
- Endpoints `/api/admin-setup/**` chỉ dành cho development
- Trong production, nên xóa hoặc bảo mật các endpoints này
- Password được mã hóa tự động bằng BCrypt










