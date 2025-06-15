// TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const iconName =
          route.name === 'HomeTab'
            ? 'home'
            : route.name === 'NotificationsTab'
            ? 'notifications'
            : 'help-outline';

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
    })}>
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="NotificationsTab"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
