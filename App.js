import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigators/AuthNavigator'
import { NativeBaseProvider } from "native-base";
import { Alert, SafeAreaView, StatusBar } from 'react-native';
import { supabase } from './src/lib/supabase'
import { useEffect, useState } from 'react'
import { useMarkerStore } from './src/stores/markerStore'
import { useGroupStore } from './src/stores/groupStore'
import { useSessionStore } from './src/stores/sessionStore'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask("MARKER_GEOFENCE", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    Alert.alert("You have arrived at one of your markers!")
    console.log("You've entered region:", region);
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});

export default function App() {
  const setSession = useSessionStore(state => state.setSession)
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const markers = useMarkerStore(state => state.markers)
  const group = useGroupStore(state => state.group);
  const [status, setStatus] = useState(false)

  useEffect(() => {
    // get permission for user's location
    (async () => {
      let {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
      let {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
      const combinedStatus = foregroundStatus === 'granted' && backgroundStatus == 'granted'
      setStatus(combinedStatus);
      if (!combinedStatus) {
        Alert.alert('Permission for location was denied', "Please enable location for this app to obtain the full experience.");
        return;
      }
    })();

    // handle authentication on app load
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (group) {
        const {data, error} = await supabase
          .from('marker')
          .select('*')
          .eq('group_id', group.id)

        setMarkers(data);
      }
    })();

    // clear session when user logs out
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // update geofenced markers when user changes groups i.e loads new markers
  useEffect(() => {
    if (!status || markers.length === 0) return;

    const markerRegion = markers.map(marker => ({
      ...marker,
      radius: 10
    }))

    Location.startGeofencingAsync("MARKER_GEOFENCE", markerRegion);
  }, [markers, status])

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
