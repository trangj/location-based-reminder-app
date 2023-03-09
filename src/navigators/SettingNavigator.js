import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ChangePasswordScreen from '../screens/tabs/ChangePasswordScreen';
import ChangeEmailScreen from '../screens/tabs/ChangeEmailScreen';
import SettingsScreen from '../screens/tabs/SettingsScreen';
const Stack = createNativeStackNavigator()

function SettingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={SettingsScreen} options={{title: 'Settings'}}/>
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} options={{title: 'ChangePassword'}}/>
      <Stack.Screen name='ChangeEmailScreen' component={ChangeEmailScreen} options={{title: 'ChangeEmail'}}/>
    </Stack.Navigator>
  )
}

export default SettingNavigator