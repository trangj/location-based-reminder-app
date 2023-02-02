import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { Divider, IconButton, SearchIcon, Text, VStack, Icon, useToast, HStack, CloseIcon } from 'native-base'
import React, { forwardRef } from 'react'
import { Alert } from 'react-native'
import { useMarkerStore } from '../../stores/markerStore'
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal'
import ListItem from '../../ui/ListItem'
import EmptyMarkerList from '../placeholders/EmptyMarkerList'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCustomActionSheet } from '../../hooks/useCustomActionSheet'
import ListSkeleton from '../placeholders/ListSkeleton'
import BottomSheetInputWrapper from '../../ui/BottomSheetInputWrapper'
import BottomSheetSearch from './BottomSheetSearch'
import { useState } from 'react'
import { useGroupStore } from '../../stores/groupStore'
import { Keyboard } from 'react-native'

const BottomSheetMarkerList = forwardRef((
  {
    setCurrentMarkerId,
    setNewMarker
  }, 
  { 
    bottomSheetMarkerListRef, 
    bottomSheetReminderListRef,
    bottomSheetAddMarkerRef,
    mapRef, 
  }) => {

  const toast = useToast()
  const { showCustomActionSheetWithOptions } = useCustomActionSheet();
  
  const markers = useMarkerStore(state => state.markers);
  const fetchMarkers = useMarkerStore(state => state.fetchMarkers);
  const group = useGroupStore(state => state.group)
  const loading = useMarkerStore(state => state.loading);
  const deleteMarker = useMarkerStore(state => state.deleteMarker);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchView, setSearchView] = useState(false);

  async function handleDeleteMarker(markerId) {
    try {
      await deleteMarker(markerId)
      toast.show({description: "Successfuly deleted marker"})
    } catch (error) {
      toast.show({description: error.message})
    }
  }

  function handlePress(markerId) {
    const options = ['View Reminders', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showCustomActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          setCurrentMarkerId(markerId)
          bottomSheetReminderListRef.current.present()
          break;
        case destructiveButtonIndex:
          Alert.alert("Delete marker?", "Are you sure you want to delete this marker?", [
            {
              text: "Cancel",
              style: 'cancel'
            },
            {
              text: "Delete",
              style: 'destructive',
              onPress: () => handleDeleteMarker(markerId)
            }
          ])
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  return (
    <CustomBottomSheetModal 
      ref={bottomSheetMarkerListRef}
      header={
        <HStack
          mx="3"
          mb="3"
          alignItems="center"
          justifyContent="center"
          space="2"
        >
          <BottomSheetInputWrapper
            flex="1"
            key="searchInput" 
            variant="alt"
            placeholderTextColor="gray.500"
            placeholder="Search Map"
            InputLeftElement={<SearchIcon ml="3" color="gray.500" />}
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            onFocus={() => setSearchView(true)}
          />
          {searchView ? (
            <IconButton 
              variant="header"
              icon={<CloseIcon size="sm" />}
              onPress={() => {
                setSearchView(false)
                setNewMarker(null)
                setSearchQuery("")
                bottomSheetMarkerListRef.current.snapToIndex(1)
                Keyboard.dismiss();
              }}
            />
          ) : (
            <>
              <IconButton 
                variant="header"
                icon={<Icon as={Ionicons} name="refresh" size="sm" />}
                onPress={() => fetchMarkers(group.id)}
              />
              <IconButton 
                variant="header"
                icon={<Icon as={Ionicons} name="swap-vertical" size="sm" />}
              />
            </>
          )}
        </HStack>
      }
    >
      {searchView ? (
        <BottomSheetSearch
          setNewMarker={setNewMarker} 
          setSearchView={setSearchView}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery} 
          ref={{ 
            bottomSheetAddMarkerRef, 
            bottomSheetMarkerListRef,
            mapRef, 
          }}
        />
      ) : (
        <BottomSheetFlatList
          data={markers}
          keyExtractor={(marker) => marker.id}
          ItemSeparatorComponent={() => (<Divider />)}
          ListEmptyComponent={loading ? ListSkeleton : EmptyMarkerList}
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
              onLongPress={() => {
                setCurrentMarkerId(item.id)
                bottomSheetReminderListRef.current.present()
              }}
              justifyContent="space-between"
            >
              <VStack>
                <Text fontWeight="medium">
                  {item.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {dayjs(item.created_at).format('DD-MM-YYYY')} {'\u2022'} {item.number_of_reminders} reminder{item.number_of_reminders === 1 ? '' : 's'}
                </Text>
              </VStack>
              <IconButton icon={<Icon as={Ionicons} name="ellipsis-horizontal" size="md" />} colorScheme="gray" onPress={() => handlePress(item.id)} />
            </ListItem>
          )}
        />
      )}
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList