import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';

const MoreScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useI18n();
  const {isOnline, syncStatus} = useOffline();

  const menuItems = [
    {
      title: t('navigation.weather'),
      description: t('weather.currentWeather'),
      icon: 'wb-sunny',
      route: 'Weather',
      requiresOnline: false,
    },
    {
      title: t('navigation.chat'),
      description: t('chat.title'),
      icon: 'smart-toy',
      route: 'Chat',
      requiresOnline: true,
    },
    {
      title: t('navigation.settings'),
      description: t('settings.appSettings') || 'App settings and preferences',
      icon: 'settings',
      route: 'Settings',
      requiresOnline: false,
    },
    {
      title: t('settings.offlineData'),
      description: t('offline.offlineDataManagement') || 'Manage offline data',
      icon: 'offline-bolt',
      route: 'OfflineData',
      requiresOnline: false,
    },
    {
      title: t('navigation.about'),
      description: t('settings.aboutApp') || 'About SmartTour.Jo',
      icon: 'info',
      route: 'About',
      requiresOnline: false,
    },
    {
      title: t('navigation.help'),
      description: t('settings.helpAndSupport') || 'Help and support',
      icon: 'help',
      route: 'Help',
      requiresOnline: false,
    },
    {
      title: t('navigation.feedback'),
      description: t('settings.sendFeedback') || 'Send feedback',
      icon: 'feedback',
      route: 'Feedback',
      requiresOnline: true,
    },
  ];

  const handleItemPress = (item: typeof menuItems[0]) => {
    if (item.requiresOnline && !isOnline) {
      // Show offline message
      return;
    }
    
    navigation.navigate(item.route as never);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView>
        {/* Offline Status */}
        {!isOnline && (
          <View style={[styles.statusCard, {backgroundColor: theme.colors.errorContainer}]}>
            <Text style={[styles.statusTitle, {color: theme.colors.onErrorContainer}]}>
              {t('offline.offlineMode')}
            </Text>
            <Text style={[styles.statusDescription, {color: theme.colors.onErrorContainer}]}>
              {t('offline.limitedFunctionalityOffline') || 'Some features may be limited while offline'}
            </Text>
            {syncStatus.pendingActions > 0 && (
              <Text style={[styles.statusSync, {color: theme.colors.onErrorContainer}]}>
                {t('offline.syncPending', {count: syncStatus.pendingActions})}
              </Text>
            )}
          </View>
        )}

        {/* Main Menu */}
        <View style={[styles.menuSection, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('common.explore') || 'Explore'}
          </Text>
          
          {menuItems.slice(0, 2).map((item, index) => (
            <View key={item.route}>
              <List.Item
                title={item.title}
                description={item.description}
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={item.icon}
                    color={item.requiresOnline && !isOnline 
                      ? theme.colors.onSurfaceVariant 
                      : theme.colors.primary
                    }
                  />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handleItemPress(item)}
                disabled={item.requiresOnline && !isOnline}
                style={item.requiresOnline && !isOnline ? styles.disabledItem : undefined}
              />
              {index < 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Settings Menu */}
        <View style={[styles.menuSection, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('navigation.settings')}
          </Text>
          
          {menuItems.slice(2, 4).map((item, index) => (
            <View key={item.route}>
              <List.Item
                title={item.title}
                description={item.description}
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={item.icon}
                    color={theme.colors.primary}
                  />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handleItemPress(item)}
              />
              {index < 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Support Menu */}
        <View style={[styles.menuSection, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('navigation.support') || 'Support'}
          </Text>
          
          {menuItems.slice(4).map((item, index) => (
            <View key={item.route}>
              <List.Item
                title={item.title}
                description={item.description}
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={item.icon}
                    color={item.requiresOnline && !isOnline 
                      ? theme.colors.onSurfaceVariant 
                      : theme.colors.secondary
                    }
                  />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handleItemPress(item)}
                disabled={item.requiresOnline && !isOnline}
                style={item.requiresOnline && !isOnline ? styles.disabledItem : undefined}
              />
              {index < 2 && <Divider />}
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, {color: theme.colors.onSurfaceVariant}]}>
            SmartTour.Jo v1.0.0
          </Text>
          <Text style={[styles.appDescription, {color: theme.colors.onSurfaceVariant}]}>
            {t('home.subtitle')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusSync: {
    fontSize: 12,
    opacity: 0.8,
  },
  menuSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default MoreScreen;