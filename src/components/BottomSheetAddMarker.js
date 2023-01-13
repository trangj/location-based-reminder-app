import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Button, FormControl, Text, useToast, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useMarkerStore } from '../stores/markerStore'
import { useGroupStore } from '../stores/groupStore'
import { Controller, useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native'
import BottomSheetInputWrapper from '../ui/BottomSheetInputWrapper'

const BottomSheetAddMarker = forwardRef(({renderBackdrop, snapPoints, dismissAddMarkerSheet}, { bottomSheetAddMarkerRef }) => {
  // toast
  const toast = useToast()

  // stores
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const group = useGroupStore(state => state.group)

  // marker form
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      markerName: '',
    }
  });

  async function onSubmit({ markerName }) {
    const {data, error} = await supabase.from('marker').insert([
      { 
        group_id: group.id, 
        latitude: newMarker.coordinate.latitude,
        longitude: newMarker.coordinate.longitude,
        name: markerName
      }
    ]).select();

    if (error) {
      Alert.alert("Failed to add marker.")
    } else {
      setMarkers([...markers, ...data])
      toast.show({description: "Successfully added marker."})
      dismissAddMarkerSheet();
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetAddMarkerRef}
      backdropComponent={renderBackdrop}
      index={1}
      snapPoints={snapPoints}
      keyboardBlurBehavior={'restore'}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      onDismiss={() => dismissAddMarkerSheet()}
    >
      <VStack space="2" p="2">
        <Text fontSize="2xl" fontWeight="bold">Add Marker</Text>
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
        <Button variant="ghost" onPress={() => dismissAddMarkerSheet()}>
          Go Back
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          Add Marker
        </Button>
      </VStack>
    </BottomSheetModal>
  )
})

export default BottomSheetAddMarker