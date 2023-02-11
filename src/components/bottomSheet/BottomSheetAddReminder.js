import { Button, CloseIcon, FormControl, IconButton, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import BottomSheetInputWrapper from '../../ui/BottomSheetInputWrapper'
import { useRemindersStore } from '../../stores/reminderStore';
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal';
import BottomSheetHeader from './BottomSheetHeader';
import { useCustomToast } from '../../hooks/useCustomToast';
import * as Haptics from 'expo-haptics'

const BottomSheetAddMarker = forwardRef(({ markerId }, { bottomSheetAddReminderRef }) => {
  const addReminder = useRemindersStore(state => state.addReminder);
  const toast = useCustomToast();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      description: '',
    }
  });

  const onSubmit = async ({ description }) => {
    if (!markerId) return;
    try {
      await addReminder(markerId, { description })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show({description: "Successfully added reminder"})
      reset();
      bottomSheetAddReminderRef.current.dismiss()
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show({description: error.message})
    }
  }

  return (
    <CustomBottomSheetModal
      ref={bottomSheetAddReminderRef}
      header={
        <BottomSheetHeader
          text="Add Reminder"
          leftChildren={
            <IconButton 
              variant="header"
              icon={<CloseIcon size="sm" />}
              onPress={() => bottomSheetAddReminderRef.current.dismiss()}
            />
          }
        />
      }
    >
      <VStack space="6" p="3" pt="0">
        <FormControl isInvalid={errors.description}>
          <FormControl.Label>Description</FormControl.Label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheetInputWrapper
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
          />
          <FormControl.ErrorMessage>
            Reminder description is required.
          </FormControl.ErrorMessage>
        </FormControl>
        <Button onPress={handleSubmit(onSubmit)}>
          Add Reminder
        </Button>
      </VStack>
    </CustomBottomSheetModal>
  )
})

export default BottomSheetAddMarker