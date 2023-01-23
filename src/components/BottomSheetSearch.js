import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Divider, Text, VStack, HStack, IconButton, CloseIcon } from 'native-base'
import React, { forwardRef, useCallback } from 'react'
import { useState } from 'react'
import { debounce } from '../lib/util'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'
import * as Location from 'expo-location'
import BottomSheetInputWrapper from '../ui/BottomSheetInputWrapper'
import EmptySearch from './placeholders/EmptySearch'
import BottomSheetHeader from './BottomSheetHeader'

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

  const fetchLocations = useCallback(debounce(async (query) => {
    if (!query) {
      setResults([]);
      return;
    }

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
      .then(data => {
        setResults(data.results)
      })
  }, 500), [])
  
  const handleOnChange = (text) => {
    fetchLocations(text)
    setSearchQuery(text)
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
            <BottomSheetHeader
              text="Search Nearby"
              leftChildren={
                <IconButton 
                  colorScheme="gray"
                  borderRadius="full"
                  variant="subtle"
                  size="sm"
                  icon={<CloseIcon />}
                  onPress={() => bottomSheetSearchRef.current.dismiss()}
                />
              }
            />
            <BottomSheetInputWrapper 
              onChangeText={handleOnChange}
              value={searchQuery}
              m="3"
              mt="0"
            />
          </VStack>
        }
        ListEmptyComponent={EmptySearch}
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
          >
            <VStack w="90%">
              <Text fontWeight="medium">
                {item.name}
              </Text>
              <Text fontSize="sm" color="gray.500" numberOfLines={1}>
                {item.formatted_address}
              </Text>
            </VStack>
            <Text w="10%" pl="2">
              {item.rating}
            </Text>
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetSearch