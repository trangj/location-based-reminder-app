import { Button, CloseIcon, FormControl, IconButton, useToast, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useMarkerStore } from '../../stores/markerStore'
import { useGroupStore } from '../../stores/groupStore'
import { Controller, useForm } from 'react-hook-form'
import BottomSheetInputWrapper from '../../ui/BottomSheetInputWrapper'
import CustomBottomSheetModal from '../../ui/CustomBottomSheetModal'
import BottomSheetHeader from './BottomSheetHeader'

const BottomSheetAddMarker = forwardRef((
  {
    dismissAddMarkerSheet,
    newMarker
  },
  { 
    bottomSheetAddMarkerRef
  }) => {

  // toast
  const toast = useToast()

  // stores
  const addMarker = useMarkerStore(state => state.addMarker)
  const group = useGroupStore(state => state.group)

  // marker form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      markerName: '',
    }
  });

  async function onSubmit({ markerName }) {
    try {
      await addMarker({ 
        group_id: group.id, 
        latitude: newMarker.coordinate.latitude,
        longitude: newMarker.coordinate.longitude,
        name: markerName
      });
      reset();
      toast.show({description: "Successfully added marker"})
      dismissAddMarkerSheet();
    } catch (error) {
      toast.show({description: error.message})
    }
  }

  return (
    <CustomBottomSheetModal
      ref={bottomSheetAddMarkerRef}
      keyboardBlurBehavior={'restore'}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      onDismiss={() => dismissAddMarkerSheet()}
    >
      <VStack>
        <BottomSheetHeader
          text="Add Marker"
          leftChildren={
            <IconButton 
              borderRadius="full"
              variant="header"
              size="sm"
              icon={<CloseIcon />}
              onPress={() => dismissAddMarkerSheet()}
            />
          }
        />
        <VStack space="2" p="3" pt="0">
          <FormControl isInvalid={errors.markerName}>
            <FormControl.Label>Marker Name</FormControl.Label>
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
              name="markerName"
            />
            <FormControl.ErrorMessage>
              Marker name is required.
            </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={handleSubmit(onSubmit)}>
            Add Marker
          </Button>
        </VStack>
      </VStack>
    </CustomBottomSheetModal>
  )
})

export default BottomSheetAddMarker