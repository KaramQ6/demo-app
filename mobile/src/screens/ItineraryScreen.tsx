import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  FAB,
  Chip,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useI18n} from '@/contexts/I18nContext';
import {useAuth} from '@/contexts/AuthContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {offlineService} from '@/services/offlineService';
import {databaseService} from '@/services/databaseService';
import {ItineraryItem} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ItineraryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useI18n();
  const {user} = useAuth();
  const {isOnline, syncStatus} = useOffline();

  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'planned' | 'visited'>('planned');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadItinerary();
    } else {
      setLoading(false);
    }
  }, [user, isOnline]);

  const loadItinerary = async () => {
    if (!user) return;

    try {
      if (isOnline) {
        // Load from API
        const response = await apiService.getItineraries();
        if (response.data) {
          setItineraryItems(response.data);
        }
      } else {
        // Load from offline database
        const offlineItems = await databaseService.getUserItineraries(user.id);
        setItineraryItems(offlineItems);
      }
    } catch (error) {
      console.error('Failed to load itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItinerary();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (item: ItineraryItem, newStatus: 'planned' | 'visited' | 'cancelled') => {
    try {
      if (isOnline) {
        const response = await apiService.updateItinerary(item.id, {status: newStatus});
        if (response.data) {
          setItineraryItems(prev =>
            prev.map(i => i.id === item.id ? {...i, status: newStatus} : i)
          );
          setSnackbarMessage(t('itinerary.itineraryUpdated'));
          setSnackbarVisible(true);
        }
      } else {
        await offlineService.updateItineraryOffline(item.id, {status: newStatus});
        setItineraryItems(prev =>
          prev.map(i => i.id === item.id ? {...i, status: newStatus} : i)
        );
        setSnackbarMessage(t('itinerary.itineraryUpdated') + ' ' + t('offline.willSyncLater'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleRemoveItem = async (item: ItineraryItem) => {
    try {
      if (isOnline) {
        const response = await apiService.deleteItinerary(item.id);
        if (!response.error) {
          setItineraryItems(prev => prev.filter(i => i.id !== item.id));
          setSnackbarMessage(t('itinerary.destinationRemoved'));
          setSnackbarVisible(true);
        }
      } else {
        await offlineService.deleteItineraryOffline(item.id);
        setItineraryItems(prev => prev.filter(i => i.id !== item.id));
        setSnackbarMessage(t('itinerary.destinationRemoved') + ' ' + t('offline.willSyncLater'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return theme.colors.primary;
      case 'visited':
        return theme.colors.tertiary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority === 3) return 'keyboard-arrow-up';
    if (priority === 2) return 'remove';
    return 'keyboard-arrow-down';
  };

  const filteredItems = itineraryItems.filter(item => 
    selectedTab === 'planned' ? item.status !== 'visited' : item.status === 'visited'
  );

  const renderItineraryItem = ({item}: {item: ItineraryItem}) => (
    <Card style={[styles.itemCard, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, {color: theme.colors.onSurface}]}>
              {item.destination_name}
            </Text>
            <View style={styles.itemMeta}>
              <Chip
                mode="outlined"
                compact
                style={[styles.statusChip, {borderColor: getStatusColor(item.status)}]}
                textStyle={{color: getStatusColor(item.status)}}>
                {t(`itinerary.${item.status}`)}
              </Chip>
              <Icon 
                name={getPriorityIcon(item.priority)} 
                size={16} 
                color={theme.colors.onSurfaceVariant} 
              />
            </View>
          </View>
          
          <IconButton
            icon="more-vert"
            size={20}
            onPress={() => {
              // Show action sheet - implement later
              setSnackbarMessage(t('common.moreOptionsComingSoon') || 'More options coming soon!');
              setSnackbarVisible(true);
            }}
          />
        </View>

        {item.notes && (
          <Text style={[styles.itemNotes, {color: theme.colors.onSurfaceVariant}]}>
            {item.notes}
          </Text>
        )}

        {item.visit_date && (
          <View style={styles.visitDate}>
            <Icon name="event" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.visitDateText, {color: theme.colors.onSurfaceVariant}]}>
              {new Date(item.visit_date).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.itemActions}>
          {item.status === 'planned' && (
            <Button
              mode="text"
              compact
              onPress={() => handleUpdateStatus(item, 'visited')}
              icon="check">
              {t('itinerary.markAsVisited')}
            </Button>
          )}
          
          {item.status === 'visited' && (
            <Button
              mode="text"
              compact
              onPress={() => handleUpdateStatus(item, 'planned')}
              icon="restore">
              {t('itinerary.markAsPlanned')}
            </Button>
          )}
          
          <Button
            mode="text"
            compact
            onPress={() => handleRemoveItem(item)}
            textColor={theme.colors.error}
            icon="delete">
            {t('common.delete')}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (!user) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.emptyState}>
          <Icon name="login" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyStateTitle, {color: theme.colors.onSurface}]}>
            {t('auth.loginRequired') || 'Login Required'}
          </Text>
          <Text style={[styles.emptyStateText, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.loginToViewItinerary') || 'Please login to view your itinerary'}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Auth' as never)}
            style={styles.loginButton}>
            {t('auth.login')}
          </Button>
        </View>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'planned' && styles.activeTab,
            {backgroundColor: selectedTab === 'planned' ? theme.colors.primary : 'transparent'}
          ]}
          onPress={() => setSelectedTab('planned')}>
          <Text style={[
            styles.tabText,
            {color: selectedTab === 'planned' ? theme.colors.surface : theme.colors.onSurface}
          ]}>
            {t('itinerary.plannedTrips')} ({itineraryItems.filter(i => i.status !== 'visited').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'visited' && styles.activeTab,
            {backgroundColor: selectedTab === 'visited' ? theme.colors.primary : 'transparent'}
          ]}
          onPress={() => setSelectedTab('visited')}>
          <Text style={[
            styles.tabText,
            {color: selectedTab === 'visited' ? theme.colors.surface : theme.colors.onSurface}
          ]}>
            {t('itinerary.visitedPlaces')} ({itineraryItems.filter(i => i.status === 'visited').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sync Status */}
      {!isOnline && syncStatus.pendingActions > 0 && (
        <View style={[styles.syncStatus, {backgroundColor: theme.colors.errorContainer}]}>
          <Icon name="sync-problem" size={16} color={theme.colors.onErrorContainer} />
          <Text style={[styles.syncText, {color: theme.colors.onErrorContainer}]}>
            {t('offline.syncPending', {count: syncStatus.pendingActions})}
          </Text>
        </View>
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon 
            name={selectedTab === 'planned' ? 'list' : 'done-all'} 
            size={64} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.emptyStateTitle, {color: theme.colors.onSurface}]}>
            {selectedTab === 'planned' ? t('itinerary.emptyItinerary') : t('itinerary.noVisitedPlaces') || 'No visited places yet'}
          </Text>
          <Text style={[styles.emptyStateText, {color: theme.colors.onSurfaceVariant}]}>
            {selectedTab === 'planned' 
              ? t('itinerary.emptyItinerarySubtitle')
              : t('itinerary.startExploringToVisit') || 'Start exploring destinations to mark as visited'
            }
          </Text>
          {selectedTab === 'planned' && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Destinations' as never)}
              style={styles.addButton}>
              {t('itinerary.addFirstDestination')}
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItineraryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <FAB
        icon="add"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('Destinations' as never)}
      />

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
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  syncText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  itemCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: 8,
  },
  itemNotes: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  visitDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitDateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  addButton: {
    paddingHorizontal: 24,
  },
  loginButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ItineraryScreen;