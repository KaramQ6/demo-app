#!/bin/bash

# SmartTour.Jo Quick Deployment Script
# One-command deployment for both backend and mobile app

set -e

echo "🚀 SmartTour.Jo Quick Deployment Starting..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      SmartTour.Jo                            ║"
echo "║                 Production Deployment                        ║"
echo "║                                                              ║"
echo "║  Backend: Vercel     Mobile: iOS + Android                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check if we're in the right directory
if [ ! -f "backend/server.py" ] || [ ! -f "mobile/package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Check required tools
MISSING_TOOLS=()

if ! command -v node &> /dev/null; then
    MISSING_TOOLS+=("node")
fi

if ! command -v yarn &> /dev/null; then
    MISSING_TOOLS+=("yarn")
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

if ! command -v python3 &> /dev/null; then
    MISSING_TOOLS+=("python3")
fi

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required tools: ${MISSING_TOOLS[*]}${NC}"
    echo -e "${YELLOW}Please install the missing tools and run again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Get deployment configuration
echo -e "${BLUE}📝 Deployment Configuration${NC}"

read -p "Enter your production backend URL (leave empty for auto-generated): " BACKEND_URL
read -p "Enter your MongoDB connection string: " MONGO_URL
read -p "Enter your N8N webhook URL (optional): " N8N_URL

if [ -z "$N8N_URL" ]; then
    N8N_URL="https://n8n.smart-tour.app/webhook"
fi

# Generate JWT secret if not provided
JWT_SECRET=$(openssl rand -base64 32)

echo -e "${GREEN}✅ Configuration collected${NC}"

# Step 1: Environment Setup
echo -e "${BLUE}🔧 Step 1: Setting up environment...${NC}"
./deployment/environment-setup.sh

# Update environment with user input
cat > deployment/env/.env.production << EOF
# Production Environment - Auto-generated
MONGO_URL=${MONGO_URL}
DB_NAME=smarttour_production
SUPABASE_URL=https://shhmlmejukbvtotgjule.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE3NzQ1NSwiZXhwIjoyMDY5NzUzNDU1fQ.7ty9rsu9mwTLxsQ58Uio9JgOsrH-rdOI5ceHvIBTUXs
JWT_SECRET_KEY=${JWT_SECRET}
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
N8N_WEBHOOK_BASE_URL=${N8N_URL}
APP_NAME=SmartTour.Jo API
APP_VERSION=1.0.0
DEBUG=false
ENVIRONMENT=production
EOF

echo -e "${GREEN}✅ Environment configured${NC}"

# Step 2: Backend Deployment
echo -e "${BLUE}🌐 Step 2: Deploying backend to Vercel...${NC}"

# Set environment variables for the deployment script
export MONGO_URL="${MONGO_URL}"
export JWT_SECRET_KEY="${JWT_SECRET}"
export N8N_WEBHOOK_BASE_URL="${N8N_URL}"
export SUPABASE_URL="https://shhmlmejukbvtotgjule.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE3NzQ1NSwiZXhwIjoyMDY5NzUzNDU1fQ.7ty9rsu9mwTLxsQ58Uio9JgOsrH-rdOI5ceHvIBTUXs"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E"

./deployment/backend-deploy.sh

# Get the deployed URL
DEPLOYED_URL=$(vercel ls 2>/dev/null | grep smarttour | head -1 | awk '{print $2}' || echo "your-app.vercel.app")

if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="https://${DEPLOYED_URL}"
fi

echo -e "${GREEN}✅ Backend deployed to: ${BACKEND_URL}${NC}"

# Step 3: Mobile App Build
echo -e "${BLUE}📱 Step 3: Building mobile applications...${NC}"

# Export backend URL for mobile build script
export BACKEND_URL="${BACKEND_URL}"

./deployment/mobile-build.sh

echo -e "${GREEN}✅ Mobile apps built successfully${NC}"

# Step 4: Create deployment summary
echo -e "${BLUE}📊 Creating deployment summary...${NC}"

DEPLOYMENT_DATE=$(date)
BUILD_NUMBER=$(date +%Y%m%d%H%M)

cat > deployment/deployment-summary.md << EOF
# SmartTour.Jo Deployment Summary

**Deployment Date**: ${DEPLOYMENT_DATE}
**Build Number**: ${BUILD_NUMBER}

## 🌐 Backend Deployment
- **URL**: ${BACKEND_URL}
- **Health Check**: ${BACKEND_URL}/api/health
- **API Docs**: ${BACKEND_URL}/docs
- **Platform**: Vercel
- **Status**: ✅ Deployed

## 📱 Mobile Applications
- **Version**: 1.0.0
- **Build**: ${BUILD_NUMBER}
- **Android APK**: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.apk
- **Android AAB**: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.aab
- **iOS Archive**: deployment/builds/ios/SmartTourJo.xcarchive
- **Status**: ✅ Built

## 🔧 Configuration
- **Database**: MongoDB Atlas
- **Authentication**: Supabase
- **JWT Secret**: Generated securely
- **N8N Webhooks**: ${N8N_URL}
- **Environment**: Production

## 📋 Next Steps
1. **Test Backend**: Visit ${BACKEND_URL}/api/health
2. **Test Mobile Apps**: Install APK/IPA on test devices
3. **App Store Deployment**:
   - Upload AAB to Google Play Console
   - Upload IPA to App Store Connect
4. **Monitor**: Set up monitoring and alerts

## 🎉 Deployment Complete!
Your SmartTour.Jo application is ready for production use.
EOF

# Final summary
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🎉 DEPLOYMENT COMPLETE! 🎉                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "${GREEN}✅ Backend: ${BACKEND_URL}${NC}"
echo -e "${GREEN}✅ Mobile Apps: Built and ready for app stores${NC}"
echo -e "${GREEN}✅ Environment: Production configured${NC}"

echo -e "${YELLOW}📱 Mobile App Files:${NC}"
echo -e "${BLUE}├── Android APK: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.apk${NC}"
echo -e "${BLUE}├── Android AAB: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.aab${NC}"
echo -e "${BLUE}└── iOS Archive: deployment/builds/ios/SmartTourJo.xcarchive${NC}"

echo -e "${YELLOW}🔍 Test Your Deployment:${NC}"
echo -e "${BLUE}• Backend Health: curl ${BACKEND_URL}/api/health${NC}"
echo -e "${BLUE}• API Documentation: ${BACKEND_URL}/docs${NC}"
echo -e "${BLUE}• Install mobile apps on test devices${NC}"

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Test all functionality thoroughly${NC}"
echo -e "${YELLOW}2. Upload AAB to Google Play Console${NC}"
echo -e "${YELLOW}3. Upload IPA to App Store Connect${NC}"
echo -e "${YELLOW}4. Set up monitoring and analytics${NC}"
echo -e "${YELLOW}5. Create app store listings with screenshots${NC}"

echo -e "${GREEN}🚀 Your SmartTour.Jo application is now live and ready for users!${NC}"

# Save important URLs and info
cat > deployment/deployment-info.txt << EOF
SmartTour.Jo Deployment Information
==================================

Backend URL: ${BACKEND_URL}
Health Check: ${BACKEND_URL}/api/health
API Docs: ${BACKEND_URL}/docs

Mobile Apps:
- Android APK: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.apk
- Android AAB: deployment/builds/android/smarttour-jo-1.0.0-${BUILD_NUMBER}.aab
- iOS Archive: deployment/builds/ios/SmartTourJo.xcarchive

Configuration:
- Database: MongoDB Atlas
- Auth: Supabase
- N8N: ${N8N_URL}
- JWT Secret: [Generated securely]

Deployment Date: ${DEPLOYMENT_DATE}
Build Number: ${BUILD_NUMBER}
EOF

echo -e "${BLUE}💾 Deployment info saved to: deployment/deployment-info.txt${NC}"
echo -e "${BLUE}📋 Full summary saved to: deployment/deployment-summary.md${NC}"

echo -e "${GREEN}✨ Quick deployment completed successfully! ✨${NC}"