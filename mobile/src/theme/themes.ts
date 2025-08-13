import {DefaultTheme, DarkTheme, Theme as NavigationTheme} from '@react-navigation/native';
import {MD3LightTheme, MD3DarkTheme, MD3Theme} from 'react-native-paper';
import {AppTheme} from '@/types';

// Create a combined theme type that merges Navigation and Paper themes
type CombinedTheme = NavigationTheme & MD3Theme & {
  colors: NavigationTheme['colors'] & MD3Theme['colors'] & {
    // Custom colors for our app
    accent: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    gradientStart: string;
    gradientEnd: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    h1: {fontSize: number; fontWeight: string; lineHeight: number};
    h2: {fontSize: number; fontWeight: string; lineHeight: number};
    h3: {fontSize: number; fontWeight: string; lineHeight: number};
    h4: {fontSize: number; fontWeight: string; lineHeight: number};
    body: {fontSize: number; fontWeight: string; lineHeight: number};
    bodySmall: {fontSize: number; fontWeight: string; lineHeight: number};
    caption: {fontSize: number; fontWeight: string; lineHeight: number};
    button: {fontSize: number; fontWeight: string; lineHeight: number};
  };
  borderRadius: number;
  elevation: {
    small: number;
    medium: number;
    large: number;
  };
};

// Color Palette
const colors = {
  // Primary Colors (Purple/Blue gradient like SmartTour.Jo web)
  primary: '#8B5CF6', // Purple-500
  primaryDark: '#7C3AED', // Purple-600
  primaryLight: '#A78BFA', // Purple-400
  
  // Secondary Colors (Teal/Cyan)
  secondary: '#06B6D4', // Cyan-500
  secondaryDark: '#0891B2', // Cyan-600
  secondaryLight: '#22D3EE', // Cyan-400
  
  // Accent Colors
  accent: '#F59E0B', // Amber-500
  accentDark: '#D97706', // Amber-600
  accentLight: '#FBBF24', // Amber-400
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status Colors
  success: '#10B981', // Emerald-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  info: '#3B82F6', // Blue-500
  
  // Gradient Colors
  gradientStart: '#8B5CF6',
  gradientEnd: '#06B6D4',
};

// Spacing System
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography System
const typography = {
  h1: {fontSize: 32, fontWeight: '700' as const, lineHeight: 40},
  h2: {fontSize: 24, fontWeight: '600' as const, lineHeight: 32},
  h3: {fontSize: 20, fontWeight: '600' as const, lineHeight: 28},
  h4: {fontSize: 18, fontWeight: '500' as const, lineHeight: 24},
  body: {fontSize: 16, fontWeight: '400' as const, lineHeight: 24},
  bodySmall: {fontSize: 14, fontWeight: '400' as const, lineHeight: 20},
  caption: {fontSize: 12, fontWeight: '400' as const, lineHeight: 16},
  button: {fontSize: 16, fontWeight: '500' as const, lineHeight: 24},
};

// Light Theme
export const lightTheme: AppTheme = {
  ...DefaultTheme,
  ...MD3LightTheme,
  dark: false,
  fonts: MD3LightTheme.fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.white,
    surface: colors.gray50,
    text: colors.gray900,
    textSecondary: colors.gray600,
    border: colors.gray200,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    
    // React Navigation theme compatibility
    card: colors.gray50,
    notification: colors.primary,
    
    // Custom colors for our app
    primaryContainer: colors.primaryLight,
    secondaryContainer: colors.secondaryLight,
    surfaceVariant: colors.gray100,
    onSurface: colors.gray900,
    onSurfaceVariant: colors.gray600,
    outline: colors.gray300,
    shadow: colors.black,
    
    // Additional React Native Paper theme colors
    onBackground: colors.gray900,
    tertiary: colors.accent,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onTertiary: colors.white,
    errorContainer: colors.error + '20',
    onError: colors.white,
    onErrorContainer: colors.error,
    inverseSurface: colors.gray800,
    inverseOnSurface: colors.white,
    inversePrimary: colors.primaryLight,
    scrim: colors.black + '80',
    elevation: {
      level0: colors.white,
      level1: colors.gray50,
      level2: colors.gray100,
      level3: colors.gray200,
      level4: colors.gray300,
      level5: colors.gray400,
    },
    
    // Gradient colors
    gradientStart: colors.gradientStart,
    gradientEnd: colors.gradientEnd,
  },
  spacing,
  typography,
  borderRadius: 12,
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  },
};

// Dark Theme
export const darkTheme: AppTheme = {
  ...DarkTheme,
  ...MD3DarkTheme,
  dark: true,
  fonts: MD3DarkTheme.fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    secondary: colors.secondaryLight,
    accent: colors.accentLight,
    background: colors.gray900,
    surface: colors.gray800,
    text: colors.white,
    textSecondary: colors.gray300,
    border: colors.gray700,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    
    // React Navigation theme compatibility
    card: colors.gray800,
    notification: colors.primaryLight,
    
    // Custom colors for dark mode
    primaryContainer: colors.primaryDark,
    secondaryContainer: colors.secondaryDark,
    surfaceVariant: colors.gray700,
    onSurface: colors.white,
    onSurfaceVariant: colors.gray300,
    outline: colors.gray600,
    shadow: colors.black,
    
    // Additional React Native Paper theme colors
    onBackground: colors.white,
    tertiary: colors.accentLight,
    onPrimary: colors.black,
    onSecondary: colors.black,
    onTertiary: colors.black,
    errorContainer: colors.error + '20',
    onError: colors.white,
    onErrorContainer: colors.error,
    inverseSurface: colors.gray200,
    inverseOnSurface: colors.gray900,
    inversePrimary: colors.primaryDark,
    scrim: colors.black + '80',
    elevation: {
      level0: colors.gray900,
      level1: colors.gray800,
      level2: colors.gray700,
      level3: colors.gray600,
      level4: colors.gray500,
      level5: colors.gray400,
    },
    
    // Gradient colors
    gradientStart: colors.gradientStart,
    gradientEnd: colors.gradientEnd,
  },
  spacing,
  typography,
  borderRadius: 12,
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  },
};

// Additional utility functions
export const getThemeColor = (theme: AppTheme, colorName: keyof AppTheme['colors']) => {
  return theme.colors[colorName];
};

export const getShadowStyle = (elevation: number) => {
  return {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 1.5,
    elevation: elevation,
  };
};

export const getGradientColors = (theme: AppTheme) => {
  return [theme.colors.gradientStart, theme.colors.gradientEnd];
};