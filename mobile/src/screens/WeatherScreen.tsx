import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {databaseService} from '@/services/databaseService';
import {WeatherData} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const WeatherScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();
  const {isOnline} = useOffline();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({
    lat: 31.9539, // Amman coordinates
    lon: 35.9106,
    name: 'Amman'
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      let weather: WeatherData | null = null;

      if (isOnline) {
        // Try to get current weather from API
        const response = await apiService.getCurrentWeather(location.lat, location.lon);
        if (response.data) {
          weather = response.data;
          // Cache the weather data
          await databaseService.cacheWeather(weather);
        }
      } else {
        // Try to get cached weather data
        weather = await databaseService.getCachedWeather(location.lat, location.lon);
      }

      if (!weather) {
        // Use fallback weather data
        weather = {
          id: 'fallback',
          city_name: location.name,
          temperature: 25,
          humidity: 60,
          pressure: 1013,
          description: 'Clear sky',
          wind_speed: 5,
          latitude: location.lat,
          longitude: location.lon,
          recorded_at: new Date().toISOString(),
          source: 'fallback'
        };
      }

      setWeatherData(weather);
    } catch (error) {
      console.error('Failed to load weather data:', error);
      setSnackbarMessage(t('errors.weatherLoadFailed') || 'Failed to load weather data');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny')) return 'wb-sunny';
    if (desc.includes('cloud')) return 'cloud';
    if (desc.includes('rain')) return 'grain';
    if (desc.includes('storm')) return 'flash-on';
    if (desc.includes('snow')) return 'ac-unit';
    if (desc.includes('fog')) return 'blur-on';
    return 'wb-cloudy';
  };

  const getWeatherGradient = (temperature: number) => {
    if (temperature > 30) return [theme.colors.error, theme.colors.error + '80'];
    if (temperature > 20) return [theme.colors.primary, theme.colors.secondary];
    return [theme.colors.secondary, theme.colors.primary];
  };

  if (loading) {
    return <LoadingSpinner text={t('weather.loadingWeather') || 'Loading weather...'} />;
  }

  if (!weatherData) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.errorTitle, {color: theme.colors.onSurface}]}>
            {t('weather.weatherUnavailable') || 'Weather data unavailable'}
          </Text>
          <Button mode="outlined" onPress={loadWeatherData}>
            {t('common.retry')}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        
        {/* Offline Indicator */}
        {!isOnline && (
          <View style={[styles.offlineIndicator, {backgroundColor: theme.colors.errorContainer}]}>
            <Icon name="offline-bolt" size={16} color={theme.colors.onErrorContainer} />
            <Text style={[styles.offlineText, {color: theme.colors.onErrorContainer}]}>
              {t('offline.showingCachedWeather') || 'Showing cached weather data'}
            </Text>
          </View>
        )}

        {/* Main Weather Card */}
        <LinearGradient
          colors={getWeatherGradient(weatherData.temperature)}
          style={styles.mainWeatherCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          
          <View style={styles.weatherHeader}>
            <View style={styles.locationInfo}>
              <Icon name="location-on" size={20} color={theme.colors.surface} />
              <Text style={[styles.locationName, {color: theme.colors.surface}]}>
                {weatherData.city_name}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                setSnackbarMessage(t('weather.locationChangeComingSoon') || 'Location change coming soon!');
                setSnackbarVisible(true);
              }}>
              <Icon name="my-location" size={24} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>

          <View style={styles.mainWeatherInfo}>
            <Icon 
              name={getWeatherIcon(weatherData.description || '')} 
              size={80} 
              color={theme.colors.surface} 
            />
            <View style={styles.temperatureInfo}>
              <Text style={[styles.temperature, {color: theme.colors.surface}]}>
                {Math.round(weatherData.temperature)}°C
              </Text>
              <Text style={[styles.weatherDescription, {color: theme.colors.surface}]}>
                {weatherData.description}
              </Text>
            </View>
          </View>

          <Text style={[styles.lastUpdated, {color: theme.colors.surface}]}>
            {t('weather.lastUpdated') || 'Last updated'}: {new Date(weatherData.recorded_at).toLocaleTimeString()}
          </Text>
        </LinearGradient>

        {/* Weather Details */}
        <View style={styles.detailsGrid}>
          <Card style={[styles.detailCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.detailContent}>
              <Icon name="opacity" size={32} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, {color: theme.colors.onSurfaceVariant}]}>
                {t('weather.humidity')}
              </Text>
              <Text style={[styles.detailValue, {color: theme.colors.onSurface}]}>
                {weatherData.humidity || 'N/A'}%
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.detailCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.detailContent}>
              <Icon name="compress" size={32} color={theme.colors.secondary} />
              <Text style={[styles.detailLabel, {color: theme.colors.onSurfaceVariant}]}>
                {t('weather.pressure')}
              </Text>
              <Text style={[styles.detailValue, {color: theme.colors.onSurface}]}>
                {weatherData.pressure || 'N/A'} hPa
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.detailCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.detailContent}>
              <Icon name="air" size={32} color={theme.colors.tertiary} />
              <Text style={[styles.detailLabel, {color: theme.colors.onSurfaceVariant}]}>
                {t('weather.windSpeed')}
              </Text>
              <Text style={[styles.detailValue, {color: theme.colors.onSurface}]}>
                {weatherData.wind_speed || 'N/A'} m/s
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.detailCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.detailContent}>
              <Icon name="thermostat" size={32} color={theme.colors.error} />
              <Text style={[styles.detailLabel, {color: theme.colors.onSurfaceVariant}]}>
                {t('weather.feelsLike')}
              </Text>
              <Text style={[styles.detailValue, {color: theme.colors.onSurface}]}>
                {Math.round(weatherData.temperature + 2)}°C
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Weather Tips */}
        <Card style={[styles.tipsCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.tipsHeader}>
              <Icon name="lightbulb" size={24} color={theme.colors.primary} />
              <Text style={[styles.tipsTitle, {color: theme.colors.onSurface}]}>
                {t('weather.travelTips') || 'Travel Tips'}
              </Text>
            </View>
            
            <Text style={[styles.tipsContent, {color: theme.colors.onSurfaceVariant}]}>
              {weatherData.temperature > 30 
                ? t('weather.hotWeatherTip') || 'It\'s quite hot today. Stay hydrated and seek shade during peak hours.'
                : weatherData.temperature < 15
                ? t('weather.coldWeatherTip') || 'It\'s cool today. Consider bringing a light jacket.'
                : t('weather.niceWeatherTip') || 'Perfect weather for outdoor activities!'
              }
            </Text>
          </Card.Content>
        </Card>

        {/* Data Source */}
        <View style={styles.dataSource}>
          <Text style={[styles.dataSourceText, {color: theme.colors.onSurfaceVariant}]}>
            {t('weather.dataSource') || 'Data source'}: {weatherData.source || 'API'}
          </Text>
          {weatherData.source === 'fallback' && (
            <Text style={[styles.fallbackNotice, {color: theme.colors.error}]}>
              {t('weather.fallbackDataNotice') || 'Showing fallback weather data'}
            </Text>
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 8,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  mainWeatherCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    elevation: 8,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  temperatureInfo: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  lastUpdated: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  detailCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  detailContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  dataSource: {
    alignItems: 'center',
    padding: 16,
  },
  dataSourceText: {
    fontSize: 12,
    marginBottom: 4,
  },
  fallbackNotice: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default WeatherScreen;