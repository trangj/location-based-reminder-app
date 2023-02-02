import { BottomSheetBackdrop, BottomSheetModal, useBottomSheet } from '@gorhom/bottom-sheet';
import { useColorMode, useTheme } from 'native-base';
import React from 'react'
import { useCallback } from 'react';
import { useMemo } from 'react';
import { forwardRef } from 'react'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomBottomSheetModalContentWrapper = ({ children }) => {
  const {animatedIndex} = useBottomSheet();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 0.5],
      [0, 1]
    )
  }), [animatedIndex])

  return (
    <Animated.View style={[containerAnimatedStyle, { flex: 1 }]}>
      {children}
    </Animated.View>
  )
}

const CustomBottomSheetModal = forwardRef(({ children, header, ...props }, ref) => {
  const { colorMode } = useColorMode()
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['10%', '40%', '100%'], []);
  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={2}
      disappearsOnIndex={1}
      pressBehavior="collapse"
    />
  ), [])

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      topInset={insets.top}
      backgroundStyle={{
        backgroundColor: colorMode === "dark" ? colors.gray[900] : "white"
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.gray[500]
      }}
      {...props}
    >
      {header}
      <CustomBottomSheetModalContentWrapper>
        {children}
      </CustomBottomSheetModalContentWrapper>
    </BottomSheetModal>
  )
})

export default CustomBottomSheetModal