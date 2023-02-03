import { useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useMarkerStore } from '../../stores/markerStore';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import BottomSheetMarkerList from '../../components/bottomSheet/BottomSheetMarkerList';
import BottomSheetAddMarker from '../../components/bottomSheet/BottomSheetAddMarker';
import BottomSheetReminderList from '../../components/bottomSheet/BottomSheetReminderList';
import BottomSheetAddReminder from '../../components/bottomSheet/BottomSheetAddReminder';
import { useGroupStore } from '../../stores/groupStore';
import { useNavigation } from '@react-navigation/native';
import { useColorModeValue } from 'native-base';
import { darkModeMapStyle } from '../../lib/theme';

function MainScreen() {
  const userInterfaceStyle = useColorModeValue('light', 'dark')
  const customMapStyle = useColorModeValue([], darkModeMapStyle)

  // navigation context
  const navigation = useNavigation()

  // stores
  const markers = useMarkerStore(state => state.markers)
  const group = useGroupStore(state => state.group);

  // mapview
  const mapRef = useRef()

  // bottom sheet
  const [newMarker, setNewMarker] = useState(null)
  const [currentMarkerId, setCurrentMarkerId] = useState(null)

  const bottomSheetMarkerListRef = useRef(null)
  const bottomSheetAddMarkerRef = useRef(null)
  const bottomSheetReminderListRef = useRef(null)
  const bottomSheetAddReminderRef = useRef(null)

  // handling actions
  function handleLongPress({ nativeEvent }) {
    // prevent users from adding markers if they are not in a group
    if (!group) return;

    mapRef.current.animateToRegion({
      latitude: nativeEvent.coordinate.latitude,
      longitude: nativeEvent.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    bottomSheetAddMarkerRef.current.present();
    setNewMarker({
      coordinate: nativeEvent.coordinate,
      title: 'New Marker'
    })
  }

  //set the mapview to the location of the user at the start of the app
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let initialLocation = await Location.getCurrentPositionAsync({});
      mapRef.current.animateToRegion({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      })
    })();

    const openBottomSheet = navigation.addListener('tabPress', () => {
      bottomSheetMarkerListRef.current.present();
    })

    return openBottomSheet;
  }, []);

  // display marker list on load
  useEffect(() => {
    if (bottomSheetMarkerListRef.current) {
      bottomSheetMarkerListRef.current.present();
    }
  }, [bottomSheetMarkerListRef])

  // if the user leaves the group or changes group, we need to return to the marker bottom sheet
  useEffect(() => {
    if (bottomSheetAddReminderRef && bottomSheetReminderListRef && bottomSheetAddMarkerRef) {
      bottomSheetAddReminderRef.current.dismiss();
      bottomSheetReminderListRef.current.dismiss();
      dismissAddMarkerSheet();
      setCurrentMarkerId(null);
    }
  }, [group])

  // dismiss add marker bottom sheet
  function dismissAddMarkerSheet() {
    setNewMarker(null)
    bottomSheetAddMarkerRef.current.dismiss();
  }

  return (
    <>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
        onLongPress={handleLongPress}
        onPress={() => dismissAddMarkerSheet()}
        showsUserLocation
        userInterfaceStyle={userInterfaceStyle}
        customMapStyle={customMapStyle}
      >
        {
          markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.name}
            />
          ))
        }
        {
          newMarker && (
            <Marker
              coordinate={newMarker.coordinate}
              title={newMarker.title}
              pinColor="#1d4ed8"
            />
          )
        }
      </MapView>
      <BottomSheetModalProvider>
        <BottomSheetMarkerList 
          ref={{ bottomSheetMarkerListRef, mapRef, bottomSheetReminderListRef, bottomSheetAddMarkerRef }} 
          setCurrentMarkerId={setCurrentMarkerId} 
          setNewMarker={setNewMarker}
        />
        <BottomSheetAddMarker
          ref={{ bottomSheetAddMarkerRef }}
          dismissAddMarkerSheet={dismissAddMarkerSheet}
          newMarker={newMarker}
        />
        <BottomSheetReminderList 
          ref={{ bottomSheetReminderListRef, bottomSheetAddReminderRef }}
          markerId={currentMarkerId}
        />
        <BottomSheetAddReminder 
          ref={{ bottomSheetAddReminderRef }}
          markerId={currentMarkerId}
        />
      </BottomSheetModalProvider>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});

export default MainScreen