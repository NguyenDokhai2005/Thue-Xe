@echo off
echo ========================================
echo Car Rental - Seed Data Script
echo ========================================
echo.

REM Kiểm tra MySQL có sẵn không
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL không được tìm thấy trong PATH!
    echo Vui lòng cài đặt MySQL hoặc thêm MySQL vào PATH.
    pause
    exit /b 1
)

echo Nhập thông tin MySQL:
set /p DB_USER="Username (mặc định: root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASS="Password: "
if "%DB_PASS%"=="" (
    echo Đang chạy với MySQL không password...
    set MYSQL_CMD=mysql -u %DB_USER%
) else (
    set MYSQL_CMD=mysql -u %DB_USER% -p%DB_PASS%
)

echo.
echo Đang chạy seed data...
echo.

REM Chạy seed data
%MYSQL_CMD% car-rental < seed_data_comprehensive.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Seed data đã được chèn thành công!
    echo ========================================
    echo.
    echo Thông tin đăng nhập:
    echo - Tất cả users: password = 123456
    echo - Admin: admin, admin2
    echo - Employee: nhanvien1, nhanvien2, nhanvien3
    echo - Customer: khachhang1 đến khachhang8
    echo.
) else (
    echo.
    echo ========================================
    echo LỖI: Không thể chèn seed data!
    echo ========================================
    echo.
    echo Kiểm tra:
    echo 1. Database 'car-rental' đã được tạo chưa?
    echo 2. Thông tin đăng nhập MySQL đúng chưa?
    echo 3. Đã chạy create_database_new.sql chưa?
    echo.
)

pause

