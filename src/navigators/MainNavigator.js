import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import MainScreen from '../screens/main/MainScreen'

const Stack = createNativeStackNavigator()

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      <Stack.Screen name='Main' component={MainScreen} />
      <Stack.Screen name='MarkerDetails' component={MainScreen} />
      <Stack.Screen name='AddReminder' component={MainScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator