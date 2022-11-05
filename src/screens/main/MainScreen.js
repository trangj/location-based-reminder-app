import { useCallback, useMemo, useRef } from 'react';
import { Alert, Dimensions, StyleSheet } from 'react-native';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMarkerStore } from '../../stores/markerStore';
import ListItem from '../../ui/ListItem';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useState } from 'react';
import { Button, FormControl, HStack, Input, KeyboardAvoidingView, Text, useToast, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

function MainScreen() {
  // navigation
  const navigation = useNavigation()

  // toast
  const toast = useToast()

  // stores
  const markers = useMarkerStore(state => state.markers)
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const group = useGroupStore(state => state.group)

  // mapview
  const mapRef = useRef()

  // bottom sheet
  const [view, setView] = useState("list")
  const [newMarker, setNewMarker] = useState(null)
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['10%', '35%', '100%'], []);
  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={2}
      disappearsOnIndex={1}
    />
  ), [])

  // handling actions
  function handleLongPress({nativeEvent}) {
    mapRef.current.animateToRegion({
      latitude: nativeEvent.coordinate.latitude,
      longitude: nativeEvent.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
    setView("add")
    setNewMarker({
      coordinate: nativeEvent.coordinate,
      title: 'New Marker'
    })
  }

  async function onSubmit({ markerName }) {
    const {data, error} = await supabase.from('marker').insert([
      { 
        group_id: group.id, 
        latitude: newMarker.coordinate.latitude,
        longitude: newMarker.coordinate.longitude,
        name: markerName
      }
    ]).select();

    if (error) {
      Alert.alert("Failed to add marker.")
    } else {
      setMarkers([...markers, ...data])
      toast.show({description: "Successfully added marker."})
      setView("list");
    }
  }

  // marker form
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      markerName: '',
    }
  });

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        rotateEnabled={false}
        pitchEnabled={false}
        onLongPress={handleLongPress}
        onPress={() => view === "add" && setView("list")}
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
          view === "add" && (
            <Marker
              coordinate={newMarker.coordinate}
              title={newMarker.title}
              pinColor="#00FF00"
            />
          )
        }
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        index={1}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        {
          view === "list" ? (
            <BottomSheetFlatList
              data={markers}
              keyExtractor={(marker) => marker.id}
              renderItem={({item}) => (
                <ListItem
                  onPress={() => 
                    mapRef.current.animateToRegion({
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02
                    })
                  }
                  onLongPress={() => navigation.navigate("MarkerDetails")}
                >
                  <Text>
                    {item.name}
                  </Text>
                </ListItem>
              )}
            />
          ) : (
            <VStack p="3">
              <Text fontSize="2xl" >Add Marker</Text>
              <FormControl isInvalid={errors.markerName}>
                <FormControl.Label>Marker Name</FormControl.Label>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="markerName"
                />
                <FormControl.ErrorMessage>
                  Marker name is required.
                </FormControl.ErrorMessage>
              </FormControl>
              <VStack space="2" pt="2">
                <Button onPress={() => setView("list")} variant="ghost">
                  Exit
                </Button>
                <Button onPress={handleSubmit(onSubmit)}>
                  Add Marker
                </Button>
              </VStack>
            </VStack>
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
  }
});

export default MainScreen