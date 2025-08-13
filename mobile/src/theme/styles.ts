import {StyleSheet, Dimensions} from 'react-native';
import {lightTheme} from './themes';

const {width, height} = Dimensions.get('window');

// Common styles used throughout the app
export const commonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  
  paddedContainer: {
    flex: 1,
    padding: lightTheme.spacing.md,
    backgroundColor: lightTheme.colors.background,
  },
  
  // Card Styles
  card: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius,
    padding: lightTheme.spacing.md,
    marginVertical: lightTheme.spacing.sm,
    shadowColor: lightTheme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: lightTheme.borderRadius,
    paddingVertical: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: lightTheme.colors.primary,
    borderWidth: 2,
    borderRadius: lightTheme.borderRadius,
    paddingVertical: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    ...lightTheme.typography.button,
    color: lightTheme.colors.text,
  },
  
  primaryButtonText: {
    ...lightTheme.typography.button,
    color: lightTheme.colors.surface,
  },
  
  // Input Styles
  input: {
    borderColor: lightTheme.colors.border,
    borderWidth: 1,
    borderRadius: lightTheme.borderRadius,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    fontSize: 16,
    color: lightTheme.colors.text,
    backgroundColor: lightTheme.colors.surface,
  },
  
  inputFocused: {
    borderColor: lightTheme.colors.primary,
    borderWidth: 2,
  },
  
  inputError: {
    borderColor: lightTheme.colors.error,
  },
  
  // Text Styles
  title: {
    ...lightTheme.typography.h1,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
  },
  
  subtitle: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  
  heading: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  
  bodyText: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.text,
    lineHeight: 24,
  },
  
  secondaryText: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textSecondary,
  },
  
  captionText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.textSecondary,
  },
  
  errorText: {
    ...lightTheme.typography.bodySmall,
    color: lightTheme.colors.error,
    marginTop: lightTheme.spacing.xs,
  },
  
  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  // Spacing Utilities
  marginTop: {
    marginTop: lightTheme.spacing.md,
  },
  
  marginBottom: {
    marginBottom: lightTheme.spacing.md,
  },
  
  marginHorizontal: {
    marginHorizontal: lightTheme.spacing.md,
  },
  
  marginVertical: {
    marginVertical: lightTheme.spacing.md,
  },
  
  padding: {
    padding: lightTheme.spacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: lightTheme.spacing.md,
  },
  
  paddingVertical: {
    paddingVertical: lightTheme.spacing.md,
  },
  
  // List Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  
  listItemLast: {
    borderBottomWidth: 0,
  },
  
  // Header Styles
  header: {
    backgroundColor: lightTheme.colors.surface,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  
  headerTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius,
    padding: lightTheme.spacing.lg,
    margin: lightTheme.spacing.md,
    maxHeight: height * 0.8,
    width: width * 0.9,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  
  loadingText: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textSecondary,
    marginTop: lightTheme.spacing.md,
  },
  
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing.xl,
  },
  
  emptyStateTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
    textAlign: 'center',
  },
  
  emptyStateText: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  
  // Form Styles
  formContainer: {
    padding: lightTheme.spacing.md,
  },
  
  formGroup: {
    marginBottom: lightTheme.spacing.md,
  },
  
  formLabel: {
    ...lightTheme.typography.bodySmall,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
    fontWeight: '500',
  },
  
  // Tab Styles
  tabBar: {
    backgroundColor: lightTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  
  // Image Styles
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.colors.border,
  },
  
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.border,
  },
  
  // Utility Styles
  flex1: {
    flex: 1,
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  bold: {
    fontWeight: 'bold',
  },
  
  italic: {
    fontStyle: 'italic',
  },
  
  // RTL Support
  rtl: {
    writingDirection: 'rtl',
  },
  
  ltr: {
    writingDirection: 'ltr',
  },
});

// Screen-specific dimensions
export const screenDimensions = {
  width,
  height,
  isSmallScreen: width < 375,
  isLargeScreen: width > 414,
};

// Responsive helper functions
export const responsiveSize = (size: number, factor: number = 0.1) => {
  const baseSize = 375; // iPhone X width
  const scale = width / baseSize;
  return size + (scale - 1) * size * factor;
};

export const isTablet = () => {
  return width >= 768;
};

export const getResponsivePadding = () => {
  return isTablet() ? lightTheme.spacing.xl : lightTheme.spacing.md;
};