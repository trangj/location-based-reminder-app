import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { FlatList, useToast, Text, Divider, VStack, Button } from 'native-base';
import { useEffect, useState } from 'react';
import EmptyChangeGroupList from '../../components/placeholders/EmptyChangeGroupList';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useSessionStore } from '../../stores/sessionStore';
import ListItem from '../../ui/ListItem';

function ChangeGroupScreen() {
  const [groups, setGroups] = useState([])
  const user = useSessionStore(state => state.user);
  const setGroup = useGroupStore(state => state.setGroup);
  const currentGroup = useGroupStore(state => state.group);
  const navigation = useNavigation();
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
    <>
      <FlatList 
        data={groups}
        ItemSeparatorComponent={() => (<Divider />)}
        ListEmptyComponent={EmptyChangeGroupList}
        renderItem={({item: group}) => (
          <ListItem 
          key={group.group.id}
          onPress={() => handleGroupChange(group.group)}
          active={currentGroup && currentGroup.id === group.group.id}
          justifyContent="space-between"
          >
            <VStack>
              <Text fontWeight="medium">
                {group.group.group_name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Joined {dayjs(group.group.created_at).format('DD-MM-YYYY')} {'\u2022'} {group.group.number_of_members} Member{group.group.number_of_members === 1 ? '' : 's'}
              </Text>
            </VStack>
          </ListItem>
        )}
      />
      <VStack mt="auto" space="2" p="2" bgColor="white">
        <Button
          onPress={() => navigation.navigate('CreateGroup')}
        >
          Create Group
        </Button>
      </VStack>
    </>
  )
}

export default ChangeGroupScreen