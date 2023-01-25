import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { StatusBar, useColorMode, useTheme } from 'native-base'
import React, { useMemo } from 'react'
import AuthNavigator from './navigators/AuthNavigator'


const Root = () => {
  const { colorMode } = useColorMode()
  const { colors } = useTheme();

  const CustomDarkTheme = useMemo(() => ({
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      card: colors.gray[900],
      background: colors.gray[900]
    }
  }), [])

  const CustomDefaultTheme = useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    }
  }), [])

  return (
    <NavigationContainer theme={colorMode === "dark" ? CustomDarkTheme : CustomDefaultTheme}>
      <AuthNavigator />
      <StatusBar 
        backgroundColor={colorMode === "dark" ? "black" : "white"}
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
      />
    </NavigationContainer>
  )
}

export default Root