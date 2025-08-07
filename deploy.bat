@echo off
REM DigitalOcean Deployment Script for SmartTour.Jo (Windows)

echo.
echo 🚀 Starting SmartTour.Jo deployment on DigitalOcean...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 📦 Stopping existing containers...
docker-compose down

echo 🔨 Building Docker images...
docker-compose build --no-cache

echo 🚀 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if frontend is running
curl -f http://localhost:80 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on http://localhost:80
) else (
    echo ❌ Frontend failed to start
    docker-compose logs frontend
    pause
    exit /b 1
)

REM Check if backend is running
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on http://localhost:5000
) else (
    echo ⚠️  Backend is not responding (this may be expected if not configured)
)

echo.
echo 🎉 SmartTour.Jo deployed successfully!
echo.
echo 🌐 Frontend: http://localhost:80
echo 🔌 Backend API: http://localhost:5000  
echo 🗄️  Database: localhost:5432
echo.
echo 📝 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop: docker-compose down
echo    Restart: docker-compose restart
echo.
pause
