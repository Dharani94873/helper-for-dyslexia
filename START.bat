@echo off
echo ====================================
echo Dyslexia Helper - Startup Script
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not found in PATH
    echo Please restart your terminal or computer after Node.js installation
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js found! Version:
node --version
echo.

REM Check if MongoDB is running (optional)
echo Checking for MongoDB...
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Docker found. Starting MongoDB container...
    docker start dyslexia-mongodb 2>nul || docker run -d -p 27017:27017 --name dyslexia-mongodb mongo:6.0
    timeout /t 3 >nul
) else (
    echo Docker not found. Assuming MongoDB is running locally or skipping...
)

echo.
echo ====================================
echo Installing Backend Dependencies...
echo ====================================
cd backend
if not exist node_modules (
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo ====================================
echo Checking Database...
echo ====================================
if not exist ".seeded" (
    echo Seeding database with demo data...
    call npm run seed
    echo. > .seeded
) else (
    echo Database already seeded.
)

echo.
echo ====================================
echo Starting Backend Server...
echo ====================================
echo Backend will run on http://localhost:5000
start "Dyslexia Helper - Backend" cmd /k "npm run dev"

timeout /t 3 >nul

echo.
echo ====================================
echo Starting Frontend Server...
echo ====================================
cd ..\frontend
echo Frontend will run on http://localhost:3000
start "Dyslexia Helper - Frontend" cmd /k "python -m http.server 3000 || npx http-server -p 3000"

timeout /t 2 >nul

echo.
echo ====================================
echo Application Starting!
echo ====================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Login:
echo   Email:    user@example.com
echo   Password: User123!
echo.
echo Opening browser in 3 seconds...
timeout /t 3 >nul

start http://localhost:3000

echo.
echo Press any key to close this window (servers will keep running)
pause >nul
