import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {AuthState, User, LoginCredentials, RegisterCredentials} from '@/types';
import {authService} from '@/services/authService';
import {storageService} from '@/services/storageService';
import {STORAGE_KEYS} from '@/config/constants';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({...prev, loading: true, error: null}));
      
      // Try to get stored session
      const storedSession = await storageService.getItem(STORAGE_KEYS.USER_TOKEN);
      const storedUser = await storageService.getItem(STORAGE_KEYS.USER_DATA);
      
      if (storedSession && storedUser) {
        // Verify session is still valid
        const isValid = await authService.verifySession(storedSession);
        
        if (isValid) {
          setAuthState({
            user: JSON.parse(storedUser),
            session: JSON.parse(storedSession),
            loading: false,
            error: null,
          });
          return;
        } else {
          // Clear invalid session
          await clearStoredAuth();
        }
      }
      
      setAuthState(prev => ({...prev, loading: false}));
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: 'Failed to initialize authentication',
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({...prev, loading: true, error: null}));
      
      const result = await authService.login(credentials);
      
      if (result.success && result.user && result.session) {
        // Store auth data
        await storageService.setItem(STORAGE_KEYS.USER_TOKEN, JSON.stringify(result.session));
        await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user));
        
        setAuthState({
          user: result.user as User, // Type assertion to handle Supabase User compatibility
          session: result.session,
          loading: false,
          error: null,
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Login failed',
        }));
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Login failed. Please try again.',
      }));
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({...prev, loading: true, error: null}));
      
      const result = await authService.register(credentials);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          session: result.session || null,
          loading: false,
          error: null,
        });
        
        if (result.session) {
          await storageService.setItem(STORAGE_KEYS.USER_TOKEN, JSON.stringify(result.session));
          await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user));
        }
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Registration failed',
        }));
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Registration failed. Please try again.',
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({...prev, loading: true}));
      
      // Call logout API
      await authService.logout();
      
      // Clear stored auth data
      await clearStoredAuth();
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local data
      await clearStoredAuth();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!authState.session) return false;
      
      const result = await authService.refreshToken(authState.session.refresh_token);
      
      if (result.success && result.session) {
        await storageService.setItem(STORAGE_KEYS.USER_TOKEN, JSON.stringify(result.session));
        
        setAuthState(prev => ({
          ...prev,
          session: result.session,
          error: null,
        }));
        
        return true;
      } else {
        // Refresh failed, logout
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = {...authState.user, ...userData};
      setAuthState(prev => ({...prev, user: updatedUser}));
      storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
  };

  const clearStoredAuth = async () => {
    await storageService.removeItem(STORAGE_KEYS.USER_TOKEN);
    await storageService.removeItem(STORAGE_KEYS.USER_DATA);
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};