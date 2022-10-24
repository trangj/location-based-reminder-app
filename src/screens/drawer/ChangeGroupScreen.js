import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useSessionStore } from '../../stores/sessionStore';

function ChangeGroupScreen() {
  const [groups, setGroups] = useState([])
  const user = useSessionStore(state => state.user);

  useEffect(() => {
    async function fetchGroups() {
      const {data, error} = await supabase
        .from('group_membership')
        .select('group(*)')
        .eq('user_id', user.id)

      setGroups(data)
    }

    fetchGroups();
  })

  return (
    <View style={styles.container}>
      {groups.map(({group}) => (
        <Text key={group.id}>{group.group_name}</Text>
      ))}
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

export default ChangeGroupScreen