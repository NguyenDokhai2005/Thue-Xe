@echo off
echo ================================================
echo    Car Rental Database Setup
echo ================================================
echo.

echo Step 1: Creating database and tables...
mysql -u root -p < create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo    Database created successfully!
    echo ================================================
    echo.
    echo Database: car-rental
    echo Tables: users, vehicles, bookings, payments, vehicle_photos
    echo Sample data: 4 users, 5 vehicles, 3 bookings, 3 payments, 9 photos
    echo.
    echo Default users:
    echo - admin@carrental.com (password: password123)
    echo - customer1@example.com (password: password123)
    echo - customer2@example.com (password: password123)
    echo - employee1@example.com (password: password123)
    echo.
    echo You can now start your Spring Boot application!
) else (
    echo.
    echo ================================================
    echo    Error creating database!
    echo ================================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Username/password is correct
    echo 3. You have permission to create databases
)

echo.
pause
