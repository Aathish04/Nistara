import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { startAdvertising, startDiscovery, sanitycheck,requestPermissionsAsync, addOnEndpointConnectedListener, addOnEndpointLostListener} from './modules/nearby-connections-expo';
export default function App() {
  let [perms,setPerms] = useState("No Perms Yet")
  async function requestPerms(){
    setPerms(JSON.stringify(await requestPermissionsAsync()))
  }

  addOnEndpointConnectedListener((event)=>{console.log("Endpoint Found:"+JSON.stringify(event))})
  addOnEndpointLostListener((event)=>{console.log("Endpoint Lost: "+JSON.stringify(event))})
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

