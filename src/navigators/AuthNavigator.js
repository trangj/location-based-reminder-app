import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import DrawerNavigator from './TabsNavigator'
import { useSessionStore } from '../stores/sessionStore'

const Stack = createNativeStackNavigator()

function AuthNavigator() {
  const session = useSessionStore(state => state.session)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} />
      ) : (
        <>
          <Stack.Screen name='Welcome' component={WelcomeScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AuthNavigator