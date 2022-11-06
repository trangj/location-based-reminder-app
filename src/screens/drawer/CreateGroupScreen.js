import { useNavigation } from '@react-navigation/native';
import { Button, FormControl, Input, KeyboardAvoidingView, ScrollView, Text, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useSessionStore } from '../../stores/sessionStore';
import { useGroupStore } from '../../stores/groupStore';
import { useMarkerStore } from '../../stores/markerStore';


function CreateGroupScreen() {
  const navigation = useNavigation()
  const user = useSessionStore(state => state.user)
  const setGroup = useGroupStore(state => state.setGroup)
  const setMarkers = useMarkerStore(state => state.setMarkers)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      groupName: '',
    }
  });

  const onSubmit = async ({ groupName }) => {
    
    const { data: groupData, error: groupError } = await supabase
    .from('group')
    .insert([
      { group_name: groupName, leader_id: user.id },
    ])
    .select()

    const { error } = await supabase
    .from('group_membership')
    .insert([
      { group_id: groupData[0].id , user_id: user.id },
    ])

    setGroup(groupData[0])
    setMarkers([]);

    if (error || groupError) {
      Alert.alert(error.message)
    } else {
      navigation.navigate("MainNavigator")
    }
  }
  
  return (
    <VStack h="full">
      <ScrollView>
        <VStack space="4" mt="16" p="4">
          <Text fontSize="2xl" >Create Group</Text>
          <FormControl isInvalid={errors.groupName}>
            <FormControl.Label>Group Name</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="groupName"
            />
            <FormControl.ErrorMessage>
              Group name is required.
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <VStack mt="auto" space="2" p="4">
          <Button onPress={handleSubmit(onSubmit)}>
            Create Group
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  )
}

export default CreateGroupScreen