# Quick Start Scripts

Collection of helper scripts to quickly start the development environment.

## Windows (PowerShell)

### start-dev.ps1
```powershell
# Start backend development server
Write-Host "Starting Dyslexia Helper Development Environment..." -ForegroundColor Green

# Check if MongoDB is running
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (!$mongoRunning) {
    Write-Host "Starting MongoDB via Docker..." -ForegroundColor Yellow
    docker run -d -p 27017:27017 --name dyslexia-mongodb mongo:6.0
}

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; python -m http.server 3000"

Write-Host "Development environment started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
```

**Usage:**
```powershell
.\start-dev.ps1
```

## Linux/Mac (Bash)

### start-dev.sh
```bash
#!/bin/bash

echo "Starting Dyslexia Helper Development Environment..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB via Docker..."
    docker run -d -p 27017:27017 --name dyslexia-mongodb mongo:6.0
fi

# Start backend in new terminal
echo "Starting backend server..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd backend && npm run dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "cd backend && npm run dev" &
else
    # Fallback: Start in background
    (cd backend && npm run dev &)
fi

# Wait for backend
sleep 3

# Start frontend in new terminal
echo "Starting frontend server..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd frontend && python3 -m http.server 3000; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "cd frontend && python3 -m http.server 3000" &
else
    # Fallback
    (cd frontend && python3 -m http.server 3000 &)
fi

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
```

**Make executable and run:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

## Using Docker Compose (All Platforms)

**Easiest option - recommended for development:**

```bash
# Start all services (MongoDB + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Seed database
docker-compose exec backend npm run seed

# Stop all services
docker-compose down
```

Then serve frontend separately:
```bash
cd frontend
python -m http.server 3000
# or
npx http-server -p 3000
```

## NPM Scripts Available

### Backend (./backend)
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm test           # Run tests
npm run seed       # Seed database with demo data
```

### Frontend (./frontend)
```bash
npm run serve      # Serve frontend (requires http-server)
```

## Environment Setup

Before first run:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Install dependencies
npm install

# Seed database
npm run seed
```

## Troubleshooting

**Port 5000 in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection failed:**
```bash
# Verify MongoDB is running
docker ps

# Check logs
docker logs dyslexia-mongodb
```

**Cannot access frontend:**
- Ensure port 3000 is not in use
- Try different port: `python -m http.server 8080`
