import { useEffect, useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { Text, FlatList, VStack, Button, Divider } from 'native-base';
import { supabase } from '../../lib/supabase';
import ListItem from '../../ui/ListItem';
import { useNavigation } from '@react-navigation/native';

function ViewGroupScreen() {
  const group = useGroupStore(state => state.group);
  const [members, setMembers] = useState([])
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchMembers() {
      const {data, error} = await supabase
        .from('group_membership')
        .select('profiles:user_id(*)')
        .eq('group_id', group.id)
        
      if (error) {
        toast.show({description: "Failed to fetch groups."})
      } else {
        setMembers(data)
      }
    }

    fetchMembers();
  }, [group])

  return (
    <>
      <FlatList 
        data={members}
        ItemSeparatorComponent={() => (<Divider />)}
        renderItem={({item: member}) => (
          <ListItem 
            key={member.profiles.id}
          >
            <Text p="1">
              {member.profiles.email}
            </Text>
          </ListItem>
        )}
      />
      <VStack mt="auto" space="2" p="2" bgColor="white">
        <Button
          onPress={() => navigation.navigate('AddMember')}
        >
          Add Member
        </Button>
        <Button
          colorScheme="danger"
        >
          Leave Group
        </Button>
      </VStack>
    </>
  )
}

export default ViewGroupScreen