import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Divider, Text, VStack, HStack, IconButton, CloseIcon } from 'native-base'
import React, { forwardRef } from 'react'
import { useState } from 'react'
import { debounce } from '../lib/util'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'
import * as Location from 'expo-location'
import BottomSheetInputWrapper from '../ui/BottomSheetInputWrapper'

const BottomSheetSearch = forwardRef((
  {
    setNewMarker
  }, 
  { 
    bottomSheetSearchRef,
    bottomSheetAddMarkerRef, 
    mapRef, 
  }) => {
    
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLocations = debounce(async (query) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let initialLocation = await Location.getCurrentPositionAsync({});

    fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${initialLocation.coords.latitude},${initialLocation.coords.longitude}
      &radius=500
      &query=${query}
      &key=KEY_GOES_HERE`)
      .then(res => res.json())
      .then(data => setResults(data.results))
  }, 1000)
  
  const handleOnChange = (text) => {
    setSearchQuery(text)
    fetchLocations(text)
  }

  return (
    <CustomBottomSheetModal 
      ref={bottomSheetSearchRef}
      keyboardBlurBehavior={'restore'}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetFlatList
        ListHeaderComponent={
          <VStack>
            <HStack
              alignItems="center"
              justifyContent="center"
              p="2"
            >
              <Text fontSize="2xl" fontWeight="bold">Search Nearby</Text>
              <HStack
                ml="auto"
                space="2"
                mr="2"
              >
                <IconButton 
                  colorScheme="gray"
                  borderRadius="full"
                  variant="subtle"
                  size="sm"
                  icon={<CloseIcon />}
                  onPress={() => bottomSheetSearchRef.current.dismiss()}
                />
              </HStack>
            </HStack>
            <BottomSheetInputWrapper 
              mx="2" 
              onChangeText={handleOnChange}
              value={searchQuery}
            />
          </VStack>
        }
        data={results}
        keyExtractor={(result) => result.place_id}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item}) => (
          <ListItem
            onPress={() => 
              mapRef.current.animateToRegion({
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
              })
            }
            onLongPress={() => {
              mapRef.current.animateToRegion({
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
              })
              bottomSheetAddMarkerRef.current.present();
              setNewMarker({
                coordinate: {
                  latitude: item.geometry.location.lat,
                  longitude: item.geometry.location.lng,
                },
                title: 'New Marker'
              })
            }}
            justifyContent="space-between"
          >
            <VStack>
              <Text>
                {item.name}
              </Text>
              <Text>
                {item.formatted_address}
              </Text>
            </VStack>
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetSearch