import dayjs from 'dayjs'
import { AddIcon, Button, Checkbox, CloseIcon, Divider, IconButton, Text, useColorModeValue, useTheme, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
import { useRemindersStore } from '../../stores/reminderStore'
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal'
import ListItem from '../../ui/ListItem'
import BottomSheetHeader from './BottomSheetHeader'
import EmptyReminderList from '../placeholders/EmptyReminderList'
import ListSkeleton from '../placeholders/ListSkeleton'
import BottomSheetFlatListWrapper from './BottomSheetFlatListWrapper'
import { useState } from 'react'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { useCustomToast } from '../../hooks/useCustomToast'

const BottomSheetMarkerList = forwardRef((
  {
    markerId
  }, 
  { 
    bottomSheetReminderListRef,
    bottomSheetAddReminderRef
  }) => {

  const toast = useCustomToast();
  const { colors, space } = useTheme();
  const color = useColorModeValue('gray.500', 'gray.400')
  const bg = useColorModeValue(colors.white, colors.gray[900])

  // stores
  const reminders = useRemindersStore(state => state.reminders);
  const loading = useRemindersStore(state => state.loading);
  const fetchReminders = useRemindersStore(state => state.fetchReminders);
  const changeReminderStatus = useRemindersStore(state => state.changeReminderStatus);
  const deleteReminder = useRemindersStore(state => state.deleteReminder);

  const [order, setOrder] = useState({query: 'description'})

  // fetch reminders on load
  useEffect(() => {
    if (markerId) {
      fetchReminders(markerId, order.query, order.options);
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

  const handleOrder = ({query = undefined, options = undefined}) => {
    fetchReminders(markerId, query, options)
    setOrder({ query, options })
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
      <BottomSheetFlatListWrapper
        data={reminders}
        ListEmptyComponent={loading ? ListSkeleton : EmptyReminderList}
        keyExtractor={(reminder) => reminder.id}
        ItemSeparatorComponent={() => (<Divider />)}
        ListHeaderComponent={
          <ScrollView 
            horizontal 
            contentInset={{ left: 12, right: 12 }}
            contentOffset={{ x: -12 }}
            contentContainerStyle={{ paddingHorizontal: Platform.OS === 'android' ? 12 : undefined }}
            showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: space[2], backgroundColor: bg }}
          >
            <Button 
              variant={order.query === "description" ? "headerActive" : "header"}
              size="sm"
              onPress={() => handleOrder({ query: "description" })}
            >
              Alphabetical
            </Button>
            <Button 
              variant={order.query === "completed_at" ? "headerActive" : "header"}
              size="sm"
              ml="2"
              onPress={() => handleOrder({ query: "completed_at"})}
            >
              Completed
            </Button>
            <Button 
              variant={order.query === "created_at" ? "headerActive" : "header"}
              size="sm"
              ml="2"
              onPress={() => handleOrder({ query: "created_at", options: { ascending: false }})}
            >
              Most Recent
            </Button>
            <Button 
              variant={order.query === "updated_at" ? "headerActive" : "header"}
              size="sm"
              ml="2"
              onPress={() => handleOrder({ query: "updated_at" })}
            >
              Recently Updated
            </Button>
          </ScrollView>
        }
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
              <Text variant="alt">
                {dayjs(reminder.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
            <IconButton 
              ml="auto"
              colorScheme="gray"
              icon={<CloseIcon color={color}/>}
              onPress={() => handleDeleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
    </CustomBottomSheetModal>
  )
})

export default BottomSheetMarkerList