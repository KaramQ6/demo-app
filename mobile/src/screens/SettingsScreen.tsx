import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  List,
  Switch,
  Divider,
  useTheme,
  Snackbar,
  Button,
  Dialog,
  Portal,
} from 'react-native-paper';

import {useI18n} from '@/contexts/I18nContext';
import {useOffline} from '@/contexts/OfflineContext';
import {storageService} from '@/services/storageService';
import {offlineService} from '@/services/offlineService';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const {t, changeLanguage, language} = useI18n();
  const {syncStatus, syncPendingActions, clearPendingActions} = useOffline();

  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);

  const handleLanguageChange = async () => {
    try {
      const newLanguage = language === 'en' ? 'ar' : 'en';
      await changeLanguage(newLanguage);
      setSnackbarMessage(t('settings.settingsUpdated'));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    setSnackbarMessage(t('settings.settingsUpdated'));
    setSnackbarVisible(true);
  };

  const handleAutoSyncToggle = (value: boolean) => {
    setAutoSync(value);
    setSnackbarMessage(t('settings.settingsUpdated'));
    setSnackbarVisible(true);
  };

  const handleClearCache = async () => {
    try {
      await storageService.clearCacheData();
      await offlineService.performMaintenance();
      setSnackbarMessage(t('settings.dataCleared'));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleClearOfflineData = async () => {
    try {
      await offlineService.clearOfflineData();
      setClearDataDialogVisible(false);
      setSnackbarMessage(t('settings.dataCleared'));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleSyncNow = async () => {
    try {
      await syncPendingActions();
      setSnackbarMessage(t('offline.syncCompleted'));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('offline.syncFailed'));
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView>
        {/* General Settings */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('settings.general') || 'General'}
          </Text>
          
          <List.Item
            title={t('settings.language')}
            description={language === 'en' ? 'English' : 'العربية'}
            left={props => <List.Icon {...props} icon="translate" />}
            right={() => (
              <Button mode="text" onPress={handleLanguageChange}>
                {t('common.change') || 'Change'}
              </Button>
            )}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.pushNotifications')}
            description={t('settings.receiveNotifications') || 'Receive push notifications'}
            left={props => <List.Icon {...props} icon="notifications" />}
            right={() => (
              <Switch 
                value={notifications} 
                onValueChange={handleNotificationToggle}
              />
            )}
          />
        </View>

        {/* Data & Sync Settings */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('settings.data')}
          </Text>
          
          <List.Item
            title={t('settings.autoSync')}
            description={t('settings.autoSyncDescription') || 'Automatically sync data when online'}
            left={props => <List.Icon {...props} icon="sync" />}
            right={() => (
              <Switch 
                value={autoSync} 
                onValueChange={handleAutoSyncToggle}
              />
            )}
          />
          
          <Divider />
          
          {syncStatus.pendingActions > 0 && (
            <>
              <List.Item
                title={t('offline.syncNow')}
                description={t('offline.syncPending', {count: syncStatus.pendingActions})}
                left={props => <List.Icon {...props} icon="sync" />}
                onPress={handleSyncNow}
              />
              <Divider />
            </>
          )}
          
          <List.Item
            title={t('settings.clearCache')}
            description={t('settings.clearCacheDescription') || 'Clear temporary files and cache'}
            left={props => <List.Icon {...props} icon="delete-sweep" />}
            onPress={handleClearCache}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.downloadOfflineData')}
            description={t('settings.downloadForOfflineUse') || 'Download data for offline use'}
            left={props => <List.Icon {...props} icon="download" />}
            onPress={async () => {
              try {
                await offlineService.downloadOfflineData();
                setSnackbarMessage(t('offline.offlineDataReady'));
                setSnackbarVisible(true);
              } catch (error) {
                setSnackbarMessage(t('errors.downloadFailed') || 'Download failed');
                setSnackbarVisible(true);
              }
            }}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.clearOfflineData')}
            description={t('settings.clearOfflineDataDescription') || 'Clear all offline data'}
            left={props => <List.Icon {...props} icon="delete-forever" />}
            onPress={() => setClearDataDialogVisible(true)}
          />
        </View>

        {/* Privacy Settings */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('settings.privacy')}
          </Text>
          
          <List.Item
            title={t('settings.locationServices')}
            description={t('settings.locationServicesDescription') || 'Allow location access for better recommendations'}
            left={props => <List.Icon {...props} icon="location-on" />}
            right={() => <Switch value={true} disabled />}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.dataUsage')}
            description={t('settings.dataUsageDescription') || 'View data usage statistics'}
            left={props => <List.Icon {...props} icon="data-usage" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              setSnackbarMessage(t('common.featureComingSoon') || 'Feature coming soon!');
              setSnackbarVisible(true);
            }}
          />
        </View>

        {/* About */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.onSurface}]}>
            {t('settings.about')}
          </Text>
          
          <List.Item
            title={t('settings.version')}
            description="1.0.0"
            left={props => <List.Icon {...props} icon="info" />}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.termsOfService')}
            description={t('settings.readTerms') || 'Read our terms of service'}
            left={props => <List.Icon {...props} icon="description" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              setSnackbarMessage(t('common.featureComingSoon') || 'Feature coming soon!');
              setSnackbarVisible(true);
            }}
          />
          
          <Divider />
          
          <List.Item
            title={t('settings.privacyPolicy')}
            description={t('settings.readPrivacyPolicy') || 'Read our privacy policy'}
            left={props => <List.Icon {...props} icon="shield" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              setSnackbarMessage(t('common.featureComingSoon') || 'Feature coming soon!');
              setSnackbarVisible(true);
            }}
          />
        </View>
      </ScrollView>

      {/* Clear Data Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={clearDataDialogVisible} 
          onDismiss={() => setClearDataDialogVisible(false)}>
          <Dialog.Title>
            {t('settings.clearOfflineData')}
          </Dialog.Title>
          <Dialog.Content>
            <Text>
              {t('settings.clearOfflineDataConfirmation') || 
               'This will delete all offline data including cached destinations, itineraries, and chat history. This action cannot be undone.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDataDialogVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button onPress={handleClearOfflineData} textColor={theme.colors.error}>
              {t('common.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  section: {
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
});

export default SettingsScreen;