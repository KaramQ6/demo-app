import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Avatar,
  Chip,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@/contexts/AuthContext';
import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {JORDAN_DESTINATIONS} from '@/config/constants';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const {width} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useAuth();
  const {t} = useI18n();
  const {isOnline, syncStatus} = useOffline();

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load weather data
      const weatherResponse = await apiService.getCurrentWeather();
      if (weatherResponse.data) {
        setWeatherData(weatherResponse.data);
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('common.goodMorning') || 'Good Morning';
    } else if (hour < 17) {
      return t('common.goodAfternoon') || 'Good Afternoon';
    } else {
      return t('common.goodEvening') || 'Good Evening';
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      
      {/* Header with gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Offline indicator */}
        {!isOnline && (
          <View style={[styles.offlineIndicator, {backgroundColor: theme.colors.error}]}>
            <Icon name="offline-bolt" size={16} color={theme.colors.surface} />
            <Text style={[styles.offlineText, {color: theme.colors.surface}]}>
              {t('offline.offlineMessage')}
            </Text>
          </View>
        )}
        
        <View style={styles.headerContent}>
          <View style={styles.greetingSection}>
            <Text style={[styles.greeting, {color: theme.colors.surface}]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.userName, {color: theme.colors.surface}]}>
              {user?.full_name || user?.email?.split('@')[0] || 'Traveler'}
            </Text>
          </View>
          
          <Avatar.Text
            size={48}
            label={user?.full_name?.charAt(0) || 'U'}
            style={{backgroundColor: theme.colors.surface}}
            labelStyle={{color: theme.colors.primary}}
          />
        </View>

        {/* App title */}
        <View style={styles.titleSection}>
          <Text style={[styles.appTitle, {color: theme.colors.surface}]}>
            {t('home.title')}
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.surface}]}>
            {t('home.subtitle')}
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: theme.colors.surface}]}
          onPress={() => navigation.navigate('Destinations' as never)}>
          <Icon name="place" size={32} color={theme.colors.primary} />
          <Text style={[styles.actionText, {color: theme.colors.onSurface}]}>
            {t('home.exploreDestinations')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: theme.colors.surface}]}
          onPress={() => navigation.navigate('Weather' as never)}>
          <Icon name="wb-sunny" size={32} color={theme.colors.secondary} />
          <Text style={[styles.actionText, {color: theme.colors.onSurface}]}>
            {t('home.viewWeather')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: theme.colors.surface}]}
          onPress={() => navigation.navigate('Itinerary' as never)}>
          <Icon name="list" size={32} color={theme.colors.tertiary} />
          <Text style={[styles.actionText, {color: theme.colors.onSurface}]}>
            {t('home.planItinerary')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: theme.colors.surface}]}
          onPress={() => navigation.navigate('Chat' as never)}>
          <Icon name="smart-toy" size={32} color={theme.colors.error} />
          <Text style={[styles.actionText, {color: theme.colors.onSurface}]}>
            {t('home.askAI')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weather Card */}
      {weatherData && (
        <Card style={[styles.weatherCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <View style={styles.weatherHeader}>
              <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
                {t('home.weatherTitle')}
              </Text>
              <Icon name="wb-sunny" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.weatherContent}>
              <Text style={[styles.temperature, {color: theme.colors.onSurface}]}>
                {Math.round(weatherData.temperature)}°C
              </Text>
              <View>
                <Text style={[styles.cityName, {color: theme.colors.onSurface}]}>
                  {weatherData.cityName}
                </Text>
                <Text style={[styles.weatherDescription, {color: theme.colors.onSurfaceVariant}]}>
                  {weatherData.description}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Featured Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: theme.colors.onBackground}]}>
            {t('home.featuredDestinations')}
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Destinations' as never)}>
            {t('common.viewAll') || 'View All'}
          </Button>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {JORDAN_DESTINATIONS.slice(0, 5).map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={[styles.destinationCard, {backgroundColor: theme.colors.surface}]}
              onPress={() => navigation.navigate('DestinationDetail' as never, {destinationId: destination.id} as never)}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.destinationImage}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Text style={[styles.destinationInitial, {color: theme.colors.surface}]}>
                  {destination.name.charAt(0)}
                </Text>
              </LinearGradient>
              <View style={styles.destinationInfo}>
                <Text style={[styles.destinationName, {color: theme.colors.onSurface}]}>
                  {destination.name}
                </Text>
                <Chip
                  mode="outlined"
                  compact
                  style={styles.categoryChip}>
                  {destination.category}
                </Chip>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sync Status */}
      {!isOnline && syncStatus.pendingActions > 0 && (
        <Card style={[styles.syncCard, {backgroundColor: theme.colors.errorContainer}]}>
          <Card.Content>
            <View style={styles.syncContent}>
              <Icon name="sync-problem" size={24} color={theme.colors.onErrorContainer} />
              <View style={styles.syncText}>
                <Text style={[styles.syncTitle, {color: theme.colors.onErrorContainer}]}>
                  {t('offline.syncPending', {count: syncStatus.pendingActions})}
                </Text>
                <Text style={[styles.syncSubtitle, {color: theme.colors.onErrorContainer}]}>
                  {t('offline.syncWhenOnline') || 'Changes will sync when you\'re back online'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  titleSection: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 60) / 2,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 24,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  destinationCard: {
    width: 150,
    marginLeft: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationInitial: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  syncCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
  },
  syncContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    flex: 1,
    marginLeft: 12,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  syncSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default HomeScreen;