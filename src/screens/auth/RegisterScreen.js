import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>Register!</Text>
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

export default RegisterScreen