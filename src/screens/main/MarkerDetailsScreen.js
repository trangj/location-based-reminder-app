import { Button, Checkbox, CloseIcon, IconButton, Text, VStack } from 'native-base';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRemindersStore } from '../../stores/reminderStore';
import { useMarkerStore } from '../../stores/markerStore';
import ListItem from '../../ui/ListItem';
import dayjs from 'dayjs';

function MarkerDetailsScreen({ route, navigation }) {
  const reminders = useRemindersStore(state => state.reminders);
  const setReminders = useRemindersStore(state => state.setReminders);
  const markers = useMarkerStore(state => state.markers);
  const setMarkers = useMarkerStore(state => state.setMarkers);

  useEffect(() => {
    async function fetchReminders() {
      const {data, error} = await supabase.from('reminder').select('*').eq('marker_id', route.params.markerId);
      setReminders(data);
    }

    if (route.params.markerId) {
      fetchReminders();
    }
  }, [])

  async function changeReminderStatus(id, checked) {
    const { data } = await supabase
      .from('reminder')
      .update({
        completed_at: checked ? (new Date()).toISOString() : null,
      })
      .match({ id })
      .select();
    setReminders(
      reminders.map(reminder => {
        if (reminder.id === id) {
          reminder.completed_at = data[0].completed_at;
        }
        return reminder;
      })
    );
  } 

  async function deleteReminder(id) {
    const { error } = await supabase.from('reminder').delete().match({ id })

    if (error) {
      Alert.alert(error.message)
    } else {
      setReminders(reminders.filter(reminder => reminder.id !== id));
    }
  }

  async function deleteMarker() {
    const { error: reminderError } = await supabase.from('reminder').delete().match({ marker_id: route.params.markerId })
    const { error } = await supabase.from('marker').delete().match({ id: route.params.markerId })

    if (error || reminderError) {
      Alert.alert(error.message)
    } else {
      setMarkers(markers.filter(marker => marker.id !== route.params.markerId));
      navigation.navigate("Main")
    }
  }

  return (
    <>
      <FlatList
        data={reminders}
        keyExtractor={(reminder) => reminder.id}
        renderItem={({item: reminder}) => (
          <ListItem>
            <Checkbox
              isChecked={!!reminder.completed_at}
              accessibilityLabel="Reminder completion status"
              onChange={checked => changeReminderStatus(reminder.id, checked)}
              mr="4"
            />
            <VStack>
              <Text>
                {reminder.description}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {dayjs(reminder.created_at).format('DD-MM-YYYY')}
              </Text>
            </VStack>
            <IconButton 
              ml="auto"
              icon={<CloseIcon/>}
              onPress={() => deleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
      <VStack
        bg="white"
        p="4"
        space="2"
      >
        <Button
          onPress={() => navigation.navigate("AddReminder", {markerId: route.params.markerId})}
        >
          Add Reminder
        </Button>
        <Button
          colorScheme='danger'
          onPress={() => deleteMarker()}
        >
          Delete Marker
        </Button>
      </VStack>
    </>
  )
}

export default MarkerDetailsScreen