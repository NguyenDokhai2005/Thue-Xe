-- =====================================================
-- Comprehensive Seed Data for Car Rental Database
-- =====================================================
-- Password mặc định cho tất cả users: 123456
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================

USE `car-rental`;

-- Xóa dữ liệu cũ (nếu có)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE vehicle_photos;
TRUNCATE TABLE bookings;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- USERS - Người dùng
-- =====================================================
-- Password: 123456 (BCrypt hash)
INSERT INTO users (username, password, `full-name`, phone, role) VALUES
  -- Admin
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyễn Văn Admin', '0901234567', 'ADMIN'),
  ('admin2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Trần Thị Quản Lý', '0901234568', 'ADMIN'),
  
  -- Employees
  ('nhanvien1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lê Văn Nhân Viên', '0901234569', 'EMPLOYEE'),
  ('nhanvien2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Phạm Thị Nhân Viên', '0901234570', 'EMPLOYEE'),
  ('nhanvien3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hoàng Văn Nhân Viên', '0901234571', 'EMPLOYEE'),
  
  -- Customers (khachhang1 = id 6, khachhang2 = id 7, etc.)
  ('khachhang1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyễn Thị Khách Hàng', '0901234572', 'CUSTOMER'),
  ('khachhang2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Trần Văn Khách Hàng', '0901234573', 'CUSTOMER'),
  ('khachhang3', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lê Thị Khách Hàng', '0901234574', 'CUSTOMER'),
  ('khachhang4', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Phạm Văn Khách Hàng', '0901234575', 'CUSTOMER'),
  ('khachhang5', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hoàng Thị Khách Hàng', '0901234576', 'CUSTOMER'),
  ('khachhang6', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vũ Văn Khách Hàng', '0901234577', 'CUSTOMER'),
  ('khachhang7', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Đỗ Thị Khách Hàng', '0901234578', 'CUSTOMER'),
  ('khachhang8', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bùi Văn Khách Hàng', '0901234579', 'CUSTOMER');

-- =====================================================
-- VEHICLES - Xe
-- =====================================================
INSERT INTO vehicles (title, vehicle_type, license_plate, daily_price, currency, status, description) VALUES
  -- SEDAN
  ('Toyota Vios 2020', 'SEDAN', '30A-12345', 400000, 'VND', 'AVAILABLE', 'Xe gia đình tiết kiệm nhiên liệu, phù hợp đi lại trong thành phố. Đầy đủ tiện nghi, an toàn.'),
  ('Honda City 2021', 'SEDAN', '30B-23456', 450000, 'VND', 'AVAILABLE', 'Sedan hiện đại, tiết kiệm xăng, nội thất sang trọng.'),
  ('Hyundai Accent 2019', 'SEDAN', '29A-34567', 380000, 'VND', 'AVAILABLE', 'Dễ lái, phù hợp đô thị, giá cả hợp lý.'),
  ('Mazda 3 2022', 'SEDAN', '30C-45678', 550000, 'VND', 'AVAILABLE', 'Thiết kế đẹp, động cơ mạnh mẽ, công nghệ hiện đại.'),
  ('Mercedes C200 2020', 'SEDAN', '51H-56789', 1500000, 'VND', 'AVAILABLE', 'Xe sang trọng, đầy đủ tính năng cao cấp.'),
  ('BMW 320i 2021', 'SEDAN', '51B-67890', 1800000, 'VND', 'RENTED', 'Xe hạng sang, hiệu suất cao, nội thất cao cấp.'),
  
  -- SUV
  ('Honda CR-V 2021', 'SUV', '30G-78901', 800000, 'VND', 'AVAILABLE', 'SUV 7 chỗ rộng rãi, phù hợp gia đình đông người.'),
  ('Mazda CX-5 2022', 'SUV', '30F-89012', 900000, 'VND', 'AVAILABLE', 'SUV 5 chỗ cao cấp, thiết kế thể thao.'),
  ('Toyota Fortuner 2020', 'SUV', '30A-90123', 1200000, 'VND', 'AVAILABLE', 'SUV 7 chỗ mạnh mẽ, phù hợp off-road.'),
  ('Hyundai Tucson 2021', 'SUV', '30B-01234', 750000, 'VND', 'RENTED', 'SUV hiện đại, tiết kiệm nhiên liệu.'),
  ('Ford Everest 2022', 'SUV', '30C-12345', 1100000, 'VND', 'AVAILABLE', 'SUV 7 chỗ lớn, mạnh mẽ, an toàn.'),
  
  -- HATCHBACK
  ('Kia Morning 2018', 'HATCHBACK', '29A-23456', 300000, 'VND', 'AVAILABLE', 'Nhỏ gọn, tiết kiệm, phù hợp đô thị.'),
  ('Honda Fit 2019', 'HATCHBACK', '30B-34567', 350000, 'VND', 'AVAILABLE', 'Gọn nhẹ, linh hoạt, tiết kiệm xăng.'),
  ('Toyota Yaris 2020', 'HATCHBACK', '30A-45678', 380000, 'VND', 'MAINTENANCE', 'Xe nhỏ gọn, dễ đỗ, tiết kiệm.'),
  
  -- COUPE
  ('Ford Mustang 2021', 'COUPE', '30C-56789', 2000000, 'VND', 'AVAILABLE', 'Xe thể thao, động cơ mạnh mẽ, thiết kế ấn tượng.'),
  ('BMW 420i 2020', 'COUPE', '51B-67890', 2200000, 'VND', 'AVAILABLE', 'Coupe sang trọng, hiệu suất cao.'),
  
  -- CONVERTIBLE
  ('Mercedes SLK 2019', 'CONVERTIBLE', '51H-78901', 2500000, 'VND', 'AVAILABLE', 'Xe mui trần, sang trọng, phong cách.'),
  
  -- WAGON
  ('Volvo V60 2021', 'WAGON', '30D-89012', 1300000, 'VND', 'AVAILABLE', 'Wagon cao cấp, an toàn, rộng rãi.'),
  
  -- PICKUP
  ('Ford Ranger 2022', 'PICKUP', '88C-90123', 950000, 'VND', 'AVAILABLE', 'Bán tải mạnh mẽ, off-road tốt, chở hàng tốt.'),
  ('Toyota Hilux 2021', 'PICKUP', '30A-01234', 900000, 'VND', 'AVAILABLE', 'Bán tải bền bỉ, phù hợp mọi địa hình.'),
  ('Isuzu D-Max 2020', 'PICKUP', '30B-12345', 850000, 'VND', 'RENTED', 'Bán tải mạnh mẽ, tiết kiệm nhiên liệu.'),
  
  -- VAN
  ('Mercedes Sprinter 2020', 'VAN', '51H-23456', 1500000, 'VND', 'AVAILABLE', 'Xe van lớn, chở nhiều người, phù hợp tour.'),
  ('Ford Transit 2019', 'VAN', '30C-34567', 1200000, 'VND', 'AVAILABLE', 'Van chở hàng, chở người, đa dụng.'),
  
  -- MOTORCYCLE
  ('Yamaha Exciter 155', 'MOTORCYCLE', 'MOTO-001', 150000, 'VND', 'AVAILABLE', 'Xe máy thể thao, mạnh mẽ, tiết kiệm xăng.'),
  ('Honda Winner 150', 'MOTORCYCLE', 'MOTO-002', 140000, 'VND', 'AVAILABLE', 'Xe máy thể thao, thiết kế đẹp.'),
  ('Yamaha Sirius 110', 'MOTORCYCLE', 'MOTO-003', 100000, 'VND', 'AVAILABLE', 'Xe máy tiết kiệm, phù hợp đi lại hàng ngày.'),
  ('Honda Vision 110', 'MOTORCYCLE', 'MOTO-004', 120000, 'VND', 'OUT_OF_SERVICE', 'Xe tay ga, tiện lợi, tiết kiệm.'),
  ('Piaggio Vespa 125', 'MOTORCYCLE', 'MOTO-005', 180000, 'VND', 'AVAILABLE', 'Xe tay ga phong cách, sang trọng.');

-- =====================================================
-- VEHICLE PHOTOS - Hình ảnh xe
-- =====================================================
INSERT INTO vehicle_photos (vehicle_id, url, is_primary) VALUES
  (1, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (1, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 0),
  (2, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (3, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (4, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (5, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (7, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (8, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (9, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (11, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (12, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (14, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (15, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (16, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (18, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (19, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (21, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (22, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (23, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (24, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1),
  (25, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 1);

-- =====================================================
-- BOOKINGS - Đặt xe
-- =====================================================
-- Lưu ý: vehicle_id và renter_id phải khớp với ID thực tế sau khi insert
-- Giả sử: admin=1, nhanvien1=3, khachhang1=6, khachhang2=7, etc.
-- vehicles: Vios=1, City=2, Accent=3, etc.

INSERT INTO bookings (vehicle_id, renter_id, status, start_at, end_at, daily_price_snapshot, total_amount, currency, notes) VALUES
  -- Bookings đã hoàn thành (COMPLETED)
  (1, 6, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 28 DAY), 400000, 800000, 'VND', 'Chuyến đi gia đình cuối tuần'),
  (2, 7, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY), 450000, 900000, 'VND', 'Đi công tác'),
  (3, 8, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY), 380000, 760000, 'VND', 'Du lịch'),
  (7, 9, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 800000, 2400000, 'VND', 'Gia đình đi chơi xa'),
  
  -- Bookings đang thuê (ACTIVE)
  (4, 6, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), 550000, 2750000, 'VND', 'Đang thuê'),
  (8, 7, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 900000, 5400000, 'VND', 'Thuê dài hạn'),
  
  -- Bookings đã xác nhận (CONFIRMED)
  (5, 8, 'CONFIRMED', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), 1500000, 3000000, 'VND', 'Sự kiện quan trọng'),
  (9, 9, 'CONFIRMED', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 1200000, 2400000, 'VND', 'Du lịch cuối tuần'),
  (11, 10, 'CONFIRMED', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 300000, 600000, 'VND', 'Đi lại trong thành phố'),
  
  -- Bookings chờ xác nhận (PENDING)
  (12, 11, 'PENDING', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 9 DAY), 350000, 700000, 'VND', 'Chờ xác nhận'),
  (14, 12, 'PENDING', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 12 DAY), 2000000, 4000000, 'VND', 'Sự kiện đặc biệt'),
  (18, 13, 'PENDING', DATE_ADD(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY), 950000, 1900000, 'VND', 'Cần xe bán tải'),
  
  -- Bookings đã hủy (CANCELLED)
  (15, 6, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 2200000, 4400000, 'VND', 'Đã hủy do thay đổi kế hoạch'),
  (19, 7, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 900000, 1800000, 'VND', 'Không còn nhu cầu');

-- =====================================================
-- PAYMENTS - Thanh toán
-- =====================================================
INSERT INTO payments (booking_id, amount, currency, method, status, provider, provider_txn_id, paid_at) VALUES
  -- Thanh toán cho các booking đã hoàn thành
  (1, 800000, 'VND', 'CASH', 'COMPLETED', 'cashier', 'CASH-2024-001', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (2, 900000, 'VND', 'CREDIT_CARD', 'COMPLETED', 'visa', 'VISA-2024-002', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (3, 760000, 'VND', 'BANK_TRANSFER', 'COMPLETED', 'vietcombank', 'VCB-2024-003', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (4, 2400000, 'VND', 'DIGITAL_WALLET', 'COMPLETED', 'momo', 'MOMO-2024-004', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  
  -- Thanh toán cho các booking đang active
  (5, 2750000, 'VND', 'CREDIT_CARD', 'COMPLETED', 'mastercard', 'MC-2024-005', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (6, 5400000, 'VND', 'BANK_TRANSFER', 'COMPLETED', 'techcombank', 'TCB-2024-006', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  
  -- Thanh toán cho các booking đã xác nhận
  (7, 3000000, 'VND', 'CREDIT_CARD', 'COMPLETED', 'visa', 'VISA-2024-007', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (8, 2400000, 'VND', 'DIGITAL_WALLET', 'COMPLETED', 'zalo_pay', 'ZALO-2024-008', NOW()),
  (9, 600000, 'VND', 'CASH', 'PENDING', 'cashier', NULL, NULL),
  
  -- Thanh toán chờ xử lý cho booking pending
  (10, 700000, 'VND', 'BANK_TRANSFER', 'PENDING', 'vietcombank', NULL, NULL),
  (11, 4000000, 'VND', 'CREDIT_CARD', 'PENDING', 'visa', NULL, NULL);

-- =====================================================
-- THỐNG KÊ DỮ LIỆU
-- =====================================================
SELECT '=== THỐNG KÊ DỮ LIỆU ===' as info;

SELECT 'USERS' as table_name, COUNT(*) as total FROM users
UNION ALL
SELECT 'VEHICLES', COUNT(*) FROM vehicles
UNION ALL
SELECT 'BOOKINGS', COUNT(*) FROM bookings
UNION ALL
SELECT 'PAYMENTS', COUNT(*) FROM payments
UNION ALL
SELECT 'VEHICLE_PHOTOS', COUNT(*) FROM vehicle_photos;

SELECT '=== PHÂN LOẠI USERS ===' as info;
SELECT role, COUNT(*) as count FROM users GROUP BY role;

SELECT '=== PHÂN LOẠI VEHICLES ===' as info;
SELECT vehicle_type, COUNT(*) as count FROM vehicles GROUP BY vehicle_type;

SELECT '=== PHÂN LOẠI VEHICLE STATUS ===' as info;
SELECT status, COUNT(*) as count FROM vehicles GROUP BY status;

SELECT '=== PHÂN LOẠI BOOKING STATUS ===' as info;
SELECT status, COUNT(*) as count FROM bookings GROUP BY status;

SELECT '=== TỔNG DOANH THU (COMPLETED) ===' as info;
SELECT 
  SUM(total_amount) as total_revenue,
  currency
FROM bookings 
WHERE status = 'COMPLETED'
GROUP BY currency;

SELECT '=== DỮ LIỆU ĐÃ ĐƯỢC TẠO THÀNH CÔNG! ===' as message;

