import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import DrawerNavigator from './DrawerNavigator'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

const Stack = createNativeStackNavigator()

function AuthNavigator() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
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