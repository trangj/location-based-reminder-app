import { useNavigation } from '@react-navigation/native'
import { VStack, Button, Input, Text, FormControl, KeyboardAvoidingView } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import { Platform, ScrollView } from 'react-native';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase'

function RegisterScreen() {
  const navigation = useNavigation()

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  });

  const onSubmit = async ({ email, password }) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    } else {
      navigation.navigate("DrawerNavigator")
    }
  }

  return (
    <VStack h="full">
      <ScrollView>
        <VStack space="4" mt="16" p="4">
          <Text fontSize="2xl" >Register</Text>
          <FormControl isInvalid={errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            <FormControl.ErrorMessage>
              Enter a valid email.
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormControl.Label>Password</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            <FormControl.ErrorMessage>
              Password is required.
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.confirm_password}>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true, validate: value => value === getValues('password') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="confirm_password"
            />
            <FormControl.ErrorMessage>
              Passwords do not match.
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
        <VStack mt="auto" space="2" p="4">
          <Button onPress={() => navigation.navigate("Login")} variant="ghost">
            Already have an account?
          </Button>
          <Button onPress={handleSubmit(onSubmit)}>
            Register
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  )
}

export default RegisterScreen