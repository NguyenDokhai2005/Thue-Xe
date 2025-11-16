#!/bin/bash

echo "========================================"
echo "Car Rental - Seed Data Script"
echo "========================================"
echo ""

# Kiểm tra MySQL có sẵn không
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL không được tìm thấy!"
    echo "Vui lòng cài đặt MySQL hoặc thêm MySQL vào PATH."
    exit 1
fi

# Nhập thông tin MySQL
read -p "MySQL Username (mặc định: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "MySQL Password: " DB_PASS
echo ""

# Chạy seed data
if [ -z "$DB_PASS" ]; then
    echo "Đang chạy với MySQL không password..."
    mysql -u "$DB_USER" car-rental < seed_data_comprehensive.sql
else
    mysql -u "$DB_USER" -p"$DB_PASS" car-rental < seed_data_comprehensive.sql
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Seed data đã được chèn thành công!"
    echo "========================================"
    echo ""
    echo "Thông tin đăng nhập:"
    echo "- Tất cả users: password = 123456"
    echo "- Admin: admin, admin2"
    echo "- Employee: nhanvien1, nhanvien2, nhanvien3"
    echo "- Customer: khachhang1 đến khachhang8"
    echo ""
else
    echo ""
    echo "========================================"
    echo "LỖI: Không thể chèn seed data!"
    echo "========================================"
    echo ""
    echo "Kiểm tra:"
    echo "1. Database 'car-rental' đã được tạo chưa?"
    echo "2. Thông tin đăng nhập MySQL đúng chưa?"
    echo "3. Đã chạy create_database_new.sql chưa?"
    echo ""
    exit 1
fi

