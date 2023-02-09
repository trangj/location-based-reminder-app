import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useColorModeValue } from 'native-base'
import React from 'react'

const BottomSheetFlatListWrapper = ({ ...props }) => {
  const indicatorStyle = useColorModeValue('black', 'white')
  return (
    <BottomSheetFlatList
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      indicatorStyle={indicatorStyle}
      {...props}
    />
  )
}

export default BottomSheetFlatListWrapper