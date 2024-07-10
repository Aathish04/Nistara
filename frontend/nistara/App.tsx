import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { startAdvertising, startDiscovery, sanitycheck,requestPermissionsAsync} from './modules/nearby-connections-expo';
export default function App() {
  let [perms,setPerms] = useState("No Perms Yet")
  async function requestPerms(){
    setPerms(JSON.stringify(await requestPermissionsAsync()))
  }
  return (
    <View style={styles.container}>
      <Text>{sanitycheck()}</Text>
      <Text>{perms}</Text>
      <Button title="Request Perms" onPress={requestPerms}></Button>
      <Button title="Start Advertising" onPress={startAdvertising}></Button>
      <Button title="Start Discovery" onPress={startDiscovery}></Button>
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
