import { Text, VStack } from 'native-base'
import React from 'react'

const EmptySearch = () => {
  return (
    <VStack m="3" mt="10" color="gray.500" alignItems="center">
      <Text color="gray.500" textAlign="center" fontWeight="bold">Search Nearby Places</Text>
      <Text color="gray.500" textAlign="center">Enter the name of a store or an address!</Text>
    </VStack>
  )
}

export default EmptySearch