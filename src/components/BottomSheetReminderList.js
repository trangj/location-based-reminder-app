import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { AddIcon, Checkbox, CloseIcon, Divider, IconButton, Text, useToast, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
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
  const toast = useToast();

  // stores
  const reminders = useRemindersStore(state => state.reminders);
  const fetchReminders = useRemindersStore(state => state.fetchReminders);
  const changeReminderStatus = useRemindersStore(state => state.changeReminderStatus);
  const deleteReminder = useRemindersStore(state => state.deleteReminder);

  // fetch reminders on load
  useEffect(() => {
    if (markerId) {
      fetchReminders(markerId);
    }
  }, [markerId])

  async function handleChangeReminderStatus(id, checked) {
    try {
      await changeReminderStatus(id, checked)
    } catch (error) {
      toast.show({description: error.message})

    }
  } 

  async function handleDeleteReminder(id) {
    try {
      await deleteReminder(id)
      toast.show({description: "Successfully deleted reminder"})
    } catch (error) {
      toast.show({description: error.message})
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
              onChange={checked => handleChangeReminderStatus(reminder.id, checked)}
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
              onPress={() => handleDeleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList