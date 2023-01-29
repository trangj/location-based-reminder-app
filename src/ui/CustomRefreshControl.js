import { RefreshControl } from 'react-native'
import React from 'react'
import { useColorMode } from 'native-base'

const CustomRefreshControl = ({...props}) => {
  const {colorMode} = useColorMode();
  return (
    <RefreshControl {...props} tintColor={colorMode === "dark" ? "white" : "black"} />
  )
}

export default CustomRefreshControl