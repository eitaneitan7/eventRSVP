import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SplashScreen from '@/screens/SplashScreen';
import HomeScreen from '@/screens/HomeScreen';
import EventDetailsScreen from '@/screens/EventDetailsScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['frontend://'],
  config: {
    screens: {
      Splash: 'splash',
      Home: 'home',
      EventDetails: 'event/:id',
    },
  },
};
const Navigation = () => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
