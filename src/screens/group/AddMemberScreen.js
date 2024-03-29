import { useNavigation } from "@react-navigation/native"
import { Button, FormControl, Input, KeyboardAvoidingView, ScrollView, VStack } from "native-base"
import { Controller, useForm } from "react-hook-form"
import { Alert } from "react-native"
import { supabase } from "../../lib/supabase"
import { useGroupStore } from "../../stores/groupStore"

function AddMemberScreen() {
  const navigation = useNavigation()
  const group = useGroupStore(state => state.group)

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async ({ email }) => {
    const { data, error: emailError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

    const { error } = await supabase
    .from('group_membership')
    .insert([
      { group_id: group.id , user_id: data.id },
    ])

    if (error || emailError) {
      Alert.alert(error.message)
    } else {
      reset();
      navigation.navigate("ViewGroup")
    }
  }

  return (
    <VStack h="full">
      <ScrollView>
        <VStack space="4" p="4">
          <FormControl isInvalid={errors.groupName}>
            <FormControl.Label>User Email</FormControl.Label>
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
              name="email"
            />
            <FormControl.HelperText>
              Enter the person's email.
            </FormControl.HelperText>
            <FormControl.ErrorMessage>
              User email is required.
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <VStack mt="auto" space="2" p="3">
          <Button onPress={handleSubmit(onSubmit)}>
            Add User
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  )
}

export default AddMemberScreen