import { useActionSheet } from '@expo/react-native-action-sheet'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { Divider, IconButton, Text, ThreeDotsIcon, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { useMarkerStore } from '../stores/markerStore'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'
import EmptyMarkerList from './placeholders/EmptyMarkerList'

const BottomSheetMarkerList = forwardRef((
  {
    markers, 
    setCurrentMarkerId
  }, 
  { 
    bottomSheetMarkerListRef, 
    mapRef, 
    bottomSheetReminderListRef 
  }) => {

  const { showActionSheetWithOptions } = useActionSheet();
  const setMarkers = useMarkerStore(state => state.setMarkers);

  async function deleteMarker(markerId) {
    const { error: reminderError } = await supabase.from('reminder').delete().match({ marker_id: markerId })
    const { error } = await supabase.from('marker').delete().match({ id: markerId })

    if (error || reminderError) {
      Alert.alert(error.message)
    } else {
      setMarkers(markers.filter(marker => marker.id !== markerId));
    }
  }

  function handlePress(markerId) {
    const options = ['Delete', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case destructiveButtonIndex:
          Alert.alert("Delete marker?", "Are you sure you want to delete this marker?", [
            {
              text: "Cancel",
              style: 'cancel'
            },
            {
              text: "Delete",
              style: 'destructive',
              onPress: () => deleteMarker(markerId)
            }
          ])
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }
    
  return (
    <CustomBottomSheetModal ref={bottomSheetMarkerListRef}>
      <BottomSheetFlatList
        ListHeaderComponent={() => (
          <Text fontSize="2xl" p="2" fontWeight="bold">Markers</Text>
        )}
        data={markers}
        keyExtractor={(marker) => marker.id}
        ItemSeparatorComponent={() => (<Divider />)}
        ListEmptyComponent={EmptyMarkerList}
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
              <Text fontSize="xs" color="gray.500">
                {dayjs(item.created_at).format('DD-MM-YYYY')} {'\u2022'} {item.number_of_reminders} reminder{item.number_of_reminders === 1 ? '' : 's'}
              </Text>
            </VStack>
            <IconButton icon={<ThreeDotsIcon/>} size="sm" colorScheme="gray" onPress={() => handlePress(item.id)} />
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList