import { useActionSheet } from "@expo/react-native-action-sheet";
import { useColorMode, useTheme } from "native-base";

export function useCustomActionSheet() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useTheme();
  const { colorMode } = useColorMode();

  function showCustomActionSheetWithOptions(options, callback) {
    showActionSheetWithOptions({
      ...options,
      userInterfaceStyle: colorMode === 'dark' ? 'dark' : 'light',
      containerStyle: {
        backgroundColor: colorMode === 'dark' ? colors.gray[900] : 'white'
      },
      textStyle: {
        color: colorMode === 'dark' ? 'white' : 'black'
      },
      useModal: true
    }, callback);
  }
  
  return {
    showCustomActionSheetWithOptions
  }
}