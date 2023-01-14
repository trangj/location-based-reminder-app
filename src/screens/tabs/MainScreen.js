import { useCallback, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useMarkerStore } from '../../stores/markerStore';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import BottomSheetMarkerList from '../../components/BottomSheetMarkerList';
import BottomSheetAddMarker from '../../components/BottomSheetAddMarker';
import BottomSheetReminderList from '../../components/BottomSheetReminderList';
import BottomSheetAddReminder from '../../components/BottomSheetAddReminder';
import { useGroupStore } from '../../stores/groupStore';
import { useNavigation } from '@react-navigation/native';
import { Box } from 'native-base';

function MainScreen() {
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
  function handleLongPress({nativeEvent}) {
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
      <Box safeAreaTop h="full" w="full" position="absolute">
        <BottomSheetModalProvider>
          <BottomSheetMarkerList 
            ref={{ bottomSheetMarkerListRef, mapRef, bottomSheetReminderListRef }} 
            markers={markers}
            setCurrentMarkerId={setCurrentMarkerId} 
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
      </Box>
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