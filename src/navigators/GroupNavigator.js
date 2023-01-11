import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ViewGroupScreen from '../screens/group/ViewGroupScreen';
import AddMemberScreen from '../screens/group/AddMemberScreen';

const Stack = createNativeStackNavigator()

function GroupNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ViewGroup' component={ViewGroupScreen} options={{title: 'Current Group'}} />
      <Stack.Screen name='AddMember' component={AddMemberScreen} options={{title: 'Add Member'}}/>
    </Stack.Navigator>
  )
}

export default GroupNavigator