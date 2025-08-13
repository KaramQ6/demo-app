import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  IconButton,
  Chip,
  Snackbar,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute, useNavigation} from '@react-navigation/native';

import {useI18n} from '@/contexts/I18nContext';
import {useAuth} from '@/contexts/AuthContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {offlineService} from '@/services/offlineService';
import {JORDAN_DESTINATIONS} from '@/config/constants';
import {Destination} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const {width, height} = Dimensions.get('window');

const DestinationDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useI18n();
  const {user} = useAuth();
  const {isOnline} = useOffline();

  const {destinationId} = route.params as {destinationId: string};

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToItinerary, setAddingToItinerary] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadDestination();
  }, [destinationId]);

  const loadDestination = async () => {
    try {
      // Try to get from API or use mock data
      const mockDestination = JORDAN_DESTINATIONS.find(d => d.id === destinationId);
      
      if (mockDestination) {
        const fullDestination: Destination = {
          ...mockDestination,
          description: `Discover the wonders of ${mockDestination.name}, one of Jordan's most captivating destinations. This remarkable location offers visitors an unforgettable experience with its unique blend of history, culture, and natural beauty.`,
          description_ar: `اكتشف عجائب ${mockDestination.name_ar}، إحدى أجمل الوجهات في الأردن. يوفر هذا الموقع الرائع للزوار تجربة لا تُنسى مع مزيجه الفريد من التاريخ والثقافة والجمال الطبيعي.`,
          image_url: `https://picsum.photos/400/300?random=${mockDestination.id}`,
          rating: 4.5 + Math.random() * 0.5,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        setDestination(fullDestination);
      }
    } catch (error) {
      console.error('Failed to load destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToItinerary = async () => {
    if (!destination || !user) {
      setSnackbarMessage(t('auth.loginRequired') || 'Please login to add to itinerary');
      setSnackbarVisible(true);
      return;
    }

    setAddingToItinerary(true);
    try {
      const itineraryItem = {
        destination_id: destination.id,
        destination_name: destination.name,
        destination_type: destination.category,
        destination_icon: 'place',
        notes: '',
        status: 'planned' as const,
        priority: 1,
      };

      if (isOnline) {
        const response = await apiService.createItinerary(itineraryItem);
        if (response.data) {
          setSnackbarMessage(t('itinerary.destinationAdded'));
          setSnackbarVisible(true);
        } else {
          throw new Error(response.error);
        }
      } else {
        await offlineService.createItineraryOffline(itineraryItem);
        setSnackbarMessage(t('itinerary.destinationAdded') + ' ' + t('offline.willSyncLater'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    } finally {
      setAddingToItinerary(false);
    }
  };

  const handleGetDirections = () => {
    if (destination) {
      // Open maps app with coordinates
      const url = `https://maps.google.com/?q=${destination.latitude},${destination.longitude}`;
      // In a real app, you'd use Linking.openURL(url)
      setSnackbarMessage(t('destinations.openingMaps') || 'Opening maps...');
      setSnackbarVisible(true);
    }
  };

  const handleShare = () => {
    if (destination) {
      const shareText = `Check out ${destination.name} - ${destination.description?.substring(0, 100)}...`;
      // In a real app, you'd use Share API
      setSnackbarMessage(t('common.shareFeatureComingSoon') || 'Share feature coming soon!');
      setSnackbarVisible(true);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (!destination) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.errorContainer}>
          <Icon name="place-off" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.errorTitle, {color: theme.colors.onSurface}]}>
            {t('destinations.destinationNotFound') || 'Destination Not Found'}
          </Text>
          <Button mode="outlined" onPress={() => navigation.goBack()}>
            {t('common.back')}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.headerImage}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Text style={[styles.destinationInitial, {color: theme.colors.surface}]}>
              {destination.name.charAt(0)}
            </Text>
          </LinearGradient>
          
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={theme.colors.surface}
              style={[styles.headerButton, {backgroundColor: theme.colors.surface + '20'}]}
              onPress={() => navigation.goBack()}
            />
            <View style={styles.headerRightActions}>
              <IconButton
                icon="share"
                size={24}
                iconColor={theme.colors.surface}
                style={[styles.headerButton, {backgroundColor: theme.colors.surface + '20'}]}
                onPress={handleShare}
              />
              <IconButton
                icon="favorite-border"
                size={24}
                iconColor={theme.colors.surface}
                style={[styles.headerButton, {backgroundColor: theme.colors.surface + '20'}]}
                onPress={() => {
                  setSnackbarMessage(t('common.favoriteFeatureComingSoon') || 'Favorite feature coming soon!');
                  setSnackbarVisible(true);
                }}
              />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, {color: theme.colors.onSurface}]}>
                {destination.name}
              </Text>
              {destination.name_ar && (
                <Text style={[styles.titleAr, {color: theme.colors.onSurfaceVariant}]}>
                  {destination.name_ar}
                </Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color={theme.colors.primary} />
              <Text style={[styles.rating, {color: theme.colors.onSurface}]}>
                {destination.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Category */}
          <Chip
            mode="flat"
            style={[styles.categoryChip, {backgroundColor: theme.colors.primaryContainer}]}
            textStyle={{color: theme.colors.onPrimaryContainer}}>
            {t(`destinations.${destination.category}`) !== `destinations.${destination.category}` 
              ? t(`destinations.${destination.category}`) 
              : destination.category}
          </Chip>

          {/* Description */}
          <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
            {t('destinations.description')}
          </Text>
          <Text style={[styles.description, {color: theme.colors.onSurfaceVariant}]}>
            {destination.description}
          </Text>

          {/* Location Info */}
          <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
            {t('destinations.location')}
          </Text>
          <View style={styles.locationInfo}>
            <Icon name="location-on" size={20} color={theme.colors.primary} />
            <Text style={[styles.coordinates, {color: theme.colors.onSurfaceVariant}]}>
              {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
            </Text>
          </View>

          {/* Quick Info Cards */}
          <View style={styles.infoCards}>
            <View style={[styles.infoCard, {backgroundColor: theme.colors.surface}]}>
              <Icon name="access-time" size={24} color={theme.colors.primary} />
              <Text style={[styles.infoCardTitle, {color: theme.colors.onSurface}]}>
                {t('destinations.openingHours')}
              </Text>
              <Text style={[styles.infoCardValue, {color: theme.colors.onSurfaceVariant}]}>
                {t('destinations.open24Hours') || '24/7'}
              </Text>
            </View>

            <View style={[styles.infoCard, {backgroundColor: theme.colors.surface}]}>
              <Icon name="payments" size={24} color={theme.colors.secondary} />
              <Text style={[styles.infoCardTitle, {color: theme.colors.onSurface}]}>
                {t('destinations.entryFee')}
              </Text>
              <Text style={[styles.infoCardValue, {color: theme.colors.onSurfaceVariant}]}>
                {t('destinations.varies') || 'Varies'}
              </Text>
            </View>
          </View>

          {/* Offline Notice */}
          {!isOnline && (
            <View style={[styles.offlineNotice, {backgroundColor: theme.colors.errorContainer}]}>
              <Icon name="offline-bolt" size={20} color={theme.colors.onErrorContainer} />
              <Text style={[styles.offlineText, {color: theme.colors.onErrorContainer}]}>
                {t('offline.limitedFunctionality') || 'Limited functionality while offline'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, {backgroundColor: theme.colors.surface}]}>
        <Button
          mode="outlined"
          onPress={handleGetDirections}
          style={styles.actionButton}
          icon="directions">
          {t('destinations.getDirections')}
        </Button>
        
        <Button
          mode="contained"
          onPress={handleAddToItinerary}
          loading={addingToItinerary}
          disabled={addingToItinerary}
          style={styles.actionButton}
          icon="playlist-add">
          {t('destinations.addToItinerary')}
        </Button>
      </View>

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
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationInitial: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  headerButton: {
    margin: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleAr: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  coordinates: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    flex: 0.48,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 12,
    textAlign: 'center',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default DestinationDetailScreen;