import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import DrawerNavigator from './DrawerNavigator'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useSessionStore } from '../stores/sessionStore'
import { useMarkerStore } from '../stores/markerStore'
import { useGroupStore } from '../stores/groupStore'

const Stack = createNativeStackNavigator()

function AuthNavigator() {
  const session = useSessionStore(state => state.session)
  const setSession = useSessionStore(state => state.setSession)
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const group = useGroupStore(state => state.group);

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (group) {
        const {data, error} = await supabase
          .from('marker')
          .select('*')
          .eq('group_id', group.id)

        setMarkers(data);
      }
    }

    fetchSession();
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