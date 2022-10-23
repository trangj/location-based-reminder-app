import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button, Text } from 'native-base'
import { supabase } from '../../lib/supabase'
import { useSessionStore } from '../../stores/sessionStore';

function SettingsScreen() {
  const user = useSessionStore(state => state.user)
  return (
    <View style={styles.container}>
      <Text>Signed in as {user.email}</Text>
      <Button onPress={() => supabase.auth.signOut()}>Logout</Button>
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

export default SettingsScreen