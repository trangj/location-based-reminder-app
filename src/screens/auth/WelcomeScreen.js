import { useNavigation } from '@react-navigation/native';
import { VStack, Button, HStack, Text } from 'native-base'

function WelcomeScreen() {
  const navigation = useNavigation()

  return (
    <VStack p="4" h="full" alignItems="center">
      <Text mt="40" fontSize="2xl" fontWeight="bold">Location Based Reminder App</Text>
      <VStack mt="auto" w="full" space="2" mb="4">
        <Button onPress={() => navigation.navigate("Login")}>Login</Button>
        <Button onPress={() => navigation.navigate("Register")}>Register</Button>
      </VStack>
    </VStack>
  )
}

export default WelcomeScreen