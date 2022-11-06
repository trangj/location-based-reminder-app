import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AddReminderScreen from '../screens/main/AddReminderScreen'
import MainScreen from '../screens/main/MainScreen'
import MarkerDetailsScreen from '../screens/main/MarkerDetailsScreen'

const Stack = createNativeStackNavigator()

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Main' component={MainScreen} />
      <Stack.Screen name='MarkerDetails' component={MarkerDetailsScreen} />
      <Stack.Screen name='AddReminder' component={AddReminderScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator