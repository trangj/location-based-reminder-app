import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button, Text, useColorMode } from 'native-base'
import { supabase } from '../../lib/supabase'
import { useSessionStore } from '../../stores/sessionStore';
import { useNavigation } from '@react-navigation/native';

function SettingsScreen() {
  const user = useSessionStore(state => state.user)
  const navigation = useNavigation()
  const { toggleColorMode } = useColorMode();

  return (
    <View style={styles.container}>
      <Text>Signed in as {user.email}</Text>
      <Button onPress={() => toggleColorMode()}>Change Theme</Button>
      <Button onPress={() => navigation.navigate("ChangePassword")}>Change Password</Button>
      <Button onPress={() => supabase.auth.signOut()}>Logout</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen