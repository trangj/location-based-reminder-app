import React from 'react'
import { HStack, Text } from 'native-base'

const BottomSheetHeader = ({ text, leftChildren }) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      p="3"
      pt="0"
    >
      <Text fontSize="2xl" fontWeight="bold">{text}</Text>
      <HStack
        ml="auto"
        space="2"
      >
        {leftChildren}
      </HStack>
    </HStack>
  )
}

export default BottomSheetHeader