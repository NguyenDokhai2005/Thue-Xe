# Hướng dẫn khắc phục lỗi - Car Rental Backend

## 🚨 Vấn đề hiện tại: "Chưa chạy được"

### 1. **Kiểm tra Maven**
```bash
# Kiểm tra Maven đã cài đặt chưa
mvn --version

# Nếu chưa có Maven, sử dụng Maven wrapper
./mvnw spring-boot:run
# hoặc trên Windows
mvnw.cmd spring-boot:run
```

### 2. **Kiểm tra Database MySQL**
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Tạo database
CREATE DATABASE IF NOT EXISTS `car-rental`;
```

### 3. **Các bước khắc phục**

#### Bước 1: Kiểm tra MySQL
1. Mở Command Prompt
2. Chạy: `mysql -u root -p`
3. Nhập password: `root`
4. Chạy file SQL: `source check_database.sql`

#### Bước 2: Chạy ứng dụng
**Cách 1: Sử dụng Maven wrapper (Khuyến nghị)**
```bash
# Trong thư mục project
mvnw.cmd spring-boot:run
```

**Cách 2: Sử dụng script**
```bash
# Double-click file run.bat
```

**Cách 3: Sử dụng Maven (nếu đã cài)**
```bash
mvn spring-boot:run
```

### 4. **Kiểm tra lỗi thường gặp**

#### Lỗi Database Connection
```
Error: Could not create connection to database server
```
**Giải pháp:**
- Kiểm tra MySQL đang chạy
- Kiểm tra username/password trong `application.properties`
- Kiểm tra port 3306

#### Lỗi Maven
```
'mvn' is not recognized as an internal or external command
```
**Giải pháp:**
- Cài đặt Maven hoặc sử dụng Maven wrapper
- Chạy: `mvnw.cmd spring-boot:run`

#### Lỗi Port đã được sử dụng
```
Port 8080 was already in use
```
**Giải pháp:**
- Thay đổi port trong `application.properties`
- Hoặc tắt ứng dụng đang chạy trên port 8080

### 5. **Test API sau khi chạy thành công**

1. **Mở browser**: `http://localhost:8080`
2. **Test đăng ký**:
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0123456789"
}
```

3. **Test đăng nhập**:
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 6. **Logs để debug**

Kiểm tra console output để xem lỗi cụ thể:
- Database connection errors
- Port conflicts
- Missing dependencies
- Configuration errors

### 7. **Cấu hình đã được cập nhật**

✅ **Database**: `car-rental` với connection parameters
✅ **Username**: `root`
✅ **Password**: `root`
✅ **Port**: `8080`

### 8. **Files hỗ trợ**

- `run.bat`: Script chạy ứng dụng
- `check_database.sql`: Script kiểm tra database
- `test_auth_api.http`: Test API endpoints

## 🎯 **Thứ tự thực hiện:**

1. **Kiểm tra MySQL** → Chạy `check_database.sql`
2. **Chạy ứng dụng** → `mvnw.cmd spring-boot:run`
3. **Test API** → Sử dụng `test_auth_api.http`
4. **Kiểm tra logs** → Xem console output

## 📞 **Nếu vẫn không chạy được:**

Gửi cho tôi:
1. **Console output** khi chạy ứng dụng
2. **Error message** cụ thể
3. **MySQL version** và **Java version**
4. **Operating system** (Windows/Linux/Mac)


