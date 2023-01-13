import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Divider, Text, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import ListItem from '../ui/ListItem'

const BottomSheetMarkerList = forwardRef((
  {renderBackdrop, snapPoints, markers, setCurrentMarkerId}, 
  { bottomSheetMarkerListRef, mapRef, bottomSheetReminderListRef }) => {
  // navigation
  const navigation = useNavigation()
  
  return (
    <BottomSheetModal
      ref={bottomSheetMarkerListRef}
      backdropComponent={renderBackdrop}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
    >
      <BottomSheetFlatList
        ListHeaderComponent={() => (
          <Text fontSize="2xl" p="2" fontWeight="bold">Markers</Text>
        )}
        data={markers}
        keyExtractor={(marker) => marker.id}
        ItemSeparatorComponent={() => (<Divider />)}
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
    </BottomSheetModal>
  )
})

export default BottomSheetMarkerList