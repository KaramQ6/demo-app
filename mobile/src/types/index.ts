// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  interests: string[];
  budget: 'low' | 'medium' | 'high';
  travelsWith: 'Solo' | 'Couple' | 'Family' | 'Friends';
  language: 'en' | 'ar';
  notifications: boolean;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name?: string;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  latitude: number;
  longitude: number;
  category?: string;
  image_url?: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

// Itinerary Types
export interface ItineraryItem {
  id: string;
  user_id: string;
  destination_id: string;
  destination_name: string;
  destination_type?: string;
  destination_icon?: string;
  notes?: string;
  status: 'planned' | 'visited' | 'cancelled';
  visit_date?: string;
  priority: number;
  added_at: string;
}

export interface CreateItineraryItem {
  destination_id: string;
  destination_name: string;
  destination_type?: string;
  destination_icon?: string;
  notes?: string;
  status?: 'planned' | 'visited' | 'cancelled';
  visit_date?: string;
  priority?: number;
}

// Weather Types
export interface WeatherData {
  temperature: number;
  cityName: string;
  description: string;
  humidity?: number;
  pressure?: number;
  wind_speed?: number;
  latitude?: number;
  longitude?: number;
  source: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
  status?: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Destinations: undefined;
  DestinationDetail: {destinationId: string};
  Profile: undefined;
  Itinerary: undefined;
  Weather: undefined;
  Chat: undefined;
  Settings: undefined;
  OfflineData: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Destinations: undefined;
  Itinerary: undefined;
  Profile: undefined;
  More: undefined;
};

// Offline Types
export interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingActions: number;
}

// Theme Types
export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {fontSize: number; fontWeight: string};
    h2: {fontSize: number; fontWeight: string};
    h3: {fontSize: number; fontWeight: string};
    body: {fontSize: number; fontWeight: string};
    caption: {fontSize: number; fontWeight: string};
  };
  borderRadius: number;
}

// Language Types
export interface LanguageResource {
  [key: string]: string | LanguageResource;
}

export interface I18nConfig {
  lng: string;
  fallbackLng: string;
  resources: {
    en: {translation: LanguageResource};
    ar: {translation: LanguageResource};
  };
}