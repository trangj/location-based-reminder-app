import { Divider, ScrollView, Text, useColorMode, VStack } from 'native-base'
import { supabase } from '../../lib/supabase'
import { useSessionStore } from '../../stores/sessionStore';
import { useNavigation } from '@react-navigation/native';
import ListItem from '../../ui/ListItem';
import dayjs from 'dayjs';

function SettingsScreen() {
  const user = useSessionStore(state => state.user)
  const navigation = useNavigation()
  const { toggleColorMode } = useColorMode();

  return (
    <ScrollView>
      <VStack p="3">
        <Text fontWeight="medium">
            {user.email}
        </Text>
        <Text variant="alt">User since {dayjs(user.created_at).format('DD-MM-YYYY')}</Text>
      </VStack>
      <ListItem onPress={() => toggleColorMode()}>
        <Text>
          Change Theme
        </Text>
      </ListItem>
      <Divider />
      <ListItem onPress={() => navigation.navigate("ChangePasswordScreen")}>
        <Text>
          Change Password
        </Text>
      </ListItem>
      <Divider />
      <ListItem onPress={() => navigation.navigate("ChangeEmailScreen")}>
        <Text>
          Change Email
        </Text>
      </ListItem>
      <Divider />
      <ListItem onPress={() => supabase.auth.signOut()}>
        <Text>
        Logout
        </Text>
      </ListItem>
    </ScrollView>
  )
}

export default SettingsScreen