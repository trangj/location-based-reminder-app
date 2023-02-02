import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Divider, Text, VStack } from 'native-base'
import React, { forwardRef, useCallback } from 'react'
import { useState } from 'react'
import { debounce } from '../../lib/util'
import ListItem from '../../ui/ListItem'
import * as Location from 'expo-location'
import EmptySearch from '../placeholders/EmptySearch'
import { useEffect } from 'react'
import ListSkeleton from '../placeholders/ListSkeleton'

const BottomSheetSearch = forwardRef((
  {
    setNewMarker,
    searchQuery,
  }, 
  { 
    bottomSheetAddMarkerRef,
    mapRef, 
  }) => {
    
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)

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

    setResults([])
    setLoading(true)
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${initialLocation.coords.latitude},${initialLocation.coords.longitude}
      &radius=500
      &query=${query}
      &key=`);
    const data = await res.json()
    setResults(data.results)
    setLoading(false)
  }, 500), [])

  useEffect(() => {
    fetchLocations(searchQuery);
  }, [searchQuery])

  return (
    <BottomSheetFlatList
      ListEmptyComponent={loading ? ListSkeleton : EmptySearch}
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
  )
})

export default BottomSheetSearch