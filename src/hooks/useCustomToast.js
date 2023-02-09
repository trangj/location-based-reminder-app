import { useColorModeValue, useToast } from "native-base";
import { Dimensions } from "react-native";

export function useCustomToast() {
  const toast = useToast();
  const bg = useColorModeValue('gray.900', 'gray.100')
  const color = useColorModeValue('white', 'black')
  
  function show(options) {
    toast.show({
      ...options,
      placement: 'top',
      bg,
      rounded: 'full',
      _description: {
        color,
        px: '3',
        fontSize: 'sm'
      }
    })
  }
  
  return {
    show
  }
}