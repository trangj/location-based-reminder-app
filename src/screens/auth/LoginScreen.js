import { useNavigation } from '@react-navigation/native';
import { VStack, Button, Input, Text, FormControl, KeyboardAvoidingView } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import { Platform, ScrollView } from 'react-native';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase'

function LoginScreen() {
  const navigation = useNavigation()

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
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
          <Text fontSize="2xl" fontWeight="bold" >Login</Text>
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
              Email is required.
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
        </VStack>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
        <VStack mt="auto" space="2" p="4" mb="4">
          <Button onPress={() => navigation.navigate("Register")} variant="ghost">
            Dont have an account?
          </Button>
          <Button onPress={handleSubmit(onSubmit)}>
            Login
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  )
}

export default LoginScreen