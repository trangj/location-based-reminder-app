import { Checkbox, CloseIcon, IconButton, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import ListItem from '../../ui/ListItem';

function MarkerDetailsScreen({ route }) {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    async function fetchReminders() {
      const {data, error} = await supabase.from('reminder').select('*').eq('id', route.params.markerId);
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
      .select('*');
    setReminders(data);
  } 

  async function deleteReminder(id) {
    const { data } = await supabase.from('reminder').delete().match({ id })
    setReminders(data);
  }

  return (
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
  )
}

export default MarkerDetailsScreen