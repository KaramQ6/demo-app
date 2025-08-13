#!/bin/bash

# SmartTour.Jo Production Environment Setup Script
# This script helps configure all necessary environment variables for production deployment

set -e

echo "🔧 SmartTour.Jo Production Environment Setup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to generate secure random string
generate_secret() {
    openssl rand -base64 32
}

# Create environment files directory
mkdir -p deployment/env

echo -e "${BLUE}📋 Setting up production environment variables...${NC}"

# Production Backend Environment Variables
echo -e "${YELLOW}🔑 Configuring backend environment variables...${NC}"

cat > deployment/env/.env.production << EOF
# ===============================================
# SmartTour.Jo Backend Production Environment
# ===============================================

# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/smarttour_production?retryWrites=true&w=majority
DB_NAME=smarttour_production

# Supabase Configuration
SUPABASE_URL=https://shhmlmejukbvtotgjule.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE3NzQ1NSwiZXhwIjoyMDY5NzUzNDU1fQ.7ty9rsu9mwTLxsQ58Uio9JgOsrH-rdOI5ceHvIBTUXs

# JWT Configuration
JWT_SECRET_KEY=$(generate_secret)
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# External API Configuration
N8N_WEBHOOK_BASE_URL=https://n8n.smart-tour.app/webhook

# Application Configuration
APP_NAME=SmartTour.Jo API
APP_VERSION=1.0.0
DEBUG=false
ENVIRONMENT=production

# CORS Configuration
ALLOWED_ORIGINS=https://smarttour-jo.vercel.app,https://your-domain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_BURST=200

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json

# Security Headers
ENABLE_SECURITY_HEADERS=true
ENABLE_CSRF_PROTECTION=true

# Cache Configuration
REDIS_URL=redis://localhost:6379/0
CACHE_TTL=3600

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf

# Email Configuration (if needed)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring & Analytics
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
ANALYTICS_API_KEY=your-analytics-key

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_FREQUENCY=daily
BACKUP_RETENTION_DAYS=30
EOF

# Mobile App Environment Configuration
echo -e "${YELLOW}📱 Configuring mobile app environment...${NC}"

cat > deployment/env/mobile-config.json << EOF
{
  "production": {
    "api": {
      "baseUrl": "https://smarttour-jo.vercel.app",
      "timeout": 30000,
      "retryAttempts": 3
    },
    "supabase": {
      "url": "https://shhmlmejukbvtotgjule.supabase.co",
      "anonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E"
    },
    "features": {
      "offlineMode": true,
      "pushNotifications": true,
      "biometricAuth": true,
      "darkMode": true,
      "debugMode": false
    },
    "analytics": {
      "enabled": true,
      "trackScreenViews": true,
      "trackUserActions": true
    },
    "cache": {
      "maxAge": 86400000,
      "maxSize": 52428800,
      "imageCacheSize": 100
    }
  },
  "staging": {
    "api": {
      "baseUrl": "https://smarttour-jo-staging.vercel.app",
      "timeout": 30000,
      "retryAttempts": 3
    },
    "features": {
      "debugMode": true
    }
  }
}
EOF

# Vercel Environment Variables Setup
echo -e "${YELLOW}☁️ Creating Vercel environment setup commands...${NC}"

cat > deployment/env/vercel-env-setup.sh << 'EOF'
#!/bin/bash

# Vercel Environment Variables Setup
echo "Setting up Vercel environment variables..."

# Required environment variables for Vercel
vercel env add MONGO_URL production
vercel env add SUPABASE_URL production  
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add JWT_SECRET_KEY production
vercel env add N8N_WEBHOOK_BASE_URL production
vercel env add ENVIRONMENT production
vercel env add DEBUG production

# Optional environment variables
vercel env add SENTRY_DSN production
vercel env add RATE_LIMIT_PER_MINUTE production
vercel env add MAX_FILE_SIZE production

echo "✅ Vercel environment variables configured"
echo "Run 'vercel env ls' to verify all variables are set"
EOF

chmod +x deployment/env/vercel-env-setup.sh

# Security Configuration
echo -e "${YELLOW}🔐 Creating security configuration...${NC}"

cat > deployment/env/security-headers.json << EOF
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://shhmlmejukbvtotgjule.supabase.co https://n8n.smart-tour.app;"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
EOF

# Database Migration Script
echo -e "${YELLOW}🗄️ Creating database setup script...${NC}"

cat > deployment/env/database-setup.sql << EOF
-- SmartTour.Jo Production Database Setup
-- Run this script to set up the production MongoDB collections and indexes

-- Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "created_at": 1 })

-- Profiles collection indexes
db.profiles.createIndex({ "user_id": 1 }, { unique: true })
db.profiles.createIndex({ "updated_at": 1 })

-- Itineraries collection indexes
db.itineraries.createIndex({ "user_id": 1 })
db.itineraries.createIndex({ "destination_id": 1 })
db.itineraries.createIndex({ "created_at": 1 })
db.itineraries.createIndex({ "user_id": 1, "status": 1 })

-- Status checks collection indexes
db.status_checks.createIndex({ "client_name": 1 })
db.status_checks.createIndex({ "timestamp": 1 })

-- Weather cache collection (TTL index for automatic cleanup)
db.weather_cache.createIndex({ "cached_at": 1 }, { expireAfterSeconds: 3600 })
db.weather_cache.createIndex({ "lat": 1, "lon": 1 })

-- Chat messages collection indexes
db.chat_messages.createIndex({ "user_id": 1 })
db.chat_messages.createIndex({ "created_at": 1 })
db.chat_messages.createIndex({ "session_id": 1 })

-- Sync queue collection indexes
db.sync_queue.createIndex({ "user_id": 1 })
db.sync_queue.createIndex({ "synced": 1 })
db.sync_queue.createIndex({ "created_at": 1 })

-- Activity logs collection indexes
db.activity_logs.createIndex({ "user_id": 1 })
db.activity_logs.createIndex({ "action": 1 })
db.activity_logs.createIndex({ "timestamp": 1 })
EOF

# Monitoring Setup
echo -e "${YELLOW}📊 Creating monitoring configuration...${NC}"

cat > deployment/env/monitoring-setup.json << EOF
{
  "monitoring": {
    "healthcheck": {
      "endpoints": [
        "/api/health",
        "/api/status"
      ],
      "interval": 60,
      "timeout": 10
    },
    "performance": {
      "responseTime": {
        "warning": 500,
        "critical": 1000
      },
      "errorRate": {
        "warning": 0.01,
        "critical": 0.05
      }
    },
    "logging": {
      "level": "info",
      "format": "json",
      "destinations": [
        "console",
        "file",
        "sentry"
      ]
    }
  },
  "alerts": {
    "email": "admin@smarttour.jo",
    "slack": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
    "conditions": [
      "response_time > 1000ms",
      "error_rate > 5%",
      "uptime < 99%"
    ]
  }
}
EOF

echo -e "${GREEN}✅ Environment setup completed!${NC}"

echo -e "${BLUE}📋 Created configuration files:${NC}"
echo -e "${BLUE}├── deployment/env/.env.production${NC}"
echo -e "${BLUE}├── deployment/env/mobile-config.json${NC}"
echo -e "${BLUE}├── deployment/env/vercel-env-setup.sh${NC}"
echo -e "${BLUE}├── deployment/env/security-headers.json${NC}"
echo -e "${BLUE}├── deployment/env/database-setup.sql${NC}"
echo -e "${BLUE}└── deployment/env/monitoring-setup.json${NC}"

echo -e "${YELLOW}🔧 Next steps:${NC}"
echo -e "${YELLOW}1. Review and update the .env.production file with your actual values${NC}"
echo -e "${YELLOW}2. Set up your MongoDB production database${NC}"
echo -e "${YELLOW}3. Configure Vercel environment variables: cd deployment/env && ./vercel-env-setup.sh${NC}"
echo -e "${YELLOW}4. Update mobile-config.json with your production backend URL${NC}"
echo -e "${YELLOW}5. Set up monitoring and alerting systems${NC}"

echo -e "${BLUE}🔐 Security reminders:${NC}"
echo -e "${BLUE}• Store all secrets securely and never commit them to version control${NC}"
echo -e "${BLUE}• Use strong, unique passwords for all services${NC}"
echo -e "${BLUE}• Enable 2FA on all critical accounts${NC}"
echo -e "${BLUE}• Regularly rotate API keys and secrets${NC}"
echo -e "${BLUE}• Monitor access logs and set up alerting${NC}"

echo -e "${GREEN}🎉 Environment setup complete!${NC}"