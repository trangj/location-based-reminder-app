import { Box, Pressable } from 'native-base'
import React from 'react'

const ListItem = ({ children, onPress, onLongPress, active, ...props }) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} w="full">
      {({isPressed}) => (
        <Box 
          bg={isPressed || active ? "gray.200" : "white"}
          w="full"
          p="2"
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          {...props}
        >
          {children}
        </Box>
      )}
    </Pressable>
  )
}

export default ListItem