import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

function ViewGroupScreen() {
  return (
    <View style={styles.container}>
      <Text>View Groups!</Text>
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

export default ViewGroupScreen