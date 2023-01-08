import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigators/AuthNavigator'
import { NativeBaseProvider } from "native-base";
import { SafeAreaView, StatusBar } from 'react-native';
import { supabase } from './src/lib/supabase'
import { useEffect } from 'react'
import { useMarkerStore } from './src/stores/markerStore'
import { useGroupStore } from './src/stores/groupStore'
import { useSessionStore } from './src/stores/sessionStore'


export default function App() {
  const setSession = useSessionStore(state => state.setSession)
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const group = useGroupStore(state => state.group);

  // handle authentication on app load
  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      setMarkers([])

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000'
      }}
    >
      <NativeBaseProvider>
        <NavigationContainer>
          <AuthNavigator />
          <StatusBar />
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}
