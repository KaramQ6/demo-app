import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '@/contexts/AuthContext';
import {useI18n} from '@/contexts/I18nContext';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Import screens
import SplashScreen from '@/screens/SplashScreen';

// Import types
import {RootStackParamList} from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const {user, loading} = useAuth();
  const {loading: i18nLoading} = useI18n();

  // Show splash screen while loading
  if (loading || i18nLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {user ? (
        // User is authenticated
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        // User is not authenticated
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;