import { useCallback, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useMarkerStore } from '../../stores/markerStore';
import ListItem from '../../ui/ListItem';
import { Marker } from 'react-native-svg';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useState } from 'react';

function MainScreen() {
  // stores
  const markers = useMarkerStore(state => state.markers)
  const group = useGroupStore(state => state.group)

  // mapview
  const mapRef = useRef()

  // bottom sheet
  const [view, setView] = useState(0)
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

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
        onLongPress={({nativeEvent}) => {
          mapRef.current.animateToRegion({
            latitude: nativeEvent.coordinate.latitude,
            longitude: nativeEvent.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          })
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        index={0}
        snapPoints={snapPoints}
      >
        {
          view === 0 ? (
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
            <Text>Hello world</Text>
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