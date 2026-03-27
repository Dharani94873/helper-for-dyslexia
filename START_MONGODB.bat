@echo off
echo Starting MongoDB...
docker start dyslexia-mongodb

echo.
echo Checking MongoDB status...
docker ps

echo.
echo MongoDB is now running!
echo You can connect to: mongodb://localhost:27017
echo.
pause
