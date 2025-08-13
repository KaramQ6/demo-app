import {createClient, SupabaseClient, Session, User} from '@supabase/supabase-js';
import {SUPABASE_CONFIG} from '@/config/constants';
import {LoginCredentials, RegisterCredentials} from '@/types';

interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.ANON_KEY
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const {data} = await this.supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {data} = await this.supabase.auth.getUser();
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token refresh failed.',
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const {error} = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Password reset failed. Please try again.',
      };
    }
  }

  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Password update failed. Please try again.',
      };
    }
  }

  async updateProfile(updates: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  }): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed. Please try again.',
      };
    }
  }

  async verifySession(sessionData: any): Promise<boolean> {
    try {
      if (!sessionData || !sessionData.access_token) {
        return false;
      }

      // Set the session and verify
      const {data, error} = await this.supabase.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      });

      return !error && !!data.user;
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  }

  // OAuth methods
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // OAuth doesn't immediately return user data
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Google sign-in failed. Please try again.',
      };
    }
  }

  async signInWithFacebook(): Promise<AuthResult> {
    try {
      const {data, error} = await this.supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Facebook sign-in failed. Please try again.',
      };
    }
  }

  // Auth state listener
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Utility methods
  isLoggedIn(): boolean {
    return !!this.supabase.auth.getSession();
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}

export const authService = new AuthService();