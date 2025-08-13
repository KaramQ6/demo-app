import {OfflineAction, DatabaseCountResult} from '@/types';
import {apiService} from './apiService';
import {databaseService} from './databaseService';
import {storageService} from './storageService';
import {STORAGE_KEYS} from '@/config/constants';

class OfflineService {
  private syncInProgress = false;

  /**
   * Sync pending offline actions with the server
   */
  async syncActions(actions: OfflineAction[]): Promise<boolean[]> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return actions.map(() => false);
    }

    this.syncInProgress = true;
    const results: boolean[] = [];

    try {
      for (const action of actions) {
        try {
          const success = await this.syncSingleAction(action);
          results.push(success);
          
          if (success) {
            console.log(`Successfully synced action: ${action.type} ${action.endpoint}`);
          } else {
            console.warn(`Failed to sync action: ${action.type} ${action.endpoint}`);
          }
        } catch (error) {
          console.error(`Error syncing action ${action.id}:`, error);
          results.push(false);
        }
      }
    } finally {
      this.syncInProgress = false;
    }

    return results;
  }

  /**
   * Sync a single offline action
   */
  private async syncSingleAction(action: OfflineAction): Promise<boolean> {
    try {
      let response;

      switch (action.type) {
        case 'CREATE':
          response = await apiService.request('POST', action.endpoint, action.data);
          break;
        case 'UPDATE':
          response = await apiService.request('PUT', action.endpoint, action.data);
          break;
        case 'DELETE':
          response = await apiService.request('DELETE', action.endpoint);
          break;
        default:
          console.warn(`Unknown action type: ${action.type}`);
          return false;
      }

      return !response.error;
    } catch (error) {
      console.error(`Failed to sync action ${action.id}:`, error);
      return false;
    }
  }

  /**
   * Handle offline itinerary operations
   */
  async createItineraryOffline(itineraryData: any): Promise<void> {
    try {
      // Save to local database
      await databaseService.addToItinerary(itineraryData);
      
      // Store offline action for later sync
      await this.storeOfflineAction({
        type: 'CREATE',
        endpoint: '/itineraries',
        data: itineraryData,
      });
      
      console.log('Itinerary saved offline');
    } catch (error) {
      console.error('Failed to save itinerary offline:', error);
      throw error;
    }
  }

  async updateItineraryOffline(id: string, updates: any): Promise<void> {
    try {
      // Update in local database
      await databaseService.updateItinerary(id, updates);
      
      // Store offline action for later sync
      await this.storeOfflineAction({
        type: 'UPDATE',
        endpoint: `/itineraries/${id}`,
        data: updates,
      });
      
      console.log('Itinerary updated offline');
    } catch (error) {
      console.error('Failed to update itinerary offline:', error);
      throw error;
    }
  }

  async deleteItineraryOffline(id: string): Promise<void> {
    try {
      // Remove from local database
      await databaseService.removeFromItinerary(id);
      
      // Store offline action for later sync
      await this.storeOfflineAction({
        type: 'DELETE',
        endpoint: `/itineraries/${id}`,
        data: {id},
      });
      
      console.log('Itinerary deleted offline');
    } catch (error) {
      console.error('Failed to delete itinerary offline:', error);
      throw error;
    }
  }

  /**
   * Handle offline profile operations
   */
  async updateProfileOffline(profileData: any): Promise<void> {
    try {
      // Store offline action for later sync
      await this.storeOfflineAction({
        type: 'UPDATE',
        endpoint: '/profile',
        data: profileData,
      });
      
      console.log('Profile update saved offline');
    } catch (error) {
      console.error('Failed to save profile update offline:', error);
      throw error;
    }
  }

  /**
   * Handle offline chat messages
   */
  async saveChatMessageOffline(message: any): Promise<void> {
    try {
      // Save to local database
      await databaseService.saveChatMessage(message);
      
      console.log('Chat message saved offline');
    } catch (error) {
      console.error('Failed to save chat message offline:', error);
      throw error;
    }
  }

  /**
   * Store an offline action for later synchronization
   */
  private async storeOfflineAction(actionData: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<void> {
    try {
      const action: OfflineAction = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...actionData,
      };

      // Get existing offline actions
      const existingActionsJson = await storageService.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      const existingActions: OfflineAction[] = existingActionsJson ? JSON.parse(existingActionsJson) : [];

      // Add new action
      existingActions.push(action);

      // Store updated actions
      await storageService.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(existingActions));
      
      console.log(`Stored offline action: ${action.type} ${action.endpoint}`);
    } catch (error) {
      console.error('Failed to store offline action:', error);
      throw error;
    }
  }

  /**
   * Get all pending offline actions
   */
  async getPendingActions(): Promise<OfflineAction[]> {
    try {
      const actionsJson = await storageService.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      return actionsJson ? JSON.parse(actionsJson) : [];
    } catch (error) {
      console.error('Failed to get pending actions:', error);
      return [];
    }
  }

  /**
   * Clear completed offline actions
   */
  async clearCompletedActions(completedActionIds: string[]): Promise<void> {
    try {
      const actionsJson = await storageService.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      if (!actionsJson) return;

      const actions: OfflineAction[] = JSON.parse(actionsJson);
      const remainingActions = actions.filter(action => !completedActionIds.includes(action.id));

      await storageService.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(remainingActions));
      
      console.log(`Cleared ${completedActionIds.length} completed actions`);
    } catch (error) {
      console.error('Failed to clear completed actions:', error);
    }
  }

  /**
   * Download essential data for offline use
   */
  async downloadOfflineData(): Promise<void> {
    try {
      console.log('Starting offline data download...');

      // Download popular destinations
      const destinationsResponse = await apiService.getDestinations();
      if (destinationsResponse.data) {
        await databaseService.cacheDestinations(destinationsResponse.data);
        console.log('Destinations cached for offline use');
      }

      // Download user's itinerary if logged in
      const itinerariesResponse = await apiService.getItineraries();
      if (itinerariesResponse.data) {
        // Cache itineraries in local database
        for (const itinerary of itinerariesResponse.data) {
          await databaseService.addToItinerary({...itinerary, synced: true});
        }
        console.log('Itineraries cached for offline use');
      }

      // Cache user profile
      const profileResponse = await apiService.getUserProfile();
      if (profileResponse.data) {
        await storageService.setObject(STORAGE_KEYS.USER_PREFERENCES, profileResponse.data.preferences);
        console.log('User profile cached for offline use');
      }

      // Update last sync timestamp
      await storageService.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
      
      console.log('Offline data download completed');
    } catch (error) {
      console.error('Failed to download offline data:', error);
      throw error;
    }
  }

  /**
   * Check if offline data is available and up to date
   */
  async isOfflineDataAvailable(): Promise<boolean> {
    try {
      // Check if we have cached destinations
      const destinations = await databaseService.getDestinations();
      if (destinations.length === 0) {
        return false;
      }

      // Check if data is not too old (7 days)
      const lastSyncString = await storageService.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!lastSyncString) {
        return false;
      }

      const lastSync = parseInt(lastSyncString, 10);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      const isDataFresh = (Date.now() - lastSync) < maxAge;

      return isDataFresh;
    } catch (error) {
      console.error('Failed to check offline data availability:', error);
      return false;
    }
  }

  /**
   * Clear all offline data
   */
  async clearOfflineData(): Promise<void> {
    try {
      // Clear database
      await databaseService.delete('destinations', '1=1');
      await databaseService.delete('itineraries', '1=1');
      await databaseService.delete('weather_cache', '1=1');
      await databaseService.delete('chat_messages', '1=1');
      await databaseService.clearCompletedSyncItems();

      // Clear cached data from storage
      await storageService.removeItem(STORAGE_KEYS.CACHED_DATA);
      await storageService.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      await storageService.removeItem(STORAGE_KEYS.LAST_SYNC);

      console.log('All offline data cleared');
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  }

  /**
   * Get offline data statistics
   */
  async getOfflineDataStats(): Promise<{
    destinations: number;
    itineraries: number;
    weatherCache: number;
    chatMessages: number;
    pendingActions: number;
    databaseSize: number;
  }> {
    try {
      const [destinations, itineraries, weatherCache, chatMessages, pendingActions] = await Promise.all([
        databaseService.select('destinations', 'COUNT(*) as count'),
        databaseService.select('itineraries', 'COUNT(*) as count'),
        databaseService.select('weather_cache', 'COUNT(*) as count'),
        databaseService.select('chat_messages', 'COUNT(*) as count'),
        this.getPendingActions(),
      ]);

      const databaseSize = await databaseService.getDatabaseSize();

      return {
        destinations: destinations[0]?.count || 0,
        itineraries: itineraries[0]?.count || 0,
        weatherCache: weatherCache[0]?.count || 0,
        chatMessages: chatMessages[0]?.count || 0,
        pendingActions: pendingActions.length,
        databaseSize,
      };
    } catch (error) {
      console.error('Failed to get offline data stats:', error);
      return {
        destinations: 0,
        itineraries: 0,
        weatherCache: 0,
        chatMessages: 0,
        pendingActions: 0,
        databaseSize: 0,
      };
    }
  }

  /**
   * Perform database maintenance
   */
  async performMaintenance(): Promise<void> {
    try {
      console.log('Starting database maintenance...');

      // Clear expired cache data
      await databaseService.clearExpiredCache();

      // Clear completed sync items
      await databaseService.clearCompletedSyncItems();

      // Vacuum database to reclaim space
      await databaseService.vacuum();

      console.log('Database maintenance completed');
    } catch (error) {
      console.error('Database maintenance failed:', error);
    }
  }
}

export const offlineService = new OfflineService();