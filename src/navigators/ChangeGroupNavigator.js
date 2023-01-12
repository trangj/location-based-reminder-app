import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ChangeGroupScreen from '../screens/change_group/ChangeGroupScreen';
import CreateGroupScreen from '../screens/change_group/CreateGroupScreen';

const Stack = createNativeStackNavigator()

function ChangeGroupNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ChangeGroup' component={ChangeGroupScreen} options={{title: 'Change Group'}} />
      <Stack.Screen name='CreateGroup' component={CreateGroupScreen} options={{title: 'Create Group'}}/>
    </Stack.Navigator>
  )
}

export default ChangeGroupNavigator