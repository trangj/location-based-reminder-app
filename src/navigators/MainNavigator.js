import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AddReminderScreen from '../screens/main/AddReminderScreen'
import MainScreen from '../screens/main/MainScreen'
import MarkerDetailsScreen from '../screens/main/MarkerDetailsScreen'

const Stack = createNativeStackNavigator()

function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Main' component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name='MarkerDetails' component={MarkerDetailsScreen} options={{ title: "Reminders" }} />
      <Stack.Screen name='AddReminder' component={AddReminderScreen} options={{ title: "Add Reminder"}} />
    </Stack.Navigator>
  )
}

export default MainNavigator