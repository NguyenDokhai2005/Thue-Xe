-- Tạo tài khoản admin
USE `car-rental`;

-- Cách 1: Cập nhật user hiện có thành admin
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@carrental.com';

-- Cách 2: Tạo admin mới (nếu chưa có)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@carrental.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'System Administrator', '0123456789', 'ADMIN')
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Kiểm tra kết quả
SELECT id, email, full_name, role, created_at FROM users WHERE role = 'ADMIN';
