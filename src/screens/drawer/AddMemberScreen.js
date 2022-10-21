import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

function AddMemberScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Member!</Text>
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

export default AddMemberScreen