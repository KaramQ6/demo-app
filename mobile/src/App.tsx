import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

// Import contexts
import {AuthProvider} from '@/contexts/AuthContext';
import {I18nProvider} from '@/contexts/I18nContext';
import {OfflineProvider} from '@/contexts/OfflineContext';

// Import navigation
import AppNavigator from '@/navigation/AppNavigator';

// Import theme
import {lightTheme, darkTheme} from '@/theme/themes';

// Import services
import {initializeServices} from '@/services/initialization';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Initialize all services
    initializeServices();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <I18nProvider>
          <OfflineProvider>
            <AuthProvider>
              <NavigationContainer theme={theme}>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor={theme.colors.surface}
                />
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </OfflineProvider>
        </I18nProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;