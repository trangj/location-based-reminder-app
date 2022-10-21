import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet } from 'react-native';
import { View, Text, StatusBar } from 'react-native';

function LoginScreen() {
  const navigation = useNavigation()
  
  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate("DrawerNavigator")} title="Login"/>
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

export default LoginScreen