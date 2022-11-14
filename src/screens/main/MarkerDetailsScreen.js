import { Box, Button, Checkbox, CloseIcon, IconButton, Text } from 'native-base';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRemindersStore } from '../../stores/reminderStore';
import ListItem from '../../ui/ListItem';

function MarkerDetailsScreen({ route, navigation }) {
  const reminders = useRemindersStore(state => state.reminders);
  const setReminders = useRemindersStore(state => state.setReminders);

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

  return (
    <>
      <FlatList
        data={reminders}
        keyExtractor={(reminder) => reminder.id}
        renderItem={({item: reminder}) => (
          <ListItem
            justifyContent="space-between"
          >
            <Checkbox
              isChecked={!!reminder.completed_at}
              accessibilityLabel="Reminder completion status"
              onChange={checked => changeReminderStatus(reminder.id, checked)}
            />
            <Text>
              {reminder.description}
            </Text>
            <IconButton 
              icon={<CloseIcon/>}
              onPress={() => deleteReminder(reminder.id)}
            />
          </ListItem>
        )}
      />
      <Box
        bg="white"
        p="3"
      >
        <Button
          onPress={() => navigation.navigate("AddReminder", {markerId: route.params.markerId})}
        >
          Add Reminder
        </Button>
      </Box>
    </>
  )
}

export default MarkerDetailsScreen