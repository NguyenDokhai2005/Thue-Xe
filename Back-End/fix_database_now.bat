@echo off
echo ================================================
echo    Fixing Car Rental Database
echo ================================================
echo.

echo Step 1: Stopping Spring Boot application...
taskkill /f /im java.exe 2>nul

echo Step 2: Dropping old database...
mysql -u root -p -e "DROP DATABASE IF EXISTS \`car-rental\`;"

echo Step 3: Creating new database with correct structure...
mysql -u root -p < create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo    Database fixed successfully!
    echo ================================================
    echo.
    echo Now you can start your Spring Boot application:
    echo mvnw.cmd spring-boot:run
) else (
    echo.
    echo ================================================
    echo    Error fixing database!
    echo ================================================
    echo.
    echo Please check MySQL connection and try again.
)

echo.
pause













