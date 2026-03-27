@echo off
echo ==========================================
echo  Dyslexia Helper - Starting All Services
echo ==========================================
echo.

REM Check if Docker Desktop is running
echo [1/4] Checking Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and wait for it to be ready.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)
echo ✓ Docker Desktop is running
echo.

REM Start MongoDB
echo [2/4] Starting MongoDB...
docker start dyslexia-mongodb >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB container not found, creating new one...
    docker-compose up -d mongodb
    if %errorlevel% neq 0 (
        echo ERROR: Failed to start MongoDB
        pause
        exit /b 1
    )
    echo ✓ MongoDB container created and started
) else (
    echo ✓ MongoDB container started
)
echo.

REM Wait for MongoDB to be ready
echo Waiting for MongoDB to be ready...
timeout /t 3 /nobreak >nul
echo.

REM Start Backend Server
echo [3/4] Starting Backend Server...
cd backend
start "Dyslexia Helper - Backend" cmd /k "npm start"
cd ..
echo ✓ Backend server starting in new window...
echo.

REM Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul
echo.

REM Start Frontend Server
echo [4/4] Starting Frontend Server...
cd frontend
start "Dyslexia Helper - Frontend" cmd /k "npx http-server -p 3000"
cd ..
echo ✓ Frontend server starting in new window...
echo.

echo ==========================================
echo  All Services Started Successfully!
echo ==========================================
echo.
echo Frontend: http://127.0.0.1:3000
echo Backend:  http://localhost:5000
echo MongoDB:  mongodb://localhost:27017
echo.
echo Login Page:  http://127.0.0.1:3000/login.html
echo Signup Page: http://127.0.0.1:3000/signup.html
echo.
echo Demo Credentials:
echo   Email:    user@example.com
echo   Password: User123!
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://127.0.0.1:3000

echo.
echo Application opened in browser!
echo.
echo To stop all services:
echo   - Close the Backend and Frontend terminal windows
echo   - Run: docker-compose down
echo.
pause
