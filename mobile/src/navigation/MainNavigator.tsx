import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useI18n} from '@/contexts/I18nContext';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import DestinationsScreen from '@/screens/DestinationsScreen';
import DestinationDetailScreen from '@/screens/DestinationDetailScreen';
import ItineraryScreen from '@/screens/ItineraryScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import MoreScreen from '@/screens/MoreScreen';
import WeatherScreen from '@/screens/WeatherScreen';
import ChatScreen from '@/screens/ChatScreen';
import SettingsScreen from '@/screens/SettingsScreen';

// Import types
import {MainTabParamList, RootStackParamList} from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Destinations Stack Navigator
const DestinationsStackNavigator: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen
        name="Destinations"
        component={DestinationsScreen}
        options={{
          title: t('navigation.destinations'),
        }}
      />
      <Stack.Screen
        name="DestinationDetail"
        component={DestinationDetailScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

// More Stack Navigator  
const MoreStackNavigator: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: t('navigation.more'),
        }}
      />
      <Stack.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: t('navigation.weather'),
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t('navigation.chat'),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('navigation.settings'),
        }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  const theme = useTheme();
  const {t, isRTL} = useI18n();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Destinations':
              iconName = 'place';
              break;
            case 'Itinerary':
              iconName = 'list';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'More':
              iconName = 'more-horiz';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        tabBarItemStyle: {
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('navigation.home'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Destinations"
        component={DestinationsStackNavigator}
        options={{
          title: t('navigation.destinations'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{
          title: t('navigation.itinerary'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('navigation.profile'),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStackNavigator}
        options={{
          title: t('navigation.more'),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator (wraps tab navigator to handle full-screen modals)
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      {/* Add modal screens here if needed */}
    </Stack.Navigator>
  );
};

export default MainNavigator;