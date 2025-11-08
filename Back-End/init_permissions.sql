-- Script khởi tạo phân quyền cho hệ thống Car Rental
-- Chạy script này sau khi tạo admin để thiết lập phân quyền mặc định

-- Tạo bảng role_permissions nếu chưa có
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_role_permission (role, permission)
);

-- Xóa dữ liệu cũ nếu có
DELETE FROM role_permissions;

-- ADMIN - Có tất cả permissions
INSERT INTO role_permissions (role, permission) VALUES
-- User Management
('ADMIN', 'USER_VIEW'),
('ADMIN', 'USER_CREATE'),
('ADMIN', 'USER_UPDATE'),
('ADMIN', 'USER_DELETE'),
('ADMIN', 'USER_CHANGE_ROLE'),
('ADMIN', 'USER_VIEW_ALL'),

-- Vehicle Management
('ADMIN', 'VEHICLE_VIEW'),
('ADMIN', 'VEHICLE_CREATE'),
('ADMIN', 'VEHICLE_UPDATE'),
('ADMIN', 'VEHICLE_DELETE'),
('ADMIN', 'VEHICLE_SEARCH'),
('ADMIN', 'VEHICLE_VIEW_ALL'),

-- Booking Management
('ADMIN', 'BOOKING_VIEW'),
('ADMIN', 'BOOKING_CREATE'),
('ADMIN', 'BOOKING_UPDATE'),
('ADMIN', 'BOOKING_DELETE'),
('ADMIN', 'BOOKING_CONFIRM'),
('ADMIN', 'BOOKING_ACTIVATE'),
('ADMIN', 'BOOKING_COMPLETE'),
('ADMIN', 'BOOKING_CANCEL'),
('ADMIN', 'BOOKING_VIEW_ALL'),
('ADMIN', 'BOOKING_VIEW_MY'),

-- Admin Functions
('ADMIN', 'ADMIN_DASHBOARD'),
('ADMIN', 'ADMIN_REPORTS'),
('ADMIN', 'ADMIN_SETTINGS'),
('ADMIN', 'ADMIN_BACKUP'),

-- Employee Functions
('ADMIN', 'EMPLOYEE_DASHBOARD'),
('ADMIN', 'EMPLOYEE_BOOKING_MANAGE'),
('ADMIN', 'EMPLOYEE_CUSTOMER_SUPPORT'),

-- Customer Functions
('ADMIN', 'CUSTOMER_PROFILE'),
('ADMIN', 'CUSTOMER_BOOKING'),
('ADMIN', 'CUSTOMER_VIEW_HISTORY');

-- EMPLOYEE - Permissions cho nhân viên
INSERT INTO role_permissions (role, permission) VALUES
-- Employee Functions
('EMPLOYEE', 'EMPLOYEE_DASHBOARD'),
('EMPLOYEE', 'EMPLOYEE_BOOKING_MANAGE'),
('EMPLOYEE', 'EMPLOYEE_CUSTOMER_SUPPORT'),

-- Vehicle Management (chỉ xem và tìm kiếm)
('EMPLOYEE', 'VEHICLE_VIEW'),
('EMPLOYEE', 'VEHICLE_SEARCH'),
('EMPLOYEE', 'VEHICLE_VIEW_ALL'),

-- Booking Management (quản lý đặt xe)
('EMPLOYEE', 'BOOKING_VIEW'),
('EMPLOYEE', 'BOOKING_VIEW_ALL'),
('EMPLOYEE', 'BOOKING_CONFIRM'),
('EMPLOYEE', 'BOOKING_ACTIVATE'),
('EMPLOYEE', 'BOOKING_COMPLETE'),
('EMPLOYEE', 'BOOKING_CANCEL'),

-- User Management (chỉ xem thông tin khách hàng)
('EMPLOYEE', 'USER_VIEW'),
('EMPLOYEE', 'CUSTOMER_PROFILE');

-- CUSTOMER - Permissions cho khách hàng
INSERT INTO role_permissions (role, permission) VALUES
-- Customer Functions
('CUSTOMER', 'CUSTOMER_PROFILE'),
('CUSTOMER', 'CUSTOMER_BOOKING'),
('CUSTOMER', 'CUSTOMER_VIEW_HISTORY'),

-- Vehicle Management (chỉ xem và tìm kiếm)
('CUSTOMER', 'VEHICLE_VIEW'),
('CUSTOMER', 'VEHICLE_SEARCH'),

-- Booking Management (chỉ đặt xe và xem của mình)
('CUSTOMER', 'BOOKING_VIEW_MY'),
('CUSTOMER', 'BOOKING_CREATE'),
('CUSTOMER', 'BOOKING_CANCEL');

-- Hiển thị kết quả
SELECT 
    role,
    COUNT(*) as permission_count,
    GROUP_CONCAT(permission ORDER BY permission SEPARATOR ', ') as permissions
FROM role_permissions 
WHERE is_active = TRUE
GROUP BY role
ORDER BY role;

-- Thống kê permissions theo module
SELECT 
    CASE 
        WHEN permission LIKE 'USER_%' THEN 'User Management'
        WHEN permission LIKE 'VEHICLE_%' THEN 'Vehicle Management'
        WHEN permission LIKE 'BOOKING_%' THEN 'Booking Management'
        WHEN permission LIKE 'ADMIN_%' THEN 'Admin Functions'
        WHEN permission LIKE 'EMPLOYEE_%' THEN 'Employee Functions'
        WHEN permission LIKE 'CUSTOMER_%' THEN 'Customer Functions'
        ELSE 'Other'
    END as module,
    COUNT(*) as permission_count
FROM role_permissions 
WHERE is_active = TRUE
GROUP BY module
ORDER BY module;
