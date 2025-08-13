import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import {useI18n} from '@/contexts/I18nContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text,
  color,
  style,
}) => {
  const theme = useTheme();
  const {t} = useI18n();

  const spinnerColor = color || theme.colors.primary;
  const loadingText = text || t('common.loading');

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text style={[styles.text, {color: theme.colors.onSurface}]}>
          {loadingText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingSpinner;