import SQLite from 'react-native-sqlite-storage';
import {
  Destination,
  ItineraryItem,
  WeatherData,
  ChatMessage,
  UserProfile,
} from '@/types';

// Enable promise API and debugging
SQLite.enablePromise(true);
SQLite.DEBUG(false);

interface DatabaseTables {
  destinations: Destination;
  itineraries: ItineraryItem;
  weather_cache: WeatherData & {cached_at: string};
  chat_messages: ChatMessage & {synced: boolean};
  user_profiles: UserProfile;
  sync_queue: {
    id: string;
    table_name: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    data: string;
    created_at: string;
    synced: boolean; // Changed from number to boolean
  };
}

class DatabaseService {
  private db: SQLite.Database | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'SmartTourJo.db',
        location: 'default',
        createFromLocation: '~SmartTourJo.db',
      });

      await this.createTables();
      this.initialized = true;
      console.log('Database service initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.initialized = false;
      console.log('Database closed');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Destinations table
      `CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_ar TEXT,
        description TEXT,
        description_ar TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT,
        image_url TEXT,
        rating REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        cached_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,

      // Itineraries table
      `CREATE TABLE IF NOT EXISTS itineraries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        destination_id TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        destination_type TEXT,
        destination_icon TEXT,
        notes TEXT,
        status TEXT DEFAULT 'planned',
        visit_date TEXT,
        priority INTEGER DEFAULT 1,
        added_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      )`,

      // Weather cache table
      `CREATE TABLE IF NOT EXISTS weather_cache (
        id TEXT PRIMARY KEY,
        city_name TEXT NOT NULL,
        temperature REAL NOT NULL,
        humidity REAL,
        pressure REAL,
        description TEXT,
        wind_speed REAL,
        latitude REAL,
        longitude REAL,
        source TEXT DEFAULT 'api',
        cached_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,

      // Chat messages table
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      )`,

      // User profiles table
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        preferences TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      )`,

      // Sync queue table
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        action TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        synced INTEGER DEFAULT 0
      )`,
    ];

    for (const table of tables) {
      await this.db.executeSql(table);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category)',
      'CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations(latitude, longitude)',
      'CREATE INDEX IF NOT EXISTS idx_itineraries_user ON itineraries(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status)',
      'CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_cache(latitude, longitude)',
      'CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced)',
    ];

    for (const index of indexes) {
      await this.db.executeSql(index);
    }
  }

  // Generic CRUD operations
  async insert<T extends keyof DatabaseTables>(
    table: T,
    data: Partial<DatabaseTables[T]>
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    try {
      await this.db.executeSql(sql, values);
    } catch (error) {
      console.error(`Insert into ${table} failed:`, error);
      throw error;
    }
  }

  async update<T extends keyof DatabaseTables>(
    table: T,
    data: Partial<DatabaseTables[T]>,
    where: string,
    whereArgs: any[] = []
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    
    try {
      await this.db.executeSql(sql, [...values, ...whereArgs]);
    } catch (error) {
      console.error(`Update ${table} failed:`, error);
      throw error;
    }
  }

  async delete<T extends keyof DatabaseTables>(
    table: T,
    where: string,
    whereArgs: any[] = []
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `DELETE FROM ${table} WHERE ${where}`;
    
    try {
      await this.db.executeSql(sql, whereArgs);
    } catch (error) {
      console.error(`Delete from ${table} failed:`, error);
      throw error;
    }
  }

  async select<T extends keyof DatabaseTables>(
    table: T,
    columns: string = '*',
    where?: string,
    whereArgs: any[] = [],
    orderBy?: string,
    limit?: number
  ): Promise<DatabaseTables[T][]> {
    if (!this.db) throw new Error('Database not initialized');

    let sql = `SELECT ${columns} FROM ${table}`;
    const args: any[] = [];

    if (where) {
      sql += ` WHERE ${where}`;
      args.push(...whereArgs);
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    try {
      const [results] = await this.db.executeSql(sql, args);
      const items: DatabaseTables[T][] = [];
      
      for (let i = 0; i < results.rows.length; i++) {
        items.push(results.rows.item(i));
      }
      
      return items;
    } catch (error) {
      console.error(`Select from ${table} failed:`, error);
      throw error;
    }
  }

  // Specific methods for destinations
  async getDestinations(category?: string, search?: string): Promise<Destination[]> {
    let where = 'is_active = 1';
    const args: any[] = [];

    if (category && category !== 'all') {
      where += ' AND category = ?';
      args.push(category);
    }

    if (search) {
      where += ' AND (name LIKE ? OR name_ar LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      args.push(searchTerm, searchTerm, searchTerm);
    }

    return this.select('destinations', '*', where, args, 'name ASC');
  }

  async getDestination(id: string): Promise<Destination | null> {
    const results = await this.select('destinations', '*', 'id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async cacheDestinations(destinations: Destination[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.transaction(async (tx) => {
        for (const destination of destinations) {
          const destinationWithCache = {
            ...destination,
            cached_at: new Date().toISOString(),
          };
          
          // Use INSERT OR REPLACE for upsert behavior
          const keys = Object.keys(destinationWithCache);
          const values = Object.values(destinationWithCache);
          const placeholders = keys.map(() => '?').join(', ');
          
          const sql = `INSERT OR REPLACE INTO destinations (${keys.join(', ')}) VALUES (${placeholders})`;
          await tx.executeSql(sql, values);
        }
      });
    } catch (error) {
      console.error('Cache destinations failed:', error);
      throw error;
    }
  }

  // Specific methods for itineraries
  async getUserItineraries(userId: string): Promise<ItineraryItem[]> {
    return this.select('itineraries', '*', 'user_id = ?', [userId], 'added_at DESC');
  }

  async addToItinerary(itinerary: ItineraryItem): Promise<void> {
    const itineraryWithSync = {
      ...itinerary,
      synced: 0,
    };
    await this.insert('itineraries', itineraryWithSync);
    
    // Add to sync queue
    await this.addToSyncQueue('itineraries', 'INSERT', itinerary);
  }

  async updateItinerary(id: string, updates: Partial<ItineraryItem>): Promise<void> {
    const updatesWithSync = {
      ...updates,
      synced: 0,
    };
    await this.update('itineraries', updatesWithSync, 'id = ?', [id]);
    
    // Add to sync queue
    await this.addToSyncQueue('itineraries', 'UPDATE', {id, ...updates});
  }

  async removeFromItinerary(id: string): Promise<void> {
    await this.delete('itineraries', 'id = ?', [id]);
    
    // Add to sync queue
    await this.addToSyncQueue('itineraries', 'DELETE', {id});
  }

  // Weather cache methods
  async getCachedWeather(lat: number, lon: number, maxAge: number = 30 * 60 * 1000): Promise<WeatherData | null> {
    const cutoffTime = new Date(Date.now() - maxAge).toISOString();
    const results = await this.select(
      'weather_cache',
      '*',
      'latitude = ? AND longitude = ? AND cached_at > ?',
      [lat, lon, cutoffTime],
      'cached_at DESC',
      1
    );
    
    return results.length > 0 ? results[0] : null;
  }

  async cacheWeather(weather: WeatherData): Promise<void> {
    const weatherWithCache = {
      ...weather,
      id: `weather_${weather.latitude}_${weather.longitude}_${Date.now()}`,
      cached_at: new Date().toISOString(),
    };
    
    await this.insert('weather_cache', weatherWithCache);
  }

  // Chat messages methods
  async getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return this.select('chat_messages', '*', undefined, [], 'timestamp ASC', limit);
  }

  async saveChatMessage(message: ChatMessage): Promise<void> {
    const messageWithSync = {
      ...message,
      synced: false, // Use boolean instead of number
    };
    await this.insert('chat_messages', messageWithSync);
  }

  // Sync queue methods
  async addToSyncQueue(tableName: string, action: 'INSERT' | 'UPDATE' | 'DELETE', data: any): Promise<void> {
    const syncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table_name: tableName,
      action,
      data: JSON.stringify(data),
      created_at: new Date().toISOString(),
      synced: false, // Use boolean instead of number
    };
    
    await this.insert('sync_queue', syncItem);
  }

  async getPendingSyncItems(): Promise<DatabaseTables['sync_queue'][]> {
    return this.select('sync_queue', '*', 'synced = 0', [], 'created_at ASC');
  }

  async markSyncItemCompleted(id: string): Promise<void> {
    await this.update('sync_queue', {synced: true}, 'id = ?', [id]); // Use boolean instead of number
  }

  async clearCompletedSyncItems(): Promise<void> {
    await this.delete('sync_queue', 'synced = 1');
  }

  // Database maintenance
  async vacuum(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql('VACUUM');
  }

  async getDatabaseSize(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const [results] = await this.db.executeSql('PRAGMA page_count');
      const pageCount = results.rows.item(0).page_count;
      
      const [pageSizeResults] = await this.db.executeSql('PRAGMA page_size');
      const pageSize = pageSizeResults.rows.item(0).page_size;
      
      return pageCount * pageSize;
    } catch (error) {
      console.error('Failed to get database size:', error);
      return 0;
    }
  }

  async clearExpiredCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoffTime = new Date(Date.now() - maxAge).toISOString();
    
    await this.delete('weather_cache', 'cached_at < ?', [cutoffTime]);
    await this.delete('destinations', 'cached_at < ?', [cutoffTime]);
  }
}

export const databaseService = new DatabaseService();