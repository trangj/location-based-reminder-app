import React from 'react'
import { forwardRef } from 'react'
import { Input } from 'native-base'
import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import { useCallback } from 'react'

const BottomSheetInputWrapper = forwardRef(({onBlur, onFocus, ...rest}, ref) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = useCallback(
    args => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents]
  );
  const handleOnBlur = useCallback(
    args => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents]
  );

  return (
    <Input
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      ref={ref}
      {...rest}
    />
  )
}
)
export default BottomSheetInputWrapper