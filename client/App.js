import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Router from './Router';

export default function App() {
  return (
    <View style = {{flex:1}}>
      <Router />
    </View>
  );
}

