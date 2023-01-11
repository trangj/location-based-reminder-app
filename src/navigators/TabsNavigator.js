import React from 'react'
import MainNavigator from './MainNavigator';
import GroupNavigator from './GroupNavigator';
import ChangeGroupScreen from '../screens/tabs/ChangeGroupScreen';
import SettingsScreen from '../screens/tabs/SettingsScreen';
import CreateGroupScreen from '../screens/tabs/CreateGroupScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'

const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator initialRouteName='MainNavigator'>
      <Tabs.Screen name="MainNavigator" component={MainNavigator} options={{ headerShown: false, title: "Map", tabBarIcon: ({color, size}) => <Ionicons name='navigate-circle' color={color} size={size} />}} />
      <Tabs.Screen name="GroupNavigator" component={GroupNavigator} options={{ headerShown: false, title: "Current Group", tabBarIcon: ({color, size}) => <Ionicons name='people' color={color} size={size} />}} />
      <Tabs.Screen name="ChangeGroup" component={ChangeGroupScreen} options={{ title: 'Change Group', tabBarIcon: ({color, size}) => <Ionicons name='swap-horizontal' color={color} size={size} />}} />
      <Tabs.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group', tabBarIcon: ({color, size}) => <Ionicons name='add' color={color} size={size} /> }} />
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({color, size}) => <Ionicons name='settings' color={color} size={size} />}} />
    </Tabs.Navigator>
  )
}

export default TabsNavigator