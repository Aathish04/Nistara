import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { SQLiteClient } from "../sqlite/localdb";
import { startAdvertising, startDiscovery, sanitycheck,requestPermissionsAsync, addOnEndpointConnectedListener, addOnEndpointLostListener, addonPayloadReceivedListener, sendPayload} from '../modules/nearby-connections-expo';
import { Buffer } from 'buffer';
import { useFocusEffect } from "@react-navigation/native";

const ForYouScreen = ({navigation}: {navigation:any}) =>{
    const sqliteClient = new SQLiteClient()
    const deleteAllTables = async() =>{
        // await sqliteClient.clearAllTables()
        // const {postclassData, umbrellatypeData} = await sqliteClient.getRequestCounts()
        // console.log(postclassData)
        // console.log(umbrellatypeData)
        await sqliteClient.searchPosts("food")
    }

    const encoder = new TextEncoder()

    let [conns,setConns] = useState<string[]>([]);

    addOnEndpointConnectedListener(
    (event) => {
      console.log("Endpoint Found:" + JSON.stringify(event));
      let oldConns = [...conns];
      oldConns.push(event.endpointId)
      oldConns = [...new Set(oldConns)];
      setConns(oldConns)
      for (let ep of oldConns){sendPayload(ep,encoder.encode(`Hello ${ep}`))}
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
        Alert.alert(`Got Message!`,Buffer.from(event.payload, 'base64').toString('utf-8'))
      }
    )

    
useFocusEffect(
    React.useCallback(() => {
        const startMesh = async () => {
            try {
                const permissions = await requestPermissionsAsync();
                let allperms = true
                for (let perm in permissions){
                    if (permissions[perm].granted!=true){
                        allperms = false
                        Alert.alert("Warning!",`You won't be able to use our Mesh network without the ${perm} permission!`);
                    }
                }
                if (allperms){
                    console.log(`StartAdvertising: ${await startAdvertising()}`)
                    // console.log(`StartDiscovery: ${await startDiscovery()}`)
                }
            } catch (e) {
              // Handle error
            }
          };
        startMesh();
    }, [])
  );


    return (

        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <TouchableOpacity onPress = {()=>{deleteAllTables()}}>
                <Text> For You Screen -- Mesh Posts</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}

export default ForYouScreen;