import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  Button,
  useTheme,
  FAB,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {databaseService} from '@/services/databaseService';
import {JORDAN_DESTINATIONS} from '@/config/constants';
import {Destination} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const {width} = Dimensions.get('window');

const categories = [
  'all',
  'historical',
  'nature',
  'cultural',
  'coastal',
  'adventure',
  'religious',
];

const DestinationsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useI18n();
  const {isOnline} = useOffline();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadDestinations();
  }, [isOnline]);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchQuery, selectedCategory]);

  const loadDestinations = async () => {
    try {
      let destinationsData: Destination[] = [];

      if (isOnline) {
        // Load from API
        const response = await apiService.getDestinations();
        if (response.data) {
          destinationsData = response.data;
          // Cache destinations for offline use
          await databaseService.cacheDestinations(destinationsData);
        } else {
          // Fallback to mock data
          destinationsData = JORDAN_DESTINATIONS.map(dest => ({
            ...dest,
            description: `Explore the beauty of ${dest.name}`,
            description_ar: `استكشف جمال ${dest.name_ar}`,
            image_url: `https://picsum.photos/400/300?random=${dest.id}`,
            rating: 4.5,
            is_active: true,
            created_at: new Date().toISOString(),
          }));
        }
      } else {
        // Load from offline database
        destinationsData = await databaseService.getDestinations();
        if (destinationsData.length === 0) {
          // Use mock data if no cached data
          destinationsData = JORDAN_DESTINATIONS.map(dest => ({
            ...dest,
            description: `Explore the beauty of ${dest.name}`,
            description_ar: `استكشف جمال ${dest.name_ar}`,
            image_url: `https://picsum.photos/400/300?random=${dest.id}`,
            rating: 4.5,
            is_active: true,
            created_at: new Date().toISOString(),
          }));
        }
      }

      setDestinations(destinationsData);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDestinations();
    setRefreshing(false);
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.name_ar?.toLowerCase().includes(query) ||
        dest.description?.toLowerCase().includes(query) ||
        dest.category?.toLowerCase().includes(query)
      );
    }

    setFilteredDestinations(filtered);
  };

  const getCategoryTranslation = (category: string) => {
    const key = `destinations.${category}`;
    return t(key) !== key ? t(key) : category;
  };

  const renderDestination = ({item}: {item: Destination}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DestinationDetail' as never, {destinationId: item.id} as never)}>
      <Card style={[styles.destinationCard, {backgroundColor: theme.colors.surface}]}>
        <LinearGradient
          colors={[theme.colors.primary + '20', theme.colors.secondary + '20']}
          style={styles.destinationImage}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Text style={[styles.destinationInitial, {color: theme.colors.primary}]}>
            {item.name.charAt(0)}
          </Text>
        </LinearGradient>
        
        <Card.Content style={styles.destinationContent}>
          <View style={styles.destinationHeader}>
            <Text style={[styles.destinationName, {color: theme.colors.onSurface}]}>
              {item.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color={theme.colors.primary} />
              <Text style={[styles.rating, {color: theme.colors.onSurfaceVariant}]}>
                {item.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          
          {item.name_ar && (
            <Text style={[styles.destinationNameAr, {color: theme.colors.onSurfaceVariant}]}>
              {item.name_ar}
            </Text>
          )}
          
          <Text style={[styles.destinationDescription, {color: theme.colors.onSurfaceVariant}]} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.destinationFooter}>
            <Chip
              mode="outlined"
              compact
              style={styles.categoryChip}>
              {getCategoryTranslation(item.category || 'other')}
            </Chip>
            
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('DestinationDetail' as never, {destinationId: item.id} as never)}>
              {t('destinations.viewDetails')}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: string) => (
    <Chip
      key={category}
      mode={selectedCategory === category ? 'flat' : 'outlined'}
      selected={selectedCategory === category}
      onPress={() => setSelectedCategory(category)}
      style={styles.categoryFilterChip}>
      {getCategoryTranslation(category)}
    </Chip>
  );

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Search Bar */}
      <Searchbar
        placeholder={t('destinations.searchPlaceholder')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{textAlign: 'left'}}
        icon="magnify"
        clearIcon="close"
      />

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({item}) => renderCategoryChip(item)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Offline Indicator */}
      {!isOnline && (
        <View style={[styles.offlineIndicator, {backgroundColor: theme.colors.errorContainer}]}>
          <Icon name="offline-bolt" size={16} color={theme.colors.onErrorContainer} />
          <Text style={[styles.offlineText, {color: theme.colors.onErrorContainer}]}>
            {t('offline.offlineMessage')}
          </Text>
        </View>
      )}

      {/* Destinations List */}
      {filteredDestinations.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="place" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyStateTitle, {color: theme.colors.onSurface}]}>
            {t('destinations.noDestinationsFound')}
          </Text>
          <Text style={[styles.emptyStateText, {color: theme.colors.onSurfaceVariant}]}>
            {t('destinations.tryDifferentSearch') || 'Try adjusting your search or category filter'}
          </Text>
          <Button
            mode="outlined"
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            style={styles.clearFiltersButton}>
            {t('common.clear')}
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredDestinations}
          renderItem={renderDestination}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.destinationsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter FAB */}
      <FAB
        icon="filter-variant"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => {
          // Open filter modal - implement later
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryList: {
    paddingRight: 16,
  },
  categoryFilterChip: {
    marginRight: 8,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  destinationsList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  destinationCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationInitial: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  destinationContent: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  destinationNameAr: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  destinationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  destinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    flex: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DestinationsScreen;