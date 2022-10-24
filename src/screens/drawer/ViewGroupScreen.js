import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { useGroupStore } from '../../stores/groupStore';

function ViewGroupScreen() {
  const group = useGroupStore(state => state.group);

  return (
    <View style={styles.container}>
      <Text>{group ? group.group_name : 'Not in a group'}</Text>
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