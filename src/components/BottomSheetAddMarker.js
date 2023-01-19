import { Button, CloseIcon, FormControl, HStack, IconButton, Text, useToast, VStack } from 'native-base'
import React, { forwardRef } from 'react'
import { useMarkerStore } from '../stores/markerStore'
import { useGroupStore } from '../stores/groupStore'
import { Controller, useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native'
import BottomSheetInputWrapper from '../ui/BottomSheetInputWrapper'
import CustomBottomSheetModal from '../ui/CustomBottomSheetModal'

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
  const setMarkers = useMarkerStore(state => state.setMarkers)
  const markers = useMarkerStore(state => state.markers)
  const group = useGroupStore(state => state.group)

  // marker form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
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
      reset();
      setMarkers([...markers, ...data])
      toast.show({description: "Successfully added marker."})
      dismissAddMarkerSheet();
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
      <VStack space="2" px="3">
        <HStack
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold">Add Marker</Text>
          <HStack
            ml="auto"
          >
            <IconButton 
              colorScheme="gray"
              borderRadius="full"
              variant="subtle"
              size="sm"
              icon={<CloseIcon />}
              onPress={() => dismissAddMarkerSheet()}
            />
          </HStack>
        </HStack>
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
    </CustomBottomSheetModal>
  )
})

export default BottomSheetAddMarker