import { RefreshControl } from 'react-native'
import React from 'react'
import { useColorModeValue } from 'native-base'

const CustomRefreshControl = ({...props}) => {
  const tintColor = useColorModeValue('black', 'white')
  return (
    <RefreshControl {...props} tintColor={tintColor} />
  )
}

export default CustomRefreshControl