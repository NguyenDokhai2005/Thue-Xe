# Hướng dẫn tạo cơ sở dữ liệu Car Rental

## 📋 **Các file đã tạo:**

1. **`create_database.sql`** - Script SQL tạo database hoàn chỉnh
2. **`setup_database.bat`** - Script tự động chạy SQL
3. **`DATABASE_SETUP_INSTRUCTIONS.md`** - File hướng dẫn này

## 🚀 **Cách 1: Chạy tự động (Khuyến nghị)**

```bash
# Double-click file setup_database.bat
# Hoặc chạy trong Command Prompt:
setup_database.bat
```

## 🛠️ **Cách 2: Chạy thủ công**

### Bước 1: Mở MySQL
```bash
mysql -u root -p
# Nhập password: root
```

### Bước 2: Chạy script SQL
```sql
source create_database.sql
```

### Bước 3: Kiểm tra kết quả
```sql
USE `car-rental`;
SHOW TABLES;
SELECT * FROM users;
```

## 📊 **Cấu trúc database được tạo:**

### **5 bảng chính:**
1. **`users`** - Quản lý người dùng (4 users mẫu)
2. **`vehicles`** - Quản lý xe (5 vehicles mẫu)
3. **`bookings`** - Quản lý đặt xe (3 bookings mẫu)
4. **`payments`** - Quản lý thanh toán (3 payments mẫu)
5. **`vehicle_photos`** - Quản lý hình ảnh xe (9 photos mẫu)

### **Indexes được tạo:**
- Tối ưu hiệu suất cho các truy vấn thường dùng
- Indexes cho email, role, status, dates, etc.

## 👥 **Users mẫu được tạo:**

| Email | Password | Role | Mô tả |
|-------|----------|------|-------|
| admin@carrental.com | password123 | ADMIN | Quản trị viên |
| customer1@example.com | password123 | CUSTOMER | Khách hàng 1 |
| customer2@example.com | password123 | CUSTOMER | Khách hàng 2 |
| employee1@example.com | password123 | EMPLOYEE | Nhân viên |

## 🚗 **Vehicles mẫu được tạo:**

| ID | Tên xe | Loại | Giá/ngày | Trạng thái |
|----|--------|------|----------|------------|
| 1 | Toyota Camry 2023 | SEDAN | 500,000 VND | AVAILABLE |
| 2 | Honda CR-V 2023 | SUV | 700,000 VND | AVAILABLE |
| 3 | BMW X5 2023 | SUV | 1,200,000 VND | AVAILABLE |
| 4 | Mercedes C-Class 2023 | SEDAN | 800,000 VND | RENTED |
| 5 | Ford Ranger 2023 | PICKUP | 600,000 VND | AVAILABLE |

## 🔧 **Sau khi tạo database:**

### Bước 1: Cập nhật application.properties
```properties
# Đảm bảo cấu hình này:
spring.datasource.url=jdbc:mysql://localhost:3306/car-rental
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=validate
```

### Bước 2: Chạy Spring Boot
```bash
mvnw.cmd spring-boot:run
```

### Bước 3: Test API
```bash
# Test đăng nhập admin
POST http://localhost:8080/api/auth/login
{
  "email": "admin@carrental.com",
  "password": "password123"
}
```

## ⚠️ **Lưu ý quan trọng:**

1. **Backup dữ liệu cũ** (nếu có) trước khi chạy script
2. **Đảm bảo MySQL đang chạy** trước khi tạo database
3. **Kiểm tra username/password** MySQL trong script
4. **Script sẽ xóa database cũ** nếu tồn tại

## 🐛 **Troubleshooting:**

### Lỗi "Access denied"
```bash
# Kiểm tra quyền MySQL
mysql -u root -p -e "SHOW GRANTS;"
```

### Lỗi "Database exists"
```sql
-- Xóa database cũ
DROP DATABASE IF EXISTS `car-rental`;
```

### Lỗi "Table doesn't exist"
```bash
# Chạy lại script
mysql -u root -p < create_database.sql
```

## 📞 **Hỗ trợ:**

Nếu gặp vấn đề, hãy:
1. Kiểm tra MySQL đang chạy
2. Kiểm tra username/password
3. Chạy script từng bước
4. Xem log lỗi chi tiết

**Chúc bạn thành công!** 🎉













