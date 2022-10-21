import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigators/AuthNavigator'
import { NativeBaseProvider } from "native-base";
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
