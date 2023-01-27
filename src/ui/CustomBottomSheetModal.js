import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorMode, useTheme } from 'native-base';
import React from 'react'
import { useCallback } from 'react';
import { useMemo } from 'react';
import { forwardRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomBottomSheetModal = forwardRef(({ children, ...props }, ref) => {

  const { colorMode } = useColorMode()
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['10%', '35%', '100%'], []);
  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={2}
      disappearsOnIndex={1}
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
      {children}
    </BottomSheetModal>
  )
})

export default CustomBottomSheetModal