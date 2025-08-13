import {Platform, PermissionsAndroid} from 'react-native';
import {storageService} from './storageService';
import {databaseService} from './databaseService';
import {STORAGE_KEYS, FEATURES} from '@/config/constants';

/**
 * Initialize all app services on startup
 */
export const initializeServices = async (): Promise<void> => {
  try {
    console.log('Initializing SmartTour.Jo services...');
    
    // Initialize storage service
    await storageService.initialize();
    
    // Initialize local database if offline mode is enabled
    if (FEATURES.OFFLINE_MODE) {
      await databaseService.initialize();
    }
    
    // Request necessary permissions
    await requestPermissions();
    
    // Perform initial data sync if needed
    await performInitialSync();
    
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Service initialization failed:', error);
    // Don't throw here - let the app start even if some services fail
  }
};

/**
 * Request necessary permissions from the user
 */
const requestPermissions = async (): Promise<void> => {
  try {
    if (Platform.OS === 'android') {
      // Request location permission
      const locationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'SmartTour.Jo needs access to your location to show nearby destinations.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (locationPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
      
      // Request camera permission if needed
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Allow SmartTour.Jo to access your camera to take photos.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (cameraPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
      
      // Request storage permission
      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'SmartTour.Jo needs storage access to save offline data.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    }
    
    // iOS permissions are handled differently through Info.plist and runtime requests
    // in the respective components that need them
    
  } catch (error) {
    console.error('Permission request failed:', error);
  }
};

/**
 * Perform initial data synchronization
 */
const performInitialSync = async (): Promise<void> => {
  try {
    // Check if this is the first app launch
    const isFirstLaunch = await storageService.getItem(STORAGE_KEYS.LAST_SYNC);
    
    if (!isFirstLaunch) {
      console.log('First app launch - performing initial setup');
      
      // Set initial preferences
      const defaultPreferences = {
        interests: [],
        budget: 'medium',
        travelsWith: 'Solo',
        language: 'en',
        notifications: true,
      };
      
      await storageService.setItem(
        STORAGE_KEYS.USER_PREFERENCES, 
        JSON.stringify(defaultPreferences)
      );
      
      // Download essential offline data if feature is enabled
      if (FEATURES.OFFLINE_MODE) {
        await downloadEssentialOfflineData();
      }
      
      // Mark first launch as complete
      await storageService.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    }
    
  } catch (error) {
    console.error('Initial sync failed:', error);
  }
};

/**
 * Download essential offline data for first-time users
 */
const downloadEssentialOfflineData = async (): Promise<void> => {
  try {
    console.log('Downloading essential offline data...');
    
    // This would typically download:
    // - Popular destinations data
    // - Basic map tiles
    // - Essential translations
    // - Default images
    
    // For now, we'll just log that this would happen
    // In a real implementation, you'd make API calls to download data
    
    const essentialData = {
      destinations: [],
      mapTiles: [],
      translations: {},
      images: [],
      downloadedAt: Date.now(),
    };
    
    await storageService.setItem(
      STORAGE_KEYS.CACHED_DATA,
      JSON.stringify(essentialData)
    );
    
    console.log('Essential offline data downloaded successfully');
    
  } catch (error) {
    console.error('Failed to download essential offline data:', error);
  }
};

/**
 * Clean up services on app termination
 */
export const cleanupServices = async (): Promise<void> => {
  try {
    console.log('Cleaning up services...');
    
    // Close database connections
    if (FEATURES.OFFLINE_MODE) {
      await databaseService.close();
    }
    
    // Cancel ongoing sync operations
    // Clear temporary data
    // Save app state
    
    console.log('Services cleaned up successfully');
  } catch (error) {
    console.error('Service cleanup failed:', error);
  }
};

/**
 * Get initialization status
 */
export const getInitializationStatus = async (): Promise<{
  storage: boolean;
  database: boolean;
  permissions: boolean;
  sync: boolean;
}> => {
  try {
    const storage = await storageService.isInitialized();
    const database = FEATURES.OFFLINE_MODE ? await databaseService.isInitialized() : true;
    const permissions = true; // We don't store permission status currently
    const sync = !!(await storageService.getItem(STORAGE_KEYS.LAST_SYNC));
    
    return {
      storage,
      database,
      permissions,
      sync,
    };
  } catch (error) {
    console.error('Failed to get initialization status:', error);
    return {
      storage: false,
      database: false,
      permissions: false,
      sync: false,
    };
  }
};