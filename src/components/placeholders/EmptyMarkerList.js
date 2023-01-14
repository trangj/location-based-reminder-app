import { Text, VStack } from 'native-base'
import React from 'react'
import { useGroupStore } from '../../stores/groupStore'
import EmptyGroup from './EmptyGroup';

const EmptyMarkerList = () => {
  const group = useGroupStore(state => state.group);

  return group ? (
    <VStack m="2" mt="10" color="gray.500" alignItems="center">
      <Text color="gray.500" textAlign="center" fontWeight="bold">No Markers</Text>
      <Text color="gray.500" textAlign="center">Search or find a place and long press on the map to create a new marker!</Text>
    </VStack>
  ) : (
    <EmptyGroup />
  )
}

export default EmptyMarkerList