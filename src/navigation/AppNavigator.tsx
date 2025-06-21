import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants';
import type { RootStackParamList, BottomTabParamList } from '../types';

// Import screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import TokenListScreen from '../screens/TokenList/TokenListScreen';
import TokenDetailScreen from '../screens/TokenDetail/TokenDetailScreen';
import PortfolioScreen from '../screens/Portfolio/PortfolioScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundSecondary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8), // Ensure proper safe area handling
          height: 60 + Math.max(insets.bottom, 0), // Adjust height for safe area
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Tokens':
              iconName = 'list';
              break;
            case 'Portfolio':
              iconName = 'account-balance-wallet';
              break;
            case 'Search':
              iconName = 'search';
              break;
            default:
              iconName = 'help';
          }

          return (
            <Icon 
              name={iconName} 
              size={24} 
              color={color}
              style={{
                textShadowColor: focused ? COLORS.primary : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: focused ? 3 : 0,
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Tokens" 
        component={TokenListScreen}
        options={{ tabBarLabel: 'Tokens' }}
      />
      <Tab.Screen 
        name="Search" 
        component={TokenListScreen} // Reuse token list with search mode
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ tabBarLabel: 'Portfolio' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.primary,
          background: COLORS.background,
          card: COLORS.backgroundSecondary,
          text: COLORS.textPrimary,
          border: COLORS.border,
          notification: COLORS.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '700',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.backgroundSecondary,
            borderBottomColor: COLORS.border,
            borderBottomWidth: 1,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TokenDetail" 
          component={TokenDetailScreen}
          options={{
            title: 'Token Details',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 