-- =====================================================
-- Car Rental Database Creation Script (Updated Schema)
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
-- Bảng users - Quản lý người dùng (Updated Schema)
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    `full-name` VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    role ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER'
);

-- =====================================================
-- Bảng vehicles - Quản lý xe
-- =====================================================
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    vehicle_type ENUM('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP', 'VAN', 'MOTORCYCLE') NOT NULL,
    license_plate VARCHAR(32) NOT NULL,
    daily_price DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'AVAILABLE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Indexes cho bảng vehicles
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
