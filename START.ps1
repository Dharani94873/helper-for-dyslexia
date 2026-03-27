# Dyslexia Helper - Startup Script (PowerShell)

Write-Host "====================================" -ForegroundColor Green
Write-Host "Dyslexia Helper - Startup Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found! Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not found in PATH" -ForegroundColor Red
    Write-Host "Please restart your terminal or computer after Node.js installation" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check for Docker/MongoDB
Write-Host "Checking for MongoDB..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "Docker found. Starting MongoDB container..." -ForegroundColor Green
    
    # Try to start existing container or create new one
    $startResult = docker start dyslexia-mongodb 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating new MongoDB container..." -ForegroundColor Yellow
        docker run -d -p 27017:27017 --name dyslexia-mongodb mongo:6.0
    }
    Start-Sleep -Seconds 3
} catch {
    Write-Host "Docker not found. Assuming MongoDB is running locally..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Set-Location backend

if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Checking Database..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

if (-not (Test-Path ".seeded")) {
    Write-Host "Seeding database with demo data..." -ForegroundColor Yellow
    npm run seed
    New-Item -Path ".seeded" -ItemType File -Force | Out-Null
} else {
    Write-Host "Database already seeded." -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Backend will run on http://localhost:5000" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Set-Location ..\frontend
Write-Host "Frontend will run on http://localhost:3000" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python -m http.server 3000"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "====================================" -ForegroundColor Green  
Write-Host "Application Starting!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Yellow
Write-Host "  Email:    user@example.com"
Write-Host "  Password: User123!"
Write-Host ""
Write-Host "Opening browser in 3 seconds..." -ForegroundColor Yellow

Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Servers are running in separate windows." -ForegroundColor Green
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"
