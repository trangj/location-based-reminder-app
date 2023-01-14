import { Text, VStack } from 'native-base'
import React from 'react'

const EmptyGroup = () => {
  return (
    <VStack m="2" mt="10" color="gray.500" alignItems="center">
      <Text color="gray.500" textAlign="center" fontWeight="bold">You are not in a group</Text>
      <Text color="gray.500" textAlign="center">Create or join a group to view or create markers!</Text>
    </VStack>
  )
}

export default EmptyGroup