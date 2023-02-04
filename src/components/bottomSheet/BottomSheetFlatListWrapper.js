import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Divider } from 'native-base'
import React from 'react'
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const BottomSheetFlatListWrapper = ({ ...props }) => {
  const contentOffset = useSharedValue(0);
  
  const animatedDividerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      contentOffset.value,
      [20, 30],
      [0, 1],
    )
  }), [contentOffset]);

  return (
    <>
      <Animated.View style={animatedDividerStyle}>
        <Divider />
      </Animated.View>
      <BottomSheetFlatList
        onScroll={e => contentOffset.value = e.nativeEvent.contentOffset.y}
        {...props}
      />
    </>
  )
}

export default BottomSheetFlatListWrapper