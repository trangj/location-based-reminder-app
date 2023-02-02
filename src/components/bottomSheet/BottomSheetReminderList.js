import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import { AddIcon, Checkbox, CloseIcon, Divider, Icon, IconButton, Text, useToast, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
import { useRemindersStore } from '../../stores/reminderStore'
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal'
import ListItem from '../../ui/ListItem'
import BottomSheetHeader from './BottomSheetHeader'
import EmptyReminderList from '../placeholders/EmptyReminderList'
import ListSkeleton from '../placeholders/ListSkeleton'
import Ionicons from '@expo/vector-icons/Ionicons'

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
  const loading = useRemindersStore(state => state.loading);
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
    <CustomBottomSheetModal 
      ref={bottomSheetReminderListRef}
      header={
        <BottomSheetHeader
          text="Reminders"
          leftChildren={
            <>
              <IconButton 
                variant="header"
                icon={<Icon as={Ionicons} name="refresh" size="sm" />}
                onPress={() => fetchReminders(markerId)}
              />
              <IconButton 
                variant="header"
                icon={<AddIcon size="sm" />}
                onPress={() => bottomSheetAddReminderRef.current.present()}
              />
              <IconButton 
                variant="header"
                icon={<CloseIcon size="sm" />}
                onPress={() => bottomSheetReminderListRef.current.dismiss()}
              />
            </>
          }
        />
      }
    >
      <BottomSheetFlatList
        data={reminders}
        ListEmptyComponent={loading ? ListSkeleton : EmptyReminderList}
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