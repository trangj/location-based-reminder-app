import { Box, Pressable } from 'native-base'
import React from 'react'

const ListItem = ({ children, onPress, active, ...props }) => {
  return (
    <Pressable onPress={onPress} w="full">
      {({isPressed}) => (
        <Box 
          bg={isPressed || active ? "gray.200" : "white"}
          w="full"
          p="2"
          alignItems="center"
          {...props}
        >
          {children}
        </Box>
      )}
    </Pressable>
  )
}

export default ListItem