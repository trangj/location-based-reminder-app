import React from 'react'
import GroupNavigator from './GroupNavigator';
import SettingsScreen from '../screens/tabs/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'
import ChangeGroupNavigator from './ChangeGroupNavigator';
import MainScreen from '../screens/tabs/MainScreen';

const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator initialRouteName='MainNavigator'>
      <Tabs.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false, title: "Map", tabBarIcon: ({color, size}) => <Ionicons name='navigate-circle' color={color} size={size} />}} />
      <Tabs.Screen name="GroupNavigator" component={GroupNavigator} options={{ headerShown: false, title: "Current Group", tabBarIcon: ({color, size}) => <Ionicons name='people' color={color} size={size} />}} />
      <Tabs.Screen name="ChangeGroupNavigator" component={ChangeGroupNavigator} options={{ headerShown: false, title: 'Change Group', tabBarIcon: ({color, size}) => <Ionicons name='swap-horizontal' color={color} size={size} />}} />
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({color, size}) => <Ionicons name='settings' color={color} size={size} />}} />
    </Tabs.Navigator>
  )
}

export default TabsNavigator