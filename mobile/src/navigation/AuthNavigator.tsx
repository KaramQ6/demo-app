import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-paper';
import {useI18n} from '@/contexts/I18nContext';

// Import screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

// Import types
import {AuthStackParamList} from '@/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: t('auth.resetPassword'),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;