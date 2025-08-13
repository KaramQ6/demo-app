#!/bin/bash

# SmartTour.Jo Mobile App Production Build Script
# Builds both iOS and Android versions for app store deployment

set -e  # Exit on any error

echo "📱 Starting SmartTour.Jo Mobile App Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="SmartTour.Jo"
BUNDLE_ID="com.smarttour.jo"
APP_VERSION="1.0.0"
BUILD_NUMBER=$(date +%Y%m%d%H%M)

# Check if we're in the mobile directory
if [ ! -f "mobile/package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

cd mobile

# Check dependencies
echo -e "${BLUE}🔍 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    yarn install
fi

# Update production API URL
echo -e "${BLUE}🔧 Configuring production settings...${NC}"

# Prompt for production backend URL
read -p "Enter your production backend URL (e.g., https://smarttour-jo.vercel.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ Backend URL is required${NC}"
    exit 1
fi

# Update API configuration for production
cat > src/config/constants.ts << EOF
// Production API Configuration
export const API_CONFIG = {
  BASE_URL: '${BACKEND_URL}',
  API_PREFIX: '/api',
  TIMEOUT: 30000, // Increased timeout for production
  RETRY_ATTEMPTS: 3,
};

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: 'https://shhmlmejukbvtotgjule.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaG1sbWVqdWtidnRvdGdqdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzc0NTUsImV4cCI6MjA2OTc1MzQ1NX0.qvcmpysmFjPwtQRl0ueuCtcx6SckBbS73wzDqiBsN8E',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  USER_PREFERENCES: 'userPreferences',
  LANGUAGE: 'language',
  OFFLINE_ACTIONS: 'offlineActions',
  CACHED_DATA: 'cachedData',
  LAST_SYNC: 'lastSync',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'SmartTour.Jo',
  VERSION: '${APP_VERSION}',
  BUILD_NUMBER: '${BUILD_NUMBER}',
  BUNDLE_ID: '${BUNDLE_ID}',
  SUPPORTED_LANGUAGES: ['en', 'ar'],
  DEFAULT_LANGUAGE: 'en',
  RTL_LANGUAGES: ['ar'],
  ENVIRONMENT: 'production',
};

// Map Configuration
export const MAP_CONFIG = {
  JORDAN_COORDINATES: {
    latitude: 31.9539,
    longitude: 35.9106,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  },
  DEFAULT_ZOOM: 10,
  MARKER_CLUSTER_RADIUS: 50,
};

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: true,
  BIOMETRIC_AUTH: true,
  DARK_MODE: true,
  AR_VIEW: false,
  VOICE_ASSISTANT: false,
  DEBUG_MODE: false, // Disabled in production
};

// Cache Configuration
export const CACHE_CONFIG = {
  MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  IMAGE_CACHE_SIZE: 100,
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
};

// Jordan Tourist Destinations (same as before)
export const JORDAN_DESTINATIONS = [
  {
    id: 'petra',
    name: 'Petra',
    name_ar: 'البتراء',
    description: 'Ancient city carved into red sandstone cliffs',
    description_ar: 'مدينة أثرية محفورة في الصخر الرملي الأحمر',
    latitude: 30.3285,
    longitude: 35.4444,
    category: 'historical',
    image_url: 'https://example.com/petra.jpg',
    rating: 4.9,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  // ... other destinations
];

// Error Messages
export const ERRORS = {
  NETWORK_ERROR: 'Network connection error',
  AUTHENTICATION_ERROR: 'Authentication failed',
  VALIDATION_ERROR: 'Please check your input',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  LOCATION_PERMISSION_DENIED: 'Location permission denied',
  CAMERA_PERMISSION_DENIED: 'Camera permission denied',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  REGISTRATION_SUCCESS: 'Account created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ITINERARY_ADDED: 'Added to itinerary',
  ITINERARY_REMOVED: 'Removed from itinerary',
  DATA_SYNCED: 'Data synchronized successfully',
};
EOF

echo -e "${GREEN}✅ Production configuration updated${NC}"

# Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf android/app/build
rm -rf ios/build
yarn cache clean

# Android Build
echo -e "${GREEN}🤖 Building Android production APK/AAB...${NC}"

# Update Android version
if [ -f "android/app/build.gradle" ]; then
    # Update version name and code
    sed -i.bak "s/versionName \".*\"/versionName \"${APP_VERSION}\"/" android/app/build.gradle
    sed -i.bak "s/versionCode .*/versionCode ${BUILD_NUMBER}/" android/app/build.gradle
    
    # Build Android
    cd android
    echo -e "${BLUE}📦 Building Android Release APK...${NC}"
    ./gradlew assembleRelease
    
    echo -e "${BLUE}📦 Building Android App Bundle (AAB)...${NC}"
    ./gradlew bundleRelease
    
    cd ..
    
    # Copy build artifacts
    mkdir -p ../deployment/builds/android
    cp android/app/build/outputs/apk/release/app-release.apk ../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.apk
    cp android/app/build/outputs/bundle/release/app-release.aab ../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.aab
    
    echo -e "${GREEN}✅ Android build completed${NC}"
    echo -e "${BLUE}📦 APK: deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.apk${NC}"
    echo -e "${BLUE}📦 AAB: deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.aab${NC}"
else
    echo -e "${YELLOW}⚠️ Android build files not found, skipping Android build${NC}"
fi

# iOS Build (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}🍎 Building iOS production archive...${NC}"
    
    # Update iOS version
    if [ -f "ios/SmartTourJo/Info.plist" ]; then
        # Install dependencies
        cd ios
        pod install --repo-update
        cd ..
        
        # Build iOS
        echo -e "${BLUE}📦 Building iOS Release Archive...${NC}"
        cd ios
        
        # Build for archive
        xcodebuild -workspace SmartTourJo.xcworkspace \
                   -scheme SmartTourJo \
                   -configuration Release \
                   -destination generic/platform=iOS \
                   -archivePath "../deployment/builds/ios/SmartTourJo.xcarchive" \
                   archive
        
        # Export IPA
        xcodebuild -exportArchive \
                   -archivePath "../deployment/builds/ios/SmartTourJo.xcarchive" \
                   -exportPath "../deployment/builds/ios/" \
                   -exportOptionsPlist ../deployment/ios-export-options.plist
        
        cd ..
        
        echo -e "${GREEN}✅ iOS build completed${NC}"
        echo -e "${BLUE}📦 Archive: deployment/builds/ios/SmartTourJo.xcarchive${NC}"
        echo -e "${BLUE}📦 IPA: deployment/builds/ios/SmartTourJo.ipa${NC}"
    else
        echo -e "${YELLOW}⚠️ iOS build files not found, skipping iOS build${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ iOS builds are only supported on macOS${NC}"
fi

# Create deployment summary
echo -e "${BLUE}📋 Creating deployment summary...${NC}"
cat > ../deployment/build-summary.txt << EOF
SmartTour.Jo Mobile App Build Summary
=====================================

Build Date: $(date)
App Version: ${APP_VERSION}
Build Number: ${BUILD_NUMBER}
Backend URL: ${BACKEND_URL}

Android Builds:
- APK: smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.apk
- AAB: smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.aab

iOS Builds:
- Archive: SmartTourJo.xcarchive
- IPA: SmartTourJo.ipa

Deployment Instructions:
1. Test APK/IPA on physical devices
2. Upload AAB to Google Play Console
3. Upload IPA to App Store Connect via Xcode or Transporter
4. Submit for review

Notes:
- Ensure all certificates and provisioning profiles are valid
- Test thoroughly before publishing
- Monitor crash reports and user feedback
EOF

echo -e "${GREEN}🎉 Mobile app build completed!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "${YELLOW}1. Test the built APK/IPA on physical devices${NC}"
echo -e "${YELLOW}2. Upload AAB to Google Play Console${NC}"
echo -e "${YELLOW}3. Upload IPA to App Store Connect${NC}"
echo -e "${YELLOW}4. Submit for app store review${NC}"

# Show build sizes
if [ -f "../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.apk" ]; then
    APK_SIZE=$(du -h "../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.apk" | cut -f1)
    echo -e "${BLUE}📊 Android APK size: ${APK_SIZE}${NC}"
fi

if [ -f "../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.aab" ]; then
    AAB_SIZE=$(du -h "../deployment/builds/android/smarttour-jo-${APP_VERSION}-${BUILD_NUMBER}.aab" | cut -f1)
    echo -e "${BLUE}📊 Android AAB size: ${AAB_SIZE}${NC}"
fi

echo -e "${GREEN}✨ Build script completed!${NC}"

cd ..