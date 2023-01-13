import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Button, CloseIcon, FormControl, HStack, IconButton, Text, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native'
import BottomSheetInputWrapper from '../ui/BottomSheetInputWrapper'
import { useRemindersStore } from '../stores/reminderStore';

const BottomSheetAddMarker = forwardRef(({renderBackdrop, snapPoints, markerId}, { bottomSheetAddReminderRef }) => {
  const reminders = useRemindersStore(state => state.reminders);
  const setReminders = useRemindersStore(state => state.setReminders);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      description: '',
    }
  });

  const onSubmit = async ({ description }) => {

    if (!markerId) {
      return;
    }
    
    const { data, error } = await supabase
    .from('reminder')
    .insert([
      { marker_id: markerId, description },
    ])
    .select('*')

    setReminders([...reminders, ...data]);

    if (error) {
      Alert.alert(error.message)
    } else {
      reset();
      bottomSheetAddReminderRef.current.dismiss()
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetAddReminderRef}
      backdropComponent={renderBackdrop}
      index={1}
      snapPoints={snapPoints}
      keyboardBlurBehavior={'restore'}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      enablePanDownToClose={false}
    >
      <VStack space="2" p="2">
        <HStack
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold">Add Reminder</Text>
          <HStack
            ml="auto"
            mr="2"
          >
            <IconButton 
              colorScheme="gray"
              borderRadius="full"
              variant="subtle"
              size="sm"
              icon={<CloseIcon />}
              onPress={() => bottomSheetAddReminderRef.current.dismiss()}
            />
          </HStack>
        </HStack>
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
    </BottomSheetModal>
  )
})

export default BottomSheetAddMarker