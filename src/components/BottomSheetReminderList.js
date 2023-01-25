import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { AddIcon, Button, Checkbox, CloseIcon, DeleteIcon, Divider, HStack, IconButton, Text, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { useMarkerStore } from '../stores/markerStore'
import { useRemindersStore } from '../stores/reminderStore'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'
import ListItem from '../ui/ListItem'
import BottomSheetHeader from './BottomSheetHeader'
import EmptyReminderList from './placeholders/EmptyReminderList'

const BottomSheetMarkerList = forwardRef((
  {
    markerId
  }, 
  { 
    bottomSheetReminderListRef,
    bottomSheetAddReminderRef
  }) => {

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
  
  return (
    <CustomBottomSheetModal ref={bottomSheetReminderListRef}>
      <BottomSheetFlatList
        ListHeaderComponent={
          <BottomSheetHeader
            text="Reminders"
            leftChildren={
              <>
                <IconButton 
                  borderRadius="full"
                  variant="header"
                  size="sm"
                  icon={<AddIcon />}
                  onPress={() => bottomSheetAddReminderRef.current.present()}
                />
                <IconButton 
                  borderRadius="full"
                  variant="header"
                  size="sm"
                  icon={<CloseIcon />}
                  onPress={() => bottomSheetReminderListRef.current.dismiss()}
                />
              </>
            }
          />
        }
        data={reminders}
        ListEmptyComponent={EmptyReminderList}
        keyExtractor={(reminder) => reminder.id}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item: reminder}) => (
          <ListItem enablePress={false}>
            <Checkbox
              isChecked={!!reminder.completed_at}
              accessibilityLabel="Reminder completion status"
              onChange={checked => changeReminderStatus(reminder.id, checked)}
              mr="4"
              ml="1"
            />
            <VStack>
              <Text strikeThrough={!!reminder.completed_at}>
                {reminder.description}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {dayjs(reminder.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
            <IconButton 
              ml="auto"
              size="sm"
              colorScheme="gray"
              icon={<CloseIcon/>}
              onPress={() => deleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList