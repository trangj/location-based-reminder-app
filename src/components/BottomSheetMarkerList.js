import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { Button, Divider, Text, VStack } from 'native-base'
import React, { forwardRef } from 'react'
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
              <Text>
                {item.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {dayjs(item.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
            <Text>
              {item.number_of_reminders} reminder{item.number_of_reminders === 1 ? '' : 's'}
            </Text>
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList