import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useI18n} from '@/contexts/I18nContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const {width, height} = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={[styles.logoContainer, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.logoText, {color: theme.colors.primary}]}>
            ST
          </Text>
        </View>

        {/* App Name */}
        <Text style={[styles.appName, {color: theme.colors.surface}]}>
          SmartTour.Jo
        </Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, {color: theme.colors.surface}]}>
          {t('home.subtitle')}
        </Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          size="large"
          color={theme.colors.surface}
          text=""
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 48,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default SplashScreen;