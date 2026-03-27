@echo off
echo ==========================================
echo  Dyslexia Helper - Stopping All Services
echo ==========================================
echo.

echo [1/2] Stopping Docker containers...
docker-compose down
echo ✓ Containers stopped
echo.

echo [2/2] Closing server windows...
echo Please close the Backend and Frontend terminal windows manually.
echo (The windows titled "Dyslexia Helper - Backend/Frontend")
echo.

echo ==========================================
echo  All Services Stopped
echo ==========================================
echo.
pause
