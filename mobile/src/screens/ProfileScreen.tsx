import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Avatar,
  Card,
  Button,
  Divider,
  useTheme,
  Snackbar,
  List,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@/contexts/AuthContext';
import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {UserProfile} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const {t, changeLanguage, language} = useI18n();
  const {isOnline, syncStatus} = useOffline();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      if (isOnline) {
        const response = await apiService.getUserProfile();
        if (response.data) {
          setProfile(response.data);
        }
      } else {
        // Load from local storage or create default profile
        const defaultProfile: UserProfile = {
          id: user.id,
          preferences: {
            interests: [],
            budget: 'medium',
            travelsWith: 'Solo',
            language: language as 'en' | 'ar',
            notifications: true,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSnackbarMessage(t('auth.logoutSuccess'));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleLanguageToggle = async () => {
    try {
      const newLanguage = language === 'en' ? 'ar' : 'en';
      await changeLanguage(newLanguage);
      setSnackbarMessage(t('settings.languageChanged') || 'Language changed successfully');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  const getBudgetLabel = (budget: string) => {
    const key = `profile.budgetOptions.${budget}`;
    return t(key) !== key ? t(key) : budget;
  };

  const getTravelsWithLabel = (travelsWith: string) => {
    const key = `profile.travelsWithOptions.${travelsWith.toLowerCase()}`;
    return t(key) !== key ? t(key) : travelsWith;
  };

  if (!user) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.emptyState}>
          <Icon name="person-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyStateTitle, {color: theme.colors.onSurface}]}>
            {t('auth.loginRequired') || 'Login Required'}
          </Text>
          <Text style={[styles.emptyStateText, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.loginToViewProfile') || 'Please login to view your profile'}
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        
        {/* Profile Header */}
        <Card style={[styles.profileCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={getInitials(user.full_name)}
              style={{backgroundColor: theme.colors.primary}}
              labelStyle={{color: theme.colors.surface}}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, {color: theme.colors.onSurface}]}>
                {user.full_name || 'User'}
              </Text>
              <Text style={[styles.userEmail, {color: theme.colors.onSurfaceVariant}]}>
                {user.email}
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => {
                  setSnackbarMessage(t('profile.editFeatureComingSoon') || 'Edit profile feature coming soon!');
                  setSnackbarVisible(true);
                }}>
                {t('profile.editProfile')}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Travel Preferences */}
        {profile && (
          <Card style={[styles.section, {backgroundColor: theme.colors.surface}]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
                {t('profile.preferences')}
              </Text>
              
              <View style={styles.preferenceItem}>
                <Icon name="account-balance-wallet" size={24} color={theme.colors.primary} />
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, {color: theme.colors.onSurface}]}>
                    {t('profile.budget')}
                  </Text>
                  <Text style={[styles.preferenceValue, {color: theme.colors.onSurfaceVariant}]}>
                    {getBudgetLabel(profile.preferences.budget)}
                  </Text>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Icon name="group" size={24} color={theme.colors.secondary} />
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, {color: theme.colors.onSurface}]}>
                    {t('profile.travelsWith')}
                  </Text>
                  <Text style={[styles.preferenceValue, {color: theme.colors.onSurfaceVariant}]}>
                    {getTravelsWithLabel(profile.preferences.travelsWith)}
                  </Text>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Icon name="favorite" size={24} color={theme.colors.tertiary} />
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, {color: theme.colors.onSurface}]}>
                    {t('profile.interests')}
                  </Text>
                  <Text style={[styles.preferenceValue, {color: theme.colors.onSurfaceVariant}]}>
                    {profile.preferences.interests.length > 0 
                      ? profile.preferences.interests.join(', ')
                      : t('profile.noInterestsSet') || 'No interests set'
                    }
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Statistics */}
        <Card style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
              {t('profile.statistics')}
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: theme.colors.primary}]}>0</Text>
                <Text style={[styles.statLabel, {color: theme.colors.onSurfaceVariant}]}>
                  {t('profile.visitedPlaces')}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: theme.colors.secondary}]}>0</Text>
                <Text style={[styles.statLabel, {color: theme.colors.onSurfaceVariant}]}>
                  {t('profile.savedDestinations')}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, {color: theme.colors.tertiary}]}>0 km</Text>
                <Text style={[styles.statLabel, {color: theme.colors.onSurfaceVariant}]}>
                  {t('profile.totalDistance')}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
              {t('navigation.settings')}
            </Text>
          </Card.Content>
          
          <List.Item
            title={t('settings.language')}
            description={language === 'en' ? 'English' : 'العربية'}
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleLanguageToggle}
          />
          
          <Divider />
          
          <List.Item
            title={t('navigation.settings')}
            description={t('settings.appSettings') || 'App settings and preferences'}
            left={props => <List.Icon {...props} icon="settings" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings' as never)}
          />
          
          <Divider />
          
          <List.Item
            title={t('navigation.help')}
            description={t('settings.helpAndSupport') || 'Help and support'}
            left={props => <List.Icon {...props} icon="help" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              setSnackbarMessage(t('common.featureComingSoon') || 'Feature coming soon!');
              setSnackbarVisible(true);
            }}
          />
        </Card>

        {/* Sync Status */}
        {!isOnline && syncStatus.pendingActions > 0 && (
          <Card style={[styles.section, {backgroundColor: theme.colors.errorContainer}]}>
            <Card.Content>
              <View style={styles.syncInfo}>
                <Icon name="sync-problem" size={24} color={theme.colors.onErrorContainer} />
                <View style={styles.syncContent}>
                  <Text style={[styles.syncTitle, {color: theme.colors.onErrorContainer}]}>
                    {t('offline.syncPending', {count: syncStatus.pendingActions})}
                  </Text>
                  <Text style={[styles.syncDescription, {color: theme.colors.onErrorContainer}]}>
                    {t('offline.syncWhenOnline') || 'Changes will sync when you\'re back online'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            textColor={theme.colors.error}
            style={[styles.logoutButton, {borderColor: theme.colors.error}]}>
            {t('auth.logout')}
          </Button>
        </View>
      </ScrollView>

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
  profileCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  section: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceContent: {
    flex: 1,
    marginLeft: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncContent: {
    flex: 1,
    marginLeft: 12,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  syncDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    paddingVertical: 4,
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
  loginButton: {
    paddingHorizontal: 24,
  },
});

export default ProfileScreen;