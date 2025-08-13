// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://b460b936-2f95-45df-a335-9461bc0b1fb5.preview.emergentagent.com',
  API_PREFIX: '/api',
  TIMEOUT: 10000,
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
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.smarttour.jo',
  SUPPORTED_LANGUAGES: ['en', 'ar'],
  DEFAULT_LANGUAGE: 'en',
  RTL_LANGUAGES: ['ar'],
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
  AR_VIEW: false, // Will be enabled later
  VOICE_ASSISTANT: false, // Will be enabled later
};

// Cache Configuration
export const CACHE_CONFIG = {
  MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  IMAGE_CACHE_SIZE: 100, // Number of images to cache
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
};

// Jordan Tourist Destinations
export const JORDAN_DESTINATIONS = [
  {
    id: 'petra',
    name: 'Petra',
    name_ar: 'البتراء',
    coordinates: {latitude: 30.3285, longitude: 35.4444},
    category: 'historical',
  },
  {
    id: 'wadi-rum',
    name: 'Wadi Rum',
    name_ar: 'وادي رم',
    coordinates: {latitude: 29.5324, longitude: 35.4206},
    category: 'nature',
  },
  {
    id: 'dead-sea',
    name: 'Dead Sea',
    name_ar: 'البحر الميت',
    coordinates: {latitude: 31.5590, longitude: 35.4732},
    category: 'nature',
  },
  {
    id: 'jerash',
    name: 'Jerash',
    name_ar: 'جرش',
    coordinates: {latitude: 32.2744, longitude: 35.8906},
    category: 'historical',
  },
  {
    id: 'amman-citadel',
    name: 'Amman Citadel',
    name_ar: 'جبل القلعة',
    coordinates: {latitude: 31.9539, longitude: 35.9345},
    category: 'historical',
  },
  {
    id: 'aqaba',
    name: 'Aqaba',
    name_ar: 'العقبة',
    coordinates: {latitude: 29.5267, longitude: 35.0067},
    category: 'coastal',
  },
  {
    id: 'dana-reserve',
    name: 'Dana Biosphere Reserve',
    name_ar: 'محمية ضانا الطبيعية',
    coordinates: {latitude: 30.6750, longitude: 35.5850},
    category: 'nature',
  },
  {
    id: 'ajloun-castle',
    name: 'Ajloun Castle',
    name_ar: 'قلعة عجلون',
    coordinates: {latitude: 32.3328, longitude: 35.7517},
    category: 'historical',
  },
  {
    id: 'karak-castle',
    name: 'Karak Castle',
    name_ar: 'قلعة الكرك',
    coordinates: {latitude: 31.1848, longitude: 35.7047},
    category: 'historical',
  },
  {
    id: 'rainbow-street',
    name: 'Rainbow Street',
    name_ar: 'شارع الرينبو',
    coordinates: {latitude: 31.9515, longitude: 35.9239},
    category: 'cultural',
  },
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