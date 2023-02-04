import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { FlatList, useToast, Text, Divider, VStack, Button, IconButton, Icon, useColorModeValue } from 'native-base';
import { useEffect, useState } from 'react';
import EmptyChangeGroupList from '../../components/placeholders/EmptyChangeGroupList';
import { supabase } from '../../lib/supabase';
import { useGroupStore } from '../../stores/groupStore';
import { useSessionStore } from '../../stores/sessionStore';
import ListItem from '../../ui/ListItem';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Alert } from 'react-native';
import CustomRefreshControl from '../../ui/CustomRefreshControl';
import ListSkeleton from '../../components/placeholders/ListSkeleton';
import { useCustomActionSheet } from '../../hooks/useCustomActionSheet'

function ChangeGroupScreen() {

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)

  const user = useSessionStore(state => state.user);
  const setGroup = useGroupStore(state => state.setGroup);
  const currentGroup = useGroupStore(state => state.group);

  const navigation = useNavigation();
  const toast = useToast()
  const color = useColorModeValue('gray.500', 'gray.400')
  const { showCustomActionSheetWithOptions } = useCustomActionSheet();
  
  async function fetchGroups() {
    setLoading(true)
    const {data, error} = await supabase
      .from('group_membership')
      .select('group(*)')
      .eq('user_id', user.id)
    setLoading(false)

    if (error) {
      toast.show({description: "Failed to fetch groups."})
    } else {
      setGroups(data)
    }
  }

  useEffect(() => {
    fetchGroups();
  }, [])

  async function handleGroupChange(group) {
    if (currentGroup && currentGroup.id === group.id) return;
    setGroup(group);
    toast.show({description: "Successfully changed group"})
  }

  function handlePress() {
    const options = ['Leave', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showCustomActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case destructiveButtonIndex:
          Alert.alert("Leave group?", "Are you sure you want to leave this group?", [
            {
              text: "Cancel",
              style: 'cancel'
            },
            {
              text: "Leave",
              style: 'destructive',
              onPress: () => null // implement leave group
            }
          ])
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  return (
    <>
      <FlatList 
        data={groups}
        ItemSeparatorComponent={() => (<Divider />)}
        ListEmptyComponent={loading ? ListSkeleton : EmptyChangeGroupList}
        refreshControl={<CustomRefreshControl refreshing={loading} onRefresh={fetchGroups} />}
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
              <Text variant="alt">
                Joined {dayjs(group.group.created_at).format('DD-MM-YYYY')} {'\u2022'} {group.group.number_of_members} Member{group.group.number_of_members === 1 ? '' : 's'}
              </Text>
            </VStack>
            <IconButton icon={<Icon as={Ionicons} name="ellipsis-horizontal" size="md" color={color} />} colorScheme="gray" onPress={() => handlePress()} />
          </ListItem>
        )}
      />
      <VStack mt="auto" space="2" p="3">
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