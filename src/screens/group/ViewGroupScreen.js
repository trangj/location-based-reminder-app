import { useEffect, useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { Text, FlatList, VStack, Button, Divider } from 'native-base';
import { supabase } from '../../lib/supabase';
import ListItem from '../../ui/ListItem';
import { useNavigation } from '@react-navigation/native';
import EmptyGroup from '../../components/placeholders/EmptyGroup';
import dayjs from 'dayjs';

function ViewGroupScreen() {
  const group = useGroupStore(state => state.group);
  const [members, setMembers] = useState([])
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchMembers() {
      const {data, error} = await supabase
        .from('group_membership')
        .select('profiles:user_id(*), created_at')
        .eq('group_id', group.id)

      if (error) {
        toast.show({description: "Failed to fetch groups."})
      } else {
        setMembers(data)
      }
    }

    if (group) {
      fetchMembers();
    }
  }, [group])

  return group ? (
    <>
      <FlatList 
        data={members}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item: member}) => (
          <ListItem 
            key={member.profiles.id}
          >
            <VStack>
              <Text fontWeight="medium">
                {member.profiles.email}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Member since {dayjs(member.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
          </ListItem>
        )}
      />
      <VStack mt="auto" space="2" p="3">
        <Button
          onPress={() => navigation.navigate('AddMember')}
        >
          Add Member
        </Button>
      </VStack>
    </>
  ) : (
    <EmptyGroup />
  )
}

export default ViewGroupScreen