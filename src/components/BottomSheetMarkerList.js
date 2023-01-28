import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { Button, Divider, IconButton, SearchIcon, Text, VStack, Icon, useToast } from 'native-base'
import React, { forwardRef } from 'react'
import { Alert } from 'react-native'
import { useMarkerStore } from '../stores/markerStore'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'
import EmptyMarkerList from './placeholders/EmptyMarkerList'
import Ionicons from '@expo/vector-icons/Ionicons'
import BottomSheetHeader from './BottomSheetHeader'
import { useCustomActionSheet } from '../hooks/useCustomActionSheet'

const BottomSheetMarkerList = forwardRef((
  {
    setCurrentMarkerId
  }, 
  { 
    bottomSheetMarkerListRef, 
    mapRef, 
    bottomSheetReminderListRef,
    bottomSheetSearchRef
  }) => {

  const toast = useToast()
  const { showCustomActionSheetWithOptions } = useCustomActionSheet();
  const markers = useMarkerStore(state => state.markers);
  const deleteMarker = useMarkerStore(state => state.deleteMarker);

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
    <CustomBottomSheetModal ref={bottomSheetMarkerListRef}>
      <BottomSheetFlatList
        ListHeaderComponent={
          <BottomSheetHeader
            text="Markers"
            leftChildren={
              <Button 
                borderRadius="full"
                variant="header"
                size="sm"
                leftIcon={<SearchIcon />}
                onPress={() => bottomSheetSearchRef.current.present()}
              >
                Search Map
              </Button>
            }
          />
        }
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
              <Text fontSize="sm" color="gray.500">
                {dayjs(item.created_at).format('DD-MM-YYYY')} {'\u2022'} {item.number_of_reminders} reminder{item.number_of_reminders === 1 ? '' : 's'}
              </Text>
            </VStack>
            <IconButton icon={<Icon as={Ionicons} name="ellipsis-horizontal" size="md" />} size="sm" colorScheme="gray" onPress={() => handlePress(item.id)} />
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList