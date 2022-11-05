import { useCallback, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useMarkerStore } from '../../stores/markerStore';
import ListItem from '../../ui/ListItem';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useState } from 'react';
import { Text } from 'native-base';

function MainScreen() {
  // stores
  const markers = useMarkerStore(state => state.markers)
  const group = useGroupStore(state => state.group)

  // mapview
  const mapRef = useRef()

  // bottom sheet
  const [view, setView] = useState("list")
  const [newMarker, setNewMarker] = useState(null)
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['10%', '35%', '95%'], []);
  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={2}
      disappearsOnIndex={1}
    />
  ), [])

  // handling actions
  async function addMarker(nativeEvent) {
    const {data, error} = supabase.from('marker').insert([
      {group_id: group.id, }
    ])
  }

  function handleLongPress({nativeEvent}) {
    mapRef.current.animateToRegion({
      latitude: nativeEvent.coordinate.latitude,
      longitude: nativeEvent.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
    setView("add")
    setNewMarker({
      coordinate: nativeEvent.coordinate,
      title: 'New Marker'
    })
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
        onLongPress={handleLongPress}
      >
        {
          markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))
        }
        {
          view === "add" && (
            <Marker
              coordinate={newMarker.coordinate}
              title={newMarker.title}
              description={newMarker.description}
            />
          )
        }
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        index={0}
        snapPoints={snapPoints}
      >
        {
          view === "list" ? (
            <BottomSheetFlatList
              data={markers}
              keyExtractor={(i) => i}
              renderItem={({item}) => (
                <ListItem>
                  <Text>
                    Test
                  </Text>
                </ListItem>
              )}
              contentContainerStyle={styles.contentContainer}
            />
          ) : (
            <Text>{JSON.stringify(newMarker)}</Text>
          )
        }
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default MainScreen