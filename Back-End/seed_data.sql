-- Seed data for Car-Rental database
-- Run AFTER create_database_new.sql

USE `car-rental`;

-- =====================
-- USERS
-- =====================
INSERT INTO users (username, password, `full-name`, phone, role) VALUES
  ('admin', '$2a$10$u0b0ZJ6H0q1v8bJYqKcPve3f7b7n9e1S3b7m1z0E0b0o0p0q0r0s.', 'System Administrator', '0123456789', 'ADMIN'),
  ('alice', '$2a$10$u0b0ZJ6H0q1v8bJYqKcPve3f7b7n9e1S3b7m1z0E0b0o0p0q0r0s.', 'Alice Nguyen', '0901000001', 'CUSTOMER'),
  ('bob',   '$2a$10$u0b0ZJ6H0q1v8bJYqKcPve3f7b7n9e1S3b7m1z0E0b0o0p0q0r0s.', 'Bob Tran',    '0901000002', 'CUSTOMER'),
  ('carol', '$2a$10$u0b0ZJ6H0q1v8bJYqKcPve3f7b7n9e1S3b7m1z0E0b0o0p0q0r0s.', 'Carol Pham',  '0901000003', 'CUSTOMER'),
  ('dave',  '$2a$10$u0b0ZJ6H0q1v8bJYqKcPve3f7b7n9e1S3b7m1z0E0b0o0p0q0r0s.', 'Dave Le',     '0901000004', 'CUSTOMER');

-- Passwords here are bcrypt placeholders; replace as needed.

-- =====================
-- VEHICLES
-- =====================
INSERT INTO vehicles (title, vehicle_type, license_plate, daily_price, currency, status, description) VALUES
  ('Toyota Vios 2020',       'SEDAN',       '30A-123.45', 400000, 'VND', 'AVAILABLE', 'Xe gia đình tiết kiệm nhiên liệu'),
  ('Honda CR-V 2021',        'SUV',         '30G-678.90', 800000, 'VND', 'AVAILABLE', 'SUV 7 chỗ rộng rãi'),
  ('Hyundai Accent 2019',    'SEDAN',       '29B-222.33', 380000, 'VND', 'AVAILABLE', 'Dễ lái, phù hợp đô thị'),
  ('Kia Morning 2018',       'HATCHBACK',   '29A-456.78', 300000, 'VND', 'AVAILABLE', 'Nhỏ gọn, tiết kiệm'),
  ('Ford Ranger 2022',       'PICKUP',      '88C-999.11', 950000, 'VND', 'AVAILABLE', 'Mạnh mẽ, off-road tốt'),
  ('Mercedes C200 2020',     'SEDAN',       '51H-111.22', 1500000, 'VND','AVAILABLE', 'Sang trọng'),
  ('Mazda CX-5 2022',        'SUV',         '30F-333.44', 900000, 'VND', 'AVAILABLE', 'SUV 5 chỗ cao cấp'),
  ('Yamaha Exciter 155',     'MOTORCYCLE',  'MOTO-01',    150000, 'VND', 'AVAILABLE', 'Xe máy thể thao');

-- =====================
-- VEHICLE PHOTOS (minimal)
-- =====================
INSERT INTO vehicle_photos (vehicle_id, url, is_primary) VALUES
  (1, 'https://pics.example.com/vios.jpg', 1),
  (2, 'https://pics.example.com/crv.jpg', 1),
  (3, 'https://pics.example.com/accent.jpg', 1),
  (4, 'https://pics.example.com/morning.jpg', 1);

-- =====================
-- BOOKINGS (create some overlaps for testing date search)
-- =====================
-- Assume: alice id=2, bob id=3 (based on insertion order)
INSERT INTO bookings (vehicle_id, renter_id, status, start_at, end_at, daily_price_snapshot, total_amount, currency, notes)
VALUES
  -- Vios booked by Alice: overlaps around 2025-10-20 to 2025-10-22
  (1, 2, 'CONFIRMED', '2025-10-20 08:00:00', '2025-10-21 18:00:00', 400000, 600000, 'VND', 'Trip 1'),
  -- Vios booked by Bob: another overlapping period
  (1, 3, 'ACTIVE',    '2025-10-22 07:00:00', '2025-10-23 12:00:00', 400000, 800000, 'VND', 'Trip 2'),
  -- CR-V booked, non-overlap window
  (2, 2, 'CONFIRMED', '2025-11-01 09:00:00', '2025-11-03 10:00:00', 800000, 1600000, 'VND', 'Family'),
  -- CX-5 booked long rental
  (7, 3, 'CONFIRMED', '2025-10-19 09:00:00', '2025-10-25 10:00:00', 900000, 5400000, 'VND', 'Business');

-- =====================
-- PAYMENTS (optional)
-- =====================
INSERT INTO payments (booking_id, amount, currency, method, status, provider, provider_txn_id, paid_at)
VALUES
  (1, 600000, 'VND', 'CASH', 'COMPLETED', 'cashier', 'CASH-0001', '2025-10-20 08:05:00'),
  (2, 800000, 'VND', 'CREDIT_CARD', 'COMPLETED', 'visa', 'VISA-XYZ-0002', '2025-10-22 07:10:00');

-- =====================
-- QUICK CHECKS
-- =====================
SELECT COUNT(*) AS users_count FROM users;
SELECT COUNT(*) AS vehicles_count FROM vehicles;
SELECT COUNT(*) AS bookings_count FROM bookings;
SELECT COUNT(*) AS payments_count FROM payments;

