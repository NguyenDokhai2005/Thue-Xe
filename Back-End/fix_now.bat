@echo off
echo Fixing Car Rental Database Issue...
echo.

echo Step 1: Stopping any running Spring Boot application...
taskkill /f /im java.exe 2>nul

echo Step 2: Dropping and recreating database...
mysql -u root -p -e "DROP DATABASE IF EXISTS \`car-rental\`; CREATE DATABASE \`car-rental\`;"

echo Step 3: Starting Spring Boot application...
mvnw.cmd spring-boot:run

pause


