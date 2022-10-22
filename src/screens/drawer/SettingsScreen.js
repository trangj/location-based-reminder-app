import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button } from 'native-base'
import { supabase } from '../../lib/supabase'

function SettingsScreen() {
  return (
    <View style={styles.container}>
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