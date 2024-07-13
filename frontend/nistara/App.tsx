import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Buffer } from 'buffer';
import { startAdvertising, startDiscovery, sanitycheck,requestPermissionsAsync, addOnEndpointConnectedListener, addOnEndpointLostListener, addonPayloadReceivedListener, sendPayload} from './modules/nearby-connections-expo';
export default function App() {
  let [perms,setPerms] = useState("No Perms Yet")
  let [conns, setConns] = useState<Array<string>>([]);
  const encoder =  new TextEncoder();
  let arr = new Uint8Array();
  async function requestPerms(){
    setPerms(JSON.stringify(await requestPermissionsAsync()))
  }

  function decodeUint8Array(uint8Array: Uint8Array): string {
    let result = '';
    for (let i = 0; i < uint8Array.length; i++) {
      result += String.fromCharCode(uint8Array[i]);
    }
    return result;
  }
  
  addOnEndpointConnectedListener(
  (event) => {
    console.log("Endpoint Found:" + JSON.stringify(event));
    let oldConns = [...conns];
    oldConns.push(event.endpointId)
    oldConns = [...new Set(oldConns)];
    setConns(oldConns)
  });

  addOnEndpointLostListener(
    (event)=>{
      console.log("Endpoint Lost: "+JSON.stringify(event))
      let oldConns = new Set(conns)
      oldConns.delete(event.endpointId);
      setConns([...oldConns]);
    }
  )

  addonPayloadReceivedListener(
    (event)=>{
      console.log(event)
      Alert.alert(`Got Message: ${Buffer.from(event.payload, 'base64').toString('utf-8')}!`)
    }
  )
  function sendData(){
    Alert.alert("Send Payload","Send Payload",[
      {
        text: 'Send Hello',
        onPress: () => {for (let ep of conns){sendPayload(ep,encoder.encode("Hello"))}},
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Send OK', onPress: () => {for (let ep of conns){sendPayload(ep,encoder.encode("OK"))}}},
    ])
  }
  
  return (
    <View style={styles.container}>
      <Text>{sanitycheck()}</Text>
      <Text>{perms}</Text>
      <Button title="Request Perms" onPress={requestPerms}></Button>
      <Button title="Start Advertising" onPress={startAdvertising}></Button>
      <Button title="Start Discovery" onPress={startDiscovery}></Button>
      <Text id='Connections'>Connections: {JSON.stringify(conns)}</Text>
      <Button title="Send Payload" onPress={sendData}></Button>
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
