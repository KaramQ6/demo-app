#!/bin/bash

# SmartTour.Jo Backend Production Deployment Script for Vercel
# Run this script from the project root directory

set -e  # Exit on any error

echo "🚀 Starting SmartTour.Jo Backend Deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo -e "${YELLOW}Installing Vercel CLI globally...${NC}"
    npm install -g vercel
fi

# Create deployment directory if it doesn't exist
mkdir -p deployment

# Copy backend files to deployment directory
echo -e "${BLUE}📁 Preparing backend files for deployment...${NC}"
cp -r backend deployment/
cp deployment/vercel.json ./
cp deployment/requirements.txt deployment/backend/

# Create production environment file
echo -e "${BLUE}🔧 Setting up environment variables...${NC}"
cat > deployment/backend/.env.production << EOF
# Production Environment Variables for SmartTour.Jo Backend

# Database Configuration
MONGO_URL=\${MONGO_URL}
DB_NAME=smarttour_production

# Supabase Configuration  
SUPABASE_URL=\${SUPABASE_URL}
SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=\${SUPABASE_SERVICE_ROLE_KEY}

# JWT Configuration
JWT_SECRET_KEY=\${JWT_SECRET_KEY}
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# External API Configuration
N8N_WEBHOOK_BASE_URL=\${N8N_WEBHOOK_BASE_URL}

# Application Configuration
APP_NAME=SmartTour.Jo API
APP_VERSION=1.0.0
DEBUG=false
ENVIRONMENT=production

# CORS Configuration
ALLOWED_ORIGINS=https://your-domain.com,https://smarttour-jo.vercel.app
EOF

# Update server.py for production
echo -e "${BLUE}⚙️ Configuring server for production...${NC}"
cat > deployment/backend/main.py << 'EOF'
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app
from server import app

# This is required for Vercel
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
EOF

# Create Vercel configuration check
echo -e "${BLUE}🔍 Validating deployment configuration...${NC}"

# Check if required environment variables are set
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "JWT_SECRET_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    echo -e "${YELLOW}Please set these variables before deployment${NC}"
    echo -e "${YELLOW}You can set them using: vercel env add VARIABLE_NAME${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${GREEN}🚀 Deploying to Vercel...${NC}"
cd deployment

# Link to Vercel project (will prompt for setup if first time)
vercel link

# Set environment variables in Vercel (if not already set)
echo -e "${BLUE}🔧 Setting up Vercel environment variables...${NC}"
vercel env add MONGO_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add JWT_SECRET_KEY production
vercel env add N8N_WEBHOOK_BASE_URL production

# Deploy to production
echo -e "${GREEN}🚀 Deploying to production...${NC}"
vercel --prod

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=$(vercel whoami) | grep smarttour | head -1 | awk '{print $2}')

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your backend is live at: https://${DEPLOYMENT_URL}${NC}"
echo -e "${BLUE}📝 API Documentation: https://${DEPLOYMENT_URL}/docs${NC}"
echo -e "${BLUE}🔍 Health Check: https://${DEPLOYMENT_URL}/api/health${NC}"

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
curl -f "https://${DEPLOYMENT_URL}/api/health" || echo -e "${YELLOW}⚠️ Health check failed - please check logs${NC}"

echo -e "${GREEN}🎉 Backend deployment complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "${YELLOW}1. Update mobile app API URL to: https://${DEPLOYMENT_URL}${NC}"
echo -e "${YELLOW}2. Test all API endpoints${NC}"
echo -e "${YELLOW}3. Monitor logs with: vercel logs${NC}"

# Cleanup
cd ..
rm -f vercel.json

echo -e "${GREEN}✨ Deployment script completed!${NC}"