import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainNavigator from './MainNavigator';
import ViewGroupScreen from '../screens/drawer/ViewGroupScreen';
import ChangeGroupScreen from '../screens/drawer/ChangeGroupScreen';
import AddMemberScreen from '../screens/drawer/AddMemberScreen';
import SettingsScreen from '../screens/drawer/SettingsScreen';
import CreateGroupScreen from '../screens/drawer/CreateGroupScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName='MainNavigator' screenOptions={{ headerTransparent: true, headerTitle: "" }}>
      <Drawer.Screen name="MainNavigator" component={MainNavigator} />
      <Drawer.Screen name="ViewGroup" component={ViewGroupScreen} />
      <Drawer.Screen name="ChangeGroup" component={ChangeGroupScreen} />
      <Drawer.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Drawer.Screen name="AddMember" component={AddMemberScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator