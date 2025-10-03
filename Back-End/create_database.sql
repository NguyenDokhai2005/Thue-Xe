-- =====================================================
-- Car Rental Database Creation Script
-- =====================================================

-- Xóa database cũ nếu tồn tại
DROP DATABASE IF EXISTS `car-rental`;

-- Tạo database mới
CREATE DATABASE `car-rental` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE `car-rental`;

-- =====================================================
-- Bảng users - Quản lý người dùng
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    role ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Bảng vehicles - Quản lý xe
-- =====================================================
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT,
    owner_name VARCHAR(120) NOT NULL,
    title VARCHAR(150) NOT NULL,
    vehicle_type ENUM('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP', 'VAN', 'MOTORCYCLE') NOT NULL,
    license_plate VARCHAR(32) NOT NULL,
    daily_price DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'AVAILABLE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- Bảng bookings - Quản lý đặt xe
-- =====================================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    renter_id BIGINT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    daily_price_snapshot DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Bảng payments - Quản lý thanh toán
-- =====================================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'CRYPTOCURRENCY') NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    provider VARCHAR(80),
    provider_txn_id VARCHAR(128),
    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- =====================================================
-- Bảng vehicle_photos - Quản lý hình ảnh xe
-- =====================================================
CREATE TABLE vehicle_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    url VARCHAR(512) NOT NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- =====================================================
-- Tạo Indexes để tối ưu hiệu suất
-- =====================================================

-- Indexes cho bảng users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Indexes cho bảng vehicles
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_daily_price ON vehicles(daily_price);

-- Indexes cho bảng bookings
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_at, end_at);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Indexes cho bảng payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Indexes cho bảng vehicle_photos
CREATE INDEX idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);
CREATE INDEX idx_vehicle_photos_primary ON vehicle_photos(vehicle_id, is_primary);

-- =====================================================
-- Insert dữ liệu mẫu
-- =====================================================

-- Insert users mẫu
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@carrental.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin User', '0123456789', 'ADMIN'),
('customer1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'John Doe', '0987654321', 'CUSTOMER'),
('customer2@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Jane Smith', '0123456780', 'CUSTOMER'),
('employee1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Employee User', '0123456787', 'EMPLOYEE');

-- Insert vehicles mẫu
INSERT INTO vehicles (owner_id, owner_name, title, vehicle_type, license_plate, daily_price, currency, status, description) VALUES
(2, 'John Doe', 'Toyota Camry 2023', 'SEDAN', '30A-12345', 500000, 'VND', 'AVAILABLE', 'Xe sedan cao cấp, tiết kiệm nhiên liệu, phù hợp cho gia đình'),
(3, 'Jane Smith', 'Honda CR-V 2023', 'SUV', '29A-67890', 700000, 'VND', 'AVAILABLE', 'Xe SUV 7 chỗ, phù hợp gia đình, không gian rộng rãi'),
(2, 'John Doe', 'BMW X5 2023', 'SUV', '30A-11111', 1200000, 'VND', 'AVAILABLE', 'Xe SUV sang trọng, đầy đủ tiện nghi, động cơ mạnh mẽ'),
(3, 'Jane Smith', 'Mercedes C-Class 2023', 'SEDAN', '29A-22222', 800000, 'VND', 'RENTED', 'Xe sedan sang trọng, nội thất cao cấp'),
(2, 'John Doe', 'Ford Ranger 2023', 'PICKUP', '30A-33333', 600000, 'VND', 'AVAILABLE', 'Xe bán tải mạnh mẽ, phù hợp công việc');

-- Insert vehicle photos mẫu
INSERT INTO vehicle_photos (vehicle_id, url, is_primary) VALUES
(1, 'https://example.com/images/toyota-camry-1.jpg', 1),
(1, 'https://example.com/images/toyota-camry-2.jpg', 0),
(1, 'https://example.com/images/toyota-camry-3.jpg', 0),
(2, 'https://example.com/images/honda-crv-1.jpg', 1),
(2, 'https://example.com/images/honda-crv-2.jpg', 0),
(3, 'https://example.com/images/bmw-x5-1.jpg', 1),
(3, 'https://example.com/images/bmw-x5-2.jpg', 0),
(4, 'https://example.com/images/mercedes-c-class-1.jpg', 1),
(5, 'https://example.com/images/ford-ranger-1.jpg', 1);

-- Insert bookings mẫu
INSERT INTO bookings (vehicle_id, renter_id, status, start_at, end_at, daily_price_snapshot, total_amount, currency, notes) VALUES
(1, 2, 'COMPLETED', '2024-01-01 08:00:00', '2024-01-03 18:00:00', 500000, 1000000, 'VND', 'Thuê xe cho chuyến du lịch'),
(2, 3, 'ACTIVE', '2024-01-15 09:00:00', '2024-01-20 17:00:00', 700000, 3500000, 'VND', 'Thuê xe cho công việc'),
(3, 2, 'PENDING', '2024-02-01 10:00:00', '2024-02-05 16:00:00', 1200000, 6000000, 'VND', 'Thuê xe cho sự kiện quan trọng');

-- Insert payments mẫu
INSERT INTO payments (booking_id, amount, currency, method, status, provider, provider_txn_id, paid_at) VALUES
(1, 1000000, 'VND', 'CREDIT_CARD', 'COMPLETED', 'VNPay', 'VNPAY_123456789', '2024-01-01 08:30:00'),
(2, 3500000, 'VND', 'BANK_TRANSFER', 'COMPLETED', 'Vietcombank', 'VCB_987654321', '2024-01-15 09:15:00'),
(3, 6000000, 'VND', 'CREDIT_CARD', 'PENDING', 'VNPay', 'VNPAY_456789123', NULL);

-- =====================================================
-- Kiểm tra dữ liệu
-- =====================================================

-- Hiển thị thông tin các bảng
SHOW TABLES;

-- Kiểm tra dữ liệu users
SELECT 'USERS TABLE' as table_name;
SELECT * FROM users;

-- Kiểm tra dữ liệu vehicles
SELECT 'VEHICLES TABLE' as table_name;
SELECT * FROM vehicles;

-- Kiểm tra dữ liệu bookings
SELECT 'BOOKINGS TABLE' as table_name;
SELECT * FROM bookings;

-- Kiểm tra dữ liệu payments
SELECT 'PAYMENTS TABLE' as table_name;
SELECT * FROM payments;

-- Kiểm tra dữ liệu vehicle_photos
SELECT 'VEHICLE_PHOTOS TABLE' as table_name;
SELECT * FROM vehicle_photos;

-- =====================================================
-- Thông tin database
-- =====================================================
SELECT 'DATABASE CREATED SUCCESSFULLY!' as message;
SELECT 'Database: car-rental' as info;
SELECT 'Charset: utf8mb4' as charset;
SELECT 'Collation: utf8mb4_unicode_ci' as collation;
SELECT NOW() as created_at;
