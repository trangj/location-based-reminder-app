import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigators/AuthNavigator'
import { NativeBaseProvider } from "native-base";
import { SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000'
      }}
    >
      <NativeBaseProvider>
        <NavigationContainer>
          <AuthNavigator />
          <StatusBar />
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}
