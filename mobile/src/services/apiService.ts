import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import {API_CONFIG, STORAGE_KEYS} from '@/config/constants';
import {storageService} from './storageService';
import {
  ApiResponse,
  User,
  UserProfile,
  ItineraryItem,
  CreateItineraryItem,
  WeatherData,
  ChatResponse,
  Destination,
} from '@/types';

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.authToken) {
          this.authToken = await storageService.getItem(STORAGE_KEYS.USER_TOKEN);
        }
        
        if (this.authToken) {
          try {
            const tokenData = JSON.parse(this.authToken);
            config.headers.Authorization = `Bearer ${tokenData.access_token}`;
          } catch (error) {
            console.warn('Invalid token format:', error);
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized - token might be expired
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshed = await this.refreshAuthToken();
            if (refreshed) {
              // Retry the original request
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.handleAuthFailure();
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      const tokenData = await storageService.getItem(STORAGE_KEYS.USER_TOKEN);
      if (!tokenData) return false;

      const token = JSON.parse(tokenData);
      if (!token.refresh_token) return false;

      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/auth/refresh`, {
        refresh_token: token.refresh_token,
      });

      if (response.data.access_token) {
        const newTokenData = {
          ...token,
          access_token: response.data.access_token,
        };
        
        await storageService.setItem(STORAGE_KEYS.USER_TOKEN, JSON.stringify(newTokenData));
        this.authToken = JSON.stringify(newTokenData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async handleAuthFailure(): Promise<void> {
    // Clear stored auth data
    await storageService.removeItem(STORAGE_KEYS.USER_TOKEN);
    await storageService.removeItem(STORAGE_KEYS.USER_DATA);
    this.authToken = null;
    
    // In a real app, you might navigate to login screen here
    console.log('Authentication failed - user needs to login again');
  }

  private formatError(error: AxiosError): Error {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      message = data?.detail || data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Network error
      message = 'Network connection error';
    } else {
      // Request setup error
      message = error.message;
    }
    
    return new Error(message);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/health');
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/auth/login', {email, password});
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async register(email: string, password: string, fullName?: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get('/auth/me');
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Profile endpoints
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.client.get('/profile');
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.client.put('/profile', profileData);
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Itinerary endpoints
  async getItineraries(): Promise<ApiResponse<ItineraryItem[]>> {
    try {
      const response = await this.client.get('/itineraries');
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async createItinerary(itinerary: CreateItineraryItem): Promise<ApiResponse<ItineraryItem>> {
    try {
      const response = await this.client.post('/itineraries', itinerary);
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async updateItinerary(id: string, updates: Partial<ItineraryItem>): Promise<ApiResponse<ItineraryItem>> {
    try {
      const response = await this.client.put(`/itineraries/${id}`, updates);
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async deleteItinerary(id: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/itineraries/${id}`);
      return {data: undefined};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Weather endpoints
  async getCurrentWeather(lat?: number, lon?: number, lang?: string): Promise<ApiResponse<WeatherData>> {
    try {
      const params = new URLSearchParams();
      if (lat !== undefined) params.append('lat', lat.toString());
      if (lon !== undefined) params.append('lon', lon.toString());
      if (lang) params.append('lang', lang);

      const response = await this.client.get(`/weather/current?${params.toString()}`);
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Chat endpoints
  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await this.client.post('/chat/message', {message});
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Itinerary suggestion endpoint
  async getSuggestedItinerary(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/itinerary/suggest');
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Destinations endpoints (these would typically be separate API calls)
  async getDestinations(category?: string, search?: string): Promise<ApiResponse<Destination[]>> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      // For now, return mock data since we don't have this endpoint yet
      // In a real implementation, this would be: 
      // const response = await this.client.get(`/destinations?${params.toString()}`);
      
      const mockDestinations: Destination[] = [
        {
          id: 'petra',
          name: 'Petra',
          name_ar: 'البتراء',
          description: 'Ancient city carved into red sandstone cliffs',
          description_ar: 'مدينة أثرية محفورة في الصخر الرملي الأحمر',
          latitude: 30.3285,
          longitude: 35.4444,
          category: 'historical',
          image_url: 'https://example.com/petra.jpg',
          rating: 4.9,
          is_active: true,
          created_at: new Date().toISOString(),
        },
        // Add more mock destinations...
      ];

      return {data: mockDestinations};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  async getDestination(id: string): Promise<ApiResponse<Destination>> {
    try {
      // Mock implementation
      const mockDestination: Destination = {
        id,
        name: 'Petra',
        name_ar: 'البتراء',
        description: 'Ancient city carved into red sandstone cliffs',
        description_ar: 'مدينة أثرية محفورة في الصخر الرملي الأحمر',
        latitude: 30.3285,
        longitude: 35.4444,
        category: 'historical',
        image_url: 'https://example.com/petra.jpg',
        rating: 4.9,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      return {data: mockDestination};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }

  // Utility methods
  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  // Generic request method for custom endpoints
  async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
      });
      return {data: response.data};
    } catch (error) {
      return {error: (error as Error).message};
    }
  }
}

export const apiService = new ApiService();