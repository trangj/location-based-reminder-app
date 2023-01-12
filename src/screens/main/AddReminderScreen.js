import { Button, FormControl, Input, KeyboardAvoidingView, ScrollView, Text, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useRemindersStore } from '../../stores/reminderStore';

function AddReminderScreen({ route, navigation }) {
  const reminders = useRemindersStore(state => state.reminders);
  const setReminders = useRemindersStore(state => state.setReminders);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      description: '',
    }
  });

  const onSubmit = async ({ description }) => {

    if (!route.params.markerId) {
      return;
    }
    
    const { data, error } = await supabase
    .from('reminder')
    .insert([
      { marker_id: route.params.markerId, description },
    ])
    .select('*')

    setReminders([...reminders, ...data]);

    if (error) {
      Alert.alert(error.message)
    } else {
      navigation.navigate("MarkerDetails", {markerId: route.params.markerId})
    }
  }

  return (
    <VStack h="full" bgColor="white">
      <ScrollView>
        <VStack space="4" p="4">
          <FormControl isInvalid={errors.description}>
            <FormControl.Label>Description</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                />
              )}
              name="description"
            />
            <FormControl.ErrorMessage>
              Reminder description is required.
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <VStack mt="auto" space="2" p="4">
          <Button onPress={handleSubmit(onSubmit)}>
            Add Reminder
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  )
}

export default AddReminderScreen