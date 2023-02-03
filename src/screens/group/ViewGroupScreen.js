import { useEffect, useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { Text, FlatList, VStack, Button, Divider } from 'native-base';
import { supabase } from '../../lib/supabase';
import ListItem from '../../ui/ListItem';
import { useNavigation } from '@react-navigation/native';
import EmptyGroup from '../../components/placeholders/EmptyGroup';
import dayjs from 'dayjs';
import CustomRefreshControl from '../../ui/CustomRefreshControl';
import ListSkeleton from '../../components/placeholders/ListSkeleton';

function ViewGroupScreen() {
  const group = useGroupStore(state => state.group);
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  async function fetchMembers() {
    setLoading(true)
    const {data, error} = await supabase
      .from('group_membership')
      .select('profiles:user_id(*), created_at')
      .eq('group_id', group.id)
    setLoading(false)

    if (error) {
      toast.show({description: "Failed to fetch groups."})
    } else {
      setMembers(data)
    }
  }

  useEffect(() => {
    if (group) {
      fetchMembers();
    }
  }, [group])

  return group ? (
    <>
      <FlatList 
        data={members}
        ListEmptyComponent={loading && ListSkeleton}
        ItemSeparatorComponent={() => (<Divider />)}
        refreshControl={<CustomRefreshControl refreshing={loading} onRefresh={fetchMembers} />}
        renderItem={({item: member}) => (
          <ListItem 
            key={member.profiles.id}
          >
            <VStack>
              <Text fontWeight="medium">
                {member.profiles.email}
              </Text>
              <Text variant="alt">
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