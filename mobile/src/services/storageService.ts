import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private initialized = false;

  async initialize(): Promise<void> {
    try {
      // Test AsyncStorage availability
      await AsyncStorage.getItem('test');
      this.initialized = true;
      console.log('Storage service initialized successfully');
    } catch (error) {
      console.error('Storage service initialization failed:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys]; // Convert readonly array to mutable array
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return [];
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to remove multiple items:', error);
      throw error;
    }
  }

  // Utility methods for common operations
  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to set object ${key}:`, error);
      throw error;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to get object ${key}:`, error);
      return null;
    }
  }

  async setNumber(key: string, value: number): Promise<void> {
    try {
      await this.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to set number ${key}:`, error);
      throw error;
    }
  }

  async getNumber(key: string): Promise<number | null> {
    try {
      const value = await this.getItem(key);
      return value != null ? parseFloat(value) : null;
    } catch (error) {
      console.error(`Failed to get number ${key}:`, error);
      return null;
    }
  }

  async setBoolean(key: string, value: boolean): Promise<void> {
    try {
      await this.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to set boolean ${key}:`, error);
      throw error;
    }
  }

  async getBoolean(key: string): Promise<boolean | null> {
    try {
      const value = await this.getItem(key);
      return value != null ? value === 'true' : null;
    } catch (error) {
      console.error(`Failed to get boolean ${key}:`, error);
      return null;
    }
  }

  // Advanced operations
  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      const items = await this.multiGet(keys);
      let totalSize = 0;
      
      items.forEach(([key, value]) => {
        if (value) {
          totalSize += key.length + value.length;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }

  async clearUserData(): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const userDataKeys = allKeys.filter(key => 
        key.startsWith('user_') || 
        key.startsWith('auth_') ||
        key.startsWith('profile_')
      );
      
      if (userDataKeys.length > 0) {
        await this.multiRemove(userDataKeys);
      }
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  }

  async clearCacheData(): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const cacheKeys = allKeys.filter(key => 
        key.startsWith('cache_') || 
        key.startsWith('temp_')
      );
      
      if (cacheKeys.length > 0) {
        await this.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Failed to clear cache data:', error);
      throw error;
    }
  }

  // Key existence check
  async hasKey(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Failed to check key existence ${key}:`, error);
      return false;
    }
  }

  // Batch operations with error handling
  async batchOperation<T>(
    operations: Array<() => Promise<T>>
  ): Promise<Array<T | Error>> {
    const results: Array<T | Error> = [];
    
    for (const operation of operations) {
      try {
        const result = await operation();
        results.push(result);
      } catch (error) {
        results.push(error as Error);
      }
    }
    
    return results;
  }

  // Storage cleanup based on age
  async cleanupExpiredData(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const expiredKeys: string[] = [];
      const now = Date.now();
      
      for (const key of allKeys) {
        if (key.includes('_timestamp_')) {
          const timestampValue = await this.getItem(key);
          if (timestampValue) {
            const timestamp = parseInt(timestampValue, 10);
            if (now - timestamp > maxAge) {
              const dataKey = key.replace('_timestamp_', '_data_');
              expiredKeys.push(key, dataKey);
            }
          }
        }
      }
      
      if (expiredKeys.length > 0) {
        await this.multiRemove(expiredKeys);
        console.log(`Cleaned up ${expiredKeys.length} expired items`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired data:', error);
    }
  }
}

export const storageService = new StorageService();