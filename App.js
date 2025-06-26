import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MenuGlobal from './src/screens/Menu/MenuGlobal';
import RootStack from './src/routes/RootStack';



export default function App() {
  return (
    <RootStack />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
