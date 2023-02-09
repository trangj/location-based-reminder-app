import React from 'react'
import { Skeleton, VStack } from 'native-base'

const ListSkeleton = () => {
  return (
    <VStack mt="5" space="4">
      <Skeleton.Text lines={2} px="3" />
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
      <Skeleton h="1px" />
      <Skeleton.Text lines={2} px="3"/>
    </VStack>
  )
}

export default ListSkeleton