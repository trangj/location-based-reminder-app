import { BottomSheetModal, BottomSheetFlatList, BottomSheetFooter } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { AddIcon, ArrowBackIcon, Checkbox, CloseIcon, DeleteIcon, Divider, HStack, IconButton, Text, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { useMarkerStore } from '../stores/markerStore'
import { useRemindersStore } from '../stores/reminderStore'
import ListItem from '../ui/ListItem'

const BottomSheetMarkerList = forwardRef((
  {renderBackdrop, snapPoints, markerId}, 
  { bottomSheetReminderListRef, bottomSheetAddReminderRef }) => {

  // stores
  const reminders = useRemindersStore(state => state.reminders);
  const setReminders = useRemindersStore(state => state.setReminders);
  const markers = useMarkerStore(state => state.markers);
  const setMarkers = useMarkerStore(state => state.setMarkers);

  // fetch reminders on load
  useEffect(() => {
    async function fetchReminders() {
      const {data, error} = await supabase.from('reminder').select('*').eq('marker_id', markerId);
      setReminders(data);
    }

    if (markerId) {
      fetchReminders();
    }
  }, [markerId])

  async function changeReminderStatus(id, checked) {
    const { data } = await supabase
      .from('reminder')
      .update({
        completed_at: checked ? (new Date()).toISOString() : null,
      })
      .match({ id })
      .select();
      setReminders(
        reminders.map(reminder => {
          if (reminder.id === id) {
            reminder.completed_at = data[0].completed_at;
          }
          return reminder;
        })
      );
  } 

  async function deleteReminder(id) {
    const { error } = await supabase.from('reminder').delete().match({ id })

    if (error) {
      Alert.alert(error.message)
    } else {
      setReminders(reminders.filter(reminder => reminder.id !== id));
    }
  }

  async function deleteMarker() {
    const { error: reminderError } = await supabase.from('reminder').delete().match({ marker_id: markerId })
    const { error } = await supabase.from('marker').delete().match({ id: markerId })

    if (error || reminderError) {
      Alert.alert(error.message)
    } else {
      setMarkers(markers.filter(marker => marker.id !== markerId));
      bottomSheetReminderListRef.current.dismiss();
    }
  }
  
  return (
    <BottomSheetModal
      ref={bottomSheetReminderListRef}
      backdropComponent={renderBackdrop}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
    >
      <BottomSheetFlatList
        ListHeaderComponent={() => (
          <HStack
            alignItems="center"
            justifyContent="center"
            p="2"
          >
            <Text fontSize="2xl" fontWeight="bold">Reminders</Text>
            <HStack
              ml="auto"
              space="2"
              mr="2"
            >
              <IconButton 
                borderRadius="full"
                variant="subtle"
                colorScheme="gray"
                size="sm"
                icon={<DeleteIcon />}
                onPress={() => {
                  Alert.alert("Delete marker?", "Are you sure you want to delete this marker?", [
                    {
                      text: "Cancel",
                      style: 'cancel'
                    },
                    {
                      text: "Delete",
                      style: 'destructive',
                      onPress: () => deleteMarker()
                    }
                  ])
                }}
              />
              <IconButton 
                borderRadius="full"
                colorScheme="gray"
                variant="subtle"
                size="sm"
                icon={<AddIcon />}
                onPress={() => bottomSheetAddReminderRef.current.present()}
              />
              <IconButton 
                colorScheme="gray"
                borderRadius="full"
                variant="subtle"
                size="sm"
                icon={<CloseIcon />}
                onPress={() => bottomSheetReminderListRef.current.dismiss()}
              />
            </HStack>
          </HStack>
        )}
        data={reminders}
        keyExtractor={(reminder) => reminder.id}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item: reminder}) => (
          <ListItem enablePress={false}>
            <Checkbox
              isChecked={!!reminder.completed_at}
              accessibilityLabel="Reminder completion status"
              onChange={checked => changeReminderStatus(reminder.id, checked)}
              mr="4"
            />
            <VStack>
              <Text>
                {reminder.description}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {dayjs(reminder.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
            <IconButton 
              ml="auto"
              colorScheme="gray"
              icon={<CloseIcon/>}
              onPress={() => deleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
    </BottomSheetModal>
  )
})

export default BottomSheetMarkerList