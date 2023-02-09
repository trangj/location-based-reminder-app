import { useNavigation } from '@react-navigation/native'
import { VStack, Button, Input, Text, FormControl, KeyboardAvoidingView } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import { Platform, ScrollView } from 'react-native';
import { Alert } from 'react-native';
import { useSessionStore } from '../../stores/sessionStore';
import { supabase } from '../../lib/supabase'


function ChangePasswordScreen() {
  const navigation = useNavigation()
  const user = useSessionStore(state => state.user)

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      email: user.email,
      password: '',
      confirm_password: ''
    }
  });

  const onSubmit = async ({ email, password }) => {
    const { error } = await supabase.auth.updateUser({
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
          <Text fontSize="2xl" fontWeight="bold" >Change Password</Text>
          <FormControl isInvalid={errors.password}>
            <FormControl.Label>New Password</FormControl.Label>
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
              New Password is required.
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
        <Button onPress={handleSubmit(onSubmit)}>
            Change Password
          </Button>
      </ScrollView>
    </VStack>
  )
}

export default ChangePasswordScreen