import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet } from 'react-native';
import { View, Text, StatusBar } from 'react-native';

function WelcomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <Button onPress={() => navigation.navigate("Login")} title="Login"/>
      <Button onPress={() => navigation.navigate("Register")} title="Register"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen