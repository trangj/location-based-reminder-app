import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainNavigator from './MainNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName='MainNavigator' screenOptions={{ headerTransparent: true, headerTitle: "" }}>
      <Drawer.Screen name="MainNavigator" component={MainNavigator} />
      <Drawer.Screen name="ViewGroup" component={MainNavigator} />
      <Drawer.Screen name="ChangeGroups" component={MainNavigator} />
      <Drawer.Screen name="AddMember" component={MainNavigator} />
      <Drawer.Screen name="Settings" component={MainNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator