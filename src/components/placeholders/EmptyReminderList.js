import { Text, VStack } from 'native-base'
import React from 'react'

const EmptyReminderList = () => {
  return (
    <VStack m="2" mt="10" color="gray.500" alignItems="center">
      <Text color="gray.500" textAlign="center" fontWeight="bold">No Reminders</Text>
      <Text color="gray.500" textAlign="center">Add a reminder to this marker by pressing the + icon!</Text>
    </VStack>
  )
}

export default EmptyReminderList