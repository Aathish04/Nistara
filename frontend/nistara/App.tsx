import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { hello,requestPermissionsAsync} from './modules/nearby-connections-expo';
export default function App() {
  let [a,seta] = useState("Hai")
  async function A(){
    seta(JSON.stringify((await requestPermissionsAsync())))
    console.log(a)
  }
  return (
    <View style={styles.container}>
      <Text>{hello()+a}</Text>
      <Button title="Request Perms" onPress={A}></Button>
      <StatusBar style="auto" />
    </View>
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
