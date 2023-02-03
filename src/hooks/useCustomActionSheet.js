import { useActionSheet } from "@expo/react-native-action-sheet";
import { useColorModeValue, useTheme } from "native-base";

export function useCustomActionSheet() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useTheme();
  
  const userInterfaceStyle = useColorModeValue('light', 'dark')
  const backgroundColor = useColorModeValue('white', colors.gray[900])
  const color = useColorModeValue('black', 'white')

  function showCustomActionSheetWithOptions(options, callback) {
    showActionSheetWithOptions({
      ...options,
      userInterfaceStyle: userInterfaceStyle,
      containerStyle: {
        backgroundColor: backgroundColor
      },
      textStyle: {
        color: color
      },
      useModal: true
    }, callback);
  }
  
  return {
    showCustomActionSheetWithOptions
  }
}