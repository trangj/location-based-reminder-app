import { FlatList, useToast, Text, Divider } from 'native-base';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useSessionStore } from '../../stores/sessionStore';
import ListItem from '../../ui/ListItem';

function ChangeGroupScreen() {
  const [groups, setGroups] = useState([])
  const user = useSessionStore(state => state.user);
  const setGroup = useGroupStore(state => state.setGroup);
  const currentGroup = useGroupStore(state => state.group);
  const toast = useToast()

  useEffect(() => {
    async function fetchGroups() {
      const {data, error} = await supabase
        .from('group_membership')
        .select('group(*)')
        .eq('user_id', user.id)

      if (error) {
        toast.show({description: "Failed to fetch groups."})
      } else {
        setGroups(data)
      }
    }

    fetchGroups();
  }, [])

  async function handleGroupChange(group) {
    if (currentGroup && currentGroup.id === group.id) return;
    setGroup(group);
    toast.show({description: "Successfully changed group."})
  }

  return (
      <FlatList 
        data={groups}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item: group}) => (
          <ListItem 
            key={group.group.id}
            onPress={() => handleGroupChange(group.group)}
            active={currentGroup && currentGroup.id === group.group.id}
            justifyContent="space-between"
          >
            <Text p="1">
              {group.group.group_name}
            </Text>
            <Text>
              {group.group.number_of_members} Member{group.group.number_of_members === 1 ? '' : 's'}
            </Text>
          </ListItem>
        )}
      />
  )
}

export default ChangeGroupScreen