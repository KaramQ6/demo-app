import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {OfflineAction, SyncStatus} from '@/types';
import {storageService} from '@/services/storageService';
import {offlineService} from '@/services/offlineService';
import {STORAGE_KEYS} from '@/config/constants';

interface OfflineContextType {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingActions: OfflineAction[];
  addOfflineAction: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => Promise<void>;
  syncPendingActions: () => Promise<void>;
  clearPendingActions: () => Promise<void>;
  retryFailedActions: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({children}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: 0,
    pendingActions: 0,
  });

  useEffect(() => {
    // Initialize offline state
    initializeOfflineState();
    
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const newIsOnline = state.isConnected && state.isInternetReachable;
      setIsOnline(newIsOnline || false);
      
      setSyncStatus(prev => ({
        ...prev,
        isOnline: newIsOnline || false,
      }));
      
      // Auto-sync when coming back online
      if (newIsOnline && !isOnline && pendingActions.length > 0) {
        syncPendingActions();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOnline, pendingActions.length]);

  const initializeOfflineState = async () => {
    try {
      // Load pending actions from storage
      const storedActions = await storageService.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      const actions = storedActions ? JSON.parse(storedActions) : [];
      setPendingActions(actions);
      
      // Load last sync timestamp
      const lastSync = await storageService.getItem(STORAGE_KEYS.LAST_SYNC);
      const lastSyncTimestamp = lastSync ? parseInt(lastSync, 10) : 0;
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: lastSyncTimestamp,
        pendingActions: actions.length,
      }));
      
      // Get initial network state
      const netInfo = await NetInfo.fetch();
      const initialIsOnline = netInfo.isConnected && netInfo.isInternetReachable;
      setIsOnline(initialIsOnline || false);
      
    } catch (error) {
      console.error('Failed to initialize offline state:', error);
    }
  };

  const addOfflineAction = async (actionData: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    try {
      const action: OfflineAction = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...actionData,
      };
      
      const updatedActions = [...pendingActions, action];
      setPendingActions(updatedActions);
      
      // Store in persistent storage
      await storageService.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(updatedActions));
      
      setSyncStatus(prev => ({
        ...prev,
        pendingActions: updatedActions.length,
      }));
      
      // If online, try to sync immediately
      if (isOnline) {
        syncPendingActions();
      }
      
    } catch (error) {
      console.error('Failed to add offline action:', error);
      throw error;
    }
  };

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) {
      return;
    }

    try {
      console.log(`Syncing ${pendingActions.length} pending actions...`);
      
      const results = await offlineService.syncActions(pendingActions);
      
      // Remove successfully synced actions
      const failedActions = pendingActions.filter((action, index) => !results[index]);
      setPendingActions(failedActions);
      
      // Update storage
      await storageService.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(failedActions));
      
      // Update sync status
      const now = Date.now();
      await storageService.setItem(STORAGE_KEYS.LAST_SYNC, now.toString());
      
      setSyncStatus({
        isOnline,
        lastSync: now,
        pendingActions: failedActions.length,
      });
      
      const successCount = results.filter(Boolean).length;
      console.log(`Sync completed: ${successCount} successful, ${failedActions.length} failed`);
      
    } catch (error) {
      console.error('Failed to sync pending actions:', error);
    }
  };

  const clearPendingActions = async () => {
    try {
      setPendingActions([]);
      await storageService.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      
      setSyncStatus(prev => ({
        ...prev,
        pendingActions: 0,
      }));
      
    } catch (error) {
      console.error('Failed to clear pending actions:', error);
    }
  };

  const retryFailedActions = async () => {
    if (isOnline && pendingActions.length > 0) {
      await syncPendingActions();
    }
  };

  const contextValue: OfflineContextType = {
    isOnline,
    syncStatus,
    pendingActions,
    addOfflineAction,
    syncPendingActions,
    clearPendingActions,
    retryFailedActions,
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};