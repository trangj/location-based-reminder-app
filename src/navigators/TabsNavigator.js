import React from 'react'
import GroupNavigator from './GroupNavigator';
import SettingsScreen from '../screens/tabs/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'
import ChangeGroupNavigator from './ChangeGroupNavigator';
import MainScreen from '../screens/tabs/MainScreen';
import { useColorModeValue, useTheme } from 'native-base';

const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  const { colors } = useTheme()
  const iconColor = useColorModeValue(colors.gray[500], colors.gray[400])
  const iconColorActive = useColorModeValue(colors.black, colors.white)

  return (
    <Tabs.Navigator initialRouteName='MainNavigator' screenOptions={{ tabBarActiveTintColor: iconColorActive, tabBarInactiveTintColor: iconColor }}>
      <Tabs.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false, title: "Map", tabBarIcon: ({focused, color, size}) => <Ionicons name={focused ? 'navigate-circle' : 'navigate-circle-outline'} color={color} size={size} />}} />
      <Tabs.Screen name="GroupNavigator" component={GroupNavigator} options={{ headerShown: false, title: "Current Group", tabBarIcon: ({focused, color, size}) => <Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={size} />}} />
      <Tabs.Screen name="ChangeGroupNavigator" component={ChangeGroupNavigator} options={{ headerShown: false, title: 'Change Group', tabBarIcon: ({color, size}) => <Ionicons name='swap-horizontal' color={color} size={size} />}} />
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({focused, color, size}) => <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={size} />}} />
    </Tabs.Navigator>
  )
}

export default TabsNavigator