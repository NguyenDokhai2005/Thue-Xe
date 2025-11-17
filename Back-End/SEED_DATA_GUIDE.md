# Hướng dẫn sử dụng Seed Data

## File seed data

Có 2 file seed data:

1. **seed_data.sql** - File seed data cơ bản (ít dữ liệu)
2. **seed_data_comprehensive.sql** - File seed data đầy đủ (nhiều dữ liệu mẫu)

## Cách sử dụng

### Bước 1: Tạo database
```bash
# Chạy file tạo database trước
mysql -u root -p < create_database_new.sql
```

### Bước 2: Chèn dữ liệu mẫu
```bash
# Sử dụng file seed data đầy đủ (khuyến nghị)
mysql -u root -p car-rental < seed_data_comprehensive.sql

# Hoặc sử dụng file seed data cơ bản
mysql -u root -p car-rental < seed_data.sql
```

### Hoặc sử dụng MySQL Workbench / phpMyAdmin

1. Mở file `seed_data_comprehensive.sql`
2. Chọn database `car-rental`
3. Chạy toàn bộ script

## Thông tin đăng nhập mặc định

### Tất cả users có password: `123456`

### Admin
- Username: `admin` / Password: `123456`
- Username: `admin2` / Password: `123456`

### Nhân viên (Employee)
- Username: `nhanvien1` / Password: `123456`
- Username: `nhanvien2` / Password: `123456`
- Username: `nhanvien3` / Password: `123456`

### Khách hàng (Customer)
- Username: `khachhang1` đến `khachhang8` / Password: `123456`

## Dữ liệu mẫu trong seed_data_comprehensive.sql

### Users
- 2 Admin
- 3 Employee
- 8 Customer
- **Tổng: 13 users**

### Vehicles
- 25 xe các loại:
  - SEDAN: 6 xe
  - SUV: 5 xe
  - HATCHBACK: 3 xe
  - COUPE: 2 xe
  - CONVERTIBLE: 1 xe
  - WAGON: 1 xe
  - PICKUP: 3 xe
  - VAN: 2 xe
  - MOTORCYCLE: 5 xe

### Bookings
- 14 đặt xe với các trạng thái:
  - COMPLETED: 4
  - ACTIVE: 2
  - CONFIRMED: 3
  - PENDING: 3
  - CANCELLED: 2

### Payments
- 11 thanh toán tương ứng với các booking

### Vehicle Photos
- 22 hình ảnh cho các xe

## Lưu ý

1. **Password hash**: Tất cả password đã được hash bằng BCrypt với giá trị `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` (tương ứng với password `123456`)

2. **Dates**: Các booking sử dụng `NOW()` và các hàm date để tạo dữ liệu động, phù hợp với thời điểm chạy script

3. **Foreign Keys**: Script tự động xử lý foreign key constraints

4. **Reset data**: Script sẽ xóa toàn bộ dữ liệu cũ trước khi chèn dữ liệu mới

## Kiểm tra dữ liệu

Sau khi chạy script, bạn có thể kiểm tra:

```sql
-- Đếm số lượng records
SELECT 'USERS' as table_name, COUNT(*) as total FROM users
UNION ALL
SELECT 'VEHICLES', COUNT(*) FROM vehicles
UNION ALL
SELECT 'BOOKINGS', COUNT(*) FROM bookings;

-- Xem danh sách users
SELECT id, username, `full-name`, role FROM users;

-- Xem danh sách vehicles
SELECT id, title, vehicle_type, status, daily_price FROM vehicles;

-- Xem danh sách bookings
SELECT id, vehicle_id, renter_id, status, start_at, end_at, total_amount FROM bookings;
```

## Troubleshooting

### Lỗi Foreign Key
Nếu gặp lỗi foreign key, đảm bảo đã chạy `create_database_new.sql` trước.

### Lỗi Duplicate Entry
Nếu dữ liệu đã tồn tại, script sẽ tự động xóa dữ liệu cũ trước khi chèn mới.

### Password không đúng
Đảm bảo sử dụng password `123456` cho tất cả users.

