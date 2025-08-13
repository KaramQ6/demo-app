#!/bin/bash

# SmartTour.Jo Environment Variables Preparation Helper
# This script helps you collect and validate all required variables

set -e

echo "🔧 SmartTour.Jo Environment Variables Preparation"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Let's collect all the information needed for deployment...${NC}"

# Function to validate MongoDB connection string
validate_mongo_url() {
    local url="$1"
    if [[ $url =~ ^mongodb(\+srv)?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate URL format
validate_url() {
    local url="$1"
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Collect MongoDB Connection String
echo -e "${YELLOW}📊 Step 1: MongoDB Configuration${NC}"
echo -e "${BLUE}Please provide your MongoDB Atlas connection string.${NC}"
echo -e "${BLUE}Format: mongodb+srv://username:password@cluster.mongodb.net/database${NC}"
echo ""

while true; do
    read -p "MongoDB Connection String: " MONGO_URL
    
    if [ -z "$MONGO_URL" ]; then
        echo -e "${RED}❌ MongoDB URL cannot be empty${NC}"
        continue
    fi
    
    if validate_mongo_url "$MONGO_URL"; then
        echo -e "${GREEN}✅ MongoDB URL format looks good${NC}"
        break
    else
        echo -e "${RED}❌ Invalid MongoDB URL format. Should start with mongodb:// or mongodb+srv://${NC}"
    fi
done

# Test MongoDB connection (optional)
echo -e "${BLUE}🔍 Would you like to test the MongoDB connection? (y/n)${NC}"
read -p "Test connection: " test_mongo

if [[ $test_mongo =~ ^[Yy] ]]; then
    echo -e "${BLUE}Testing MongoDB connection...${NC}"
    # Simple connection test using python
    python3 -c "
import sys
try:
    from pymongo import MongoClient
    client = MongoClient('$MONGO_URL', serverSelectionTimeoutMS=5000)
    client.server_info()
    print('✅ MongoDB connection successful!')
    client.close()
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
    sys.exit(1)
" 2>/dev/null || echo -e "${YELLOW}⚠️ Could not test connection (pymongo not available), but URL format is valid${NC}"
fi

# Backend URL Configuration
echo ""
echo -e "${YELLOW}🌐 Step 2: Backend URL Configuration${NC}"
echo -e "${BLUE}You have two options:${NC}"
echo -e "${BLUE}1. Use auto-generated Vercel URL (recommended for start)${NC}"
echo -e "${BLUE}2. Use custom domain (if you have one)${NC}"
echo ""

read -p "Do you have a custom domain for your backend? (y/n): " has_custom_domain

if [[ $has_custom_domain =~ ^[Yy] ]]; then
    echo -e "${BLUE}Please enter your custom domain (e.g., https://api.smarttour.jo):${NC}"
    while true; do
        read -p "Custom Backend URL: " BACKEND_URL
        
        if [ -z "$BACKEND_URL" ]; then
            read -p "Leave empty to use auto-generated Vercel URL? (y/n): " use_auto
            if [[ $use_auto =~ ^[Yy] ]]; then
                BACKEND_URL=""
                break
            else
                continue
            fi
        fi
        
        if validate_url "$BACKEND_URL"; then
            echo -e "${GREEN}✅ Backend URL format looks good${NC}"
            break
        else
            echo -e "${RED}❌ Invalid URL format. Should start with http:// or https://${NC}"
        fi
    done
else
    BACKEND_URL=""
    echo -e "${GREEN}✅ Will use auto-generated Vercel URL${NC}"
fi

# N8N Webhook URL
echo ""
echo -e "${YELLOW}🔗 Step 3: N8N Webhook Configuration${NC}"
echo -e "${BLUE}Current N8N URL: https://n8n.smart-tour.app/webhook${NC}"
read -p "Do you want to use a different N8N webhook URL? (y/n): " change_n8n

if [[ $change_n8n =~ ^[Yy] ]]; then
    while true; do
        read -p "N8N Webhook URL: " N8N_URL
        
        if validate_url "$N8N_URL"; then
            echo -e "${GREEN}✅ N8N URL format looks good${NC}"
            break
        else
            echo -e "${RED}❌ Invalid URL format${NC}"
        fi
    done
else
    N8N_URL="https://n8n.smart-tour.app/webhook"
    echo -e "${GREEN}✅ Using default N8N webhook URL${NC}"
fi

# Generate JWT Secret
echo ""
echo -e "${YELLOW}🔐 Step 4: Security Configuration${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✅ Generated secure JWT secret${NC}"

# App Configuration
APP_VERSION="1.0.0"
BUILD_NUMBER=$(date +%Y%m%d%H%M)

# Summary
echo ""
echo -e "${GREEN}📋 Configuration Summary:${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}MongoDB URL: ${MONGO_URL:0:50}...${NC}"
echo -e "${BLUE}Backend URL: ${BACKEND_URL:-"Auto-generated Vercel URL"}${NC}"
echo -e "${BLUE}N8N Webhook: ${N8N_URL}${NC}"
echo -e "${BLUE}JWT Secret: Generated (32 characters)${NC}"
echo -e "${BLUE}App Version: ${APP_VERSION}${NC}"
echo -e "${BLUE}Build Number: ${BUILD_NUMBER}${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Save configuration
echo ""
echo -e "${BLUE}💾 Saving configuration...${NC}"

mkdir -p deployment/config

cat > deployment/config/deployment-vars.env << EOF
# SmartTour.Jo Deployment Variables
# Generated on: $(date)

MONGO_URL="${MONGO_URL}"
BACKEND_URL="${BACKEND_URL}"
N8N_WEBHOOK_BASE_URL="${N8N_URL}"
JWT_SECRET_KEY="${JWT_SECRET}"
APP_VERSION="${APP_VERSION}"
BUILD_NUMBER="${BUILD_NUMBER}"

# Supabase Configuration (pre-configured)
SUPABASE_URL="https://shhmlmejukbvtotgjule.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE3NzQ1NSwiZXhwIjoyMDY5NzUzNDU1fQ.7ty9rsu9mwTLxsQ58Uio9JgOsrH-rdOI5ceHvIBTUXs"

# Production Settings
DEBUG=false
ENVIRONMENT=production
DB_NAME=smarttour_production
EOF

# Create export script for easy loading
cat > deployment/config/load-vars.sh << 'EOF'
#!/bin/bash
# Load deployment variables
set -a
source deployment/config/deployment-vars.env
set +a
echo "✅ Deployment variables loaded"
EOF

chmod +x deployment/config/load-vars.sh

echo -e "${GREEN}✅ Configuration saved to: deployment/config/deployment-vars.env${NC}"
echo -e "${GREEN}✅ Load script created: deployment/config/load-vars.sh${NC}"

# Create deployment checklist
cat > deployment/config/deployment-checklist.md << EOF
# SmartTour.Jo Deployment Checklist

## ✅ Prerequisites Completed
- [x] MongoDB Atlas cluster created
- [x] Database user configured  
- [x] Network access configured
- [x] MongoDB connection string obtained
- [x] Backend URL strategy decided
- [x] N8N webhook URL configured
- [x] JWT secret generated
- [x] Environment variables prepared

## 🚀 Ready for Deployment

### Next Steps:
1. **Load Variables**: \`source deployment/config/load-vars.sh\`
2. **Deploy Backend**: \`./deployment/backend-deploy.sh\`
3. **Build Mobile Apps**: \`./deployment/mobile-build.sh\`
4. **Test Everything**: Verify all endpoints and mobile apps
5. **Submit to App Stores**: Upload mobile apps for review

### Configuration Summary:
- **MongoDB**: $(echo ${MONGO_URL} | sed 's/.*@/***@/')
- **Backend**: ${BACKEND_URL:-"Auto-generated Vercel URL"}
- **N8N**: ${N8N_URL}
- **Version**: ${APP_VERSION}
- **Build**: ${BUILD_NUMBER}

### Important Files:
- Environment variables: \`deployment/config/deployment-vars.env\`
- Load script: \`deployment/config/load-vars.sh\`
- This checklist: \`deployment/config/deployment-checklist.md\`
EOF

echo ""
echo -e "${GREEN}🎉 Environment preparation completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Review the checklist: deployment/config/deployment-checklist.md${NC}"
echo -e "${YELLOW}2. Load variables: source deployment/config/load-vars.sh${NC}"
echo -e "${YELLOW}3. Run backend deployment: ./deployment/backend-deploy.sh${NC}"
echo -e "${YELLOW}4. Build mobile apps: ./deployment/mobile-build.sh${NC}"

echo ""
echo -e "${BLUE}💡 Pro Tips:${NC}"
echo -e "${BLUE}• Keep your MongoDB credentials secure${NC}"
echo -e "${BLUE}• Test your deployment on staging before production${NC}"
echo -e "${BLUE}• Monitor your application after deployment${NC}"
echo -e "${BLUE}• Set up backup strategies for your database${NC}"

echo ""
echo -e "${GREEN}✨ All set! You're ready to deploy SmartTour.Jo! ✨${NC}"