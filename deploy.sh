#!/bin/bash
# DigitalOcean Deployment Script for SmartTour.Jo

echo "🚀 Starting SmartTour.Jo deployment on DigitalOcean..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Stopping existing containers..."
docker-compose down

print_status "Building Docker images..."
docker-compose build --no-cache

print_status "Starting services..."
docker-compose up -d

print_status "Waiting for services to start..."
sleep 10

# Check if frontend is running
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "Frontend is running on http://localhost:80"
else
    print_error "Frontend failed to start"
    docker-compose logs frontend
    exit 1
fi

# Check if backend is running (if enabled)
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend is running on http://localhost:5000"
else
    print_warning "Backend is not responding (this may be expected if not configured)"
fi

print_success "🎉 SmartTour.Jo deployed successfully!"
print_status "Frontend: http://localhost:80"
print_status "Backend API: http://localhost:5000"
print_status "Database: localhost:5432"

print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
print_status "To restart: docker-compose restart"
