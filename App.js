import 'react-native-gesture-handler';
import { NativeBaseProvider } from "native-base";
import { Alert } from 'react-native';
import { supabase } from './src/lib/supabase'
import { useEffect, useState } from 'react'
import { useMarkerStore } from './src/stores/markerStore'
import { useGroupStore } from './src/stores/groupStore'
import { useSessionStore } from './src/stores/sessionStore'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import dayjs from 'dayjs'
import { colorModeManager, theme } from './src/lib/theme';
import { debounce } from './src/lib/util';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Root from './src/Root';

// date formater setup
dayjs().format()

// define notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const sendNotification = debounce(() => {
  const schedulingOptions = {
    content: {
      title: 'You have arrived at a marker',
      body: 'Check the app to see your reminders for this marker.',
      sound: true,
    },
    trigger: null,
  };
  Notifications.scheduleNotificationAsync(schedulingOptions);
}, 2000);

// send notifications when user enters a marker
TaskManager.defineTask("MARKER_GEOFENCE", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  
  if (eventType === Location.GeofencingEventType.Enter) {
    sendNotification();
  }
});

export default function App() {
  const setSession = useSessionStore(state => state.setSession)
  const markers = useMarkerStore(state => state.markers)
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const fetchMarkers = useMarkerStore(state => state.fetchMarkers)
  const group = useGroupStore(state => state.group);
  const setGroup = useGroupStore(state => state.setGroup);
  const [locationStatus, setLocationStatus] = useState(false)

  useEffect(() => {
    // get permission for user's location and to send notifications
    (async () => {
      let {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
      let {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
      const combinedStatus = foregroundStatus === 'granted' && backgroundStatus === 'granted'
      setLocationStatus(combinedStatus);
      if (!combinedStatus) {
        Alert.alert('Permission for location was denied', "Please enable location for this app to obtain the full experience.");
      }

      let {status: notificationStatus} = await Notifications.requestPermissionsAsync();
      if (!notificationStatus) {
        Alert.alert('Permission for notifications was denied', "You will not recieve notifications when arriving at markers.");
      }
    })();

    // handle authentication on app load
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();

    // clear session when user logs out
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      // if the user signs out clear the group
      if (_event === 'SIGNED_OUT') {
        setGroup(null);
        setMarkers([]);
      }
    })
  }, [])

  // update markers depending on group
  useEffect(() => {
    if (!group) return;
    fetchMarkers(group.id);
  }, [group])

  // update geofenced markers when user changes groups i.e loads new markers
  useEffect(() => {
    if (!locationStatus || markers.length === 0) return;

    const markerRegion = markers.map(marker => ({
      ...marker,
      radius: 50
    }))

    Location.startGeofencingAsync("MARKER_GEOFENCE", markerRegion);

    return () => Location.stopGeofencingAsync("MARKER_GEOFENCE");
  }, [markers, locationStatus])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
          <Root />
        </NativeBaseProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
