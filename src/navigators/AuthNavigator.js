import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import DrawerNavigator from './DrawerNavigator'

const Stack = createNativeStackNavigator()

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName='Welcome' screenOptions={{ header: () => null }}>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} />
    </Stack.Navigator>
  )
}

export default AuthNavigator