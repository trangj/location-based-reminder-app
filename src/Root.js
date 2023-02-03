import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { StatusBar, useColorMode, useColorModeValue, useTheme } from 'native-base'
import React, { useMemo } from 'react'
import AuthNavigator from './navigators/AuthNavigator'


const Root = () => {
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

  const theme = useColorModeValue(CustomDefaultTheme, CustomDarkTheme)
  const backgroundColor = useColorModeValue('white', 'black')
  const barStyle = useColorModeValue('dark-content', 'light-content')

  return (
    <NavigationContainer theme={theme}>
      <AuthNavigator />
      <StatusBar 
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </NavigationContainer>
  )
}

export default Root