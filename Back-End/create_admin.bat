@echo off
echo ================================================
echo    Creating Admin Account
echo ================================================
echo.

echo Step 1: Creating admin user in database...
mysql -u root -p < create_admin.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo    Admin account created successfully!
    echo ================================================
    echo.
    echo Admin credentials:
    echo Email: admin@carrental.com
    echo Password: password123
    echo Role: ADMIN
    echo.
    echo You can now login with these credentials!
) else (
    echo.
    echo ================================================
    echo    Error creating admin account!
    echo ================================================
    echo.
    echo Please check MySQL connection and try again.
)

echo.
pause
