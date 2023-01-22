import { Text, VStack } from 'native-base'
import React from 'react'

const EmptyChangeGroupList = () => {
  return (
    <VStack m="3" mt="10" color="gray.500" alignItems="center">
      <Text color="gray.500" textAlign="center" fontWeight="bold">No Groups</Text>
      <Text color="gray.500" textAlign="center">Ask someone to add you or create a group yourself!</Text>
    </VStack>
  )
}

export default EmptyChangeGroupList