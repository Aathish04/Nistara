import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList} from 'react-native';
import { setuClient } from '../setu/digilocker';
import {Ionicons} from '@expo/vector-icons'
import SafeViewAndroid from '../components/SafeViewAndroid';

interface DigilockerRequest {
    id: string,
    status: string,
    url: string,
    validUpto: string,
    traceId: string
}

const OnboardingInit = ({navigation}: {navigation:any}) =>{
    const client: setuClient = new setuClient()

    const [digilockerReq, setDigilockerReq] = useState<DigilockerRequest | null>(null)

    // retrieve request id upon initial render of this screen
    useEffect(()=>{
        const getDigilockerRequestId = async() =>{
            const response = await client.getDigilockerRequest()
            console.log(response)
            setDigilockerReq(response)
        }

        getDigilockerRequestId()
    }, [])


  let listelem = <FlatList contentContainerStyle={styles.infosection}
          data={[
            { title: 'Community Driven Response',text:"Leverage the power of social media and harness the collective strength of your community for faster, smarter disaster management."},
            { title: 'Always Connected',text:"Nistara ensures you can always communicate and get help, if needed, even when cell networks are down."},
            { title: 'Stay Informed, Stay Safe',text:"Get crucial warnings instantly for timely responses and better safety. Trust Nistara to keep you ahead of disasters."},
          ]}
          renderItem={({ item }) => {
            return (<View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text style={styles.titleText}>■ {item.title}</Text>
                </View>
                <Text style={styles.descText}>{item.text}</Text>
                </View>);
          }}
        />
    return (
      <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity
              onPress={() => navigation.goBack()}
              >
              <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>How it works?</Text>
          </View>
          <View style={styles.containerfortextandbutton}>
          <View style={styles.infosection}>
          {listelem}
          </View>
          <View style ={styles.buttoncontainer}>
            <TouchableOpacity
                style={{
                    ...styles.button,
                    ...{ backgroundColor: '#95A8EF'},
                }}
                onPress = {()=>navigation.navigate('AadhaarOnboarding', {digilockerReq: digilockerReq})}
                >
                <Text style={{ fontSize: 20, ... { color: '#FFFFFF' } }}>Get started</Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>
        </SafeAreaView>
      )
}

const styles = StyleSheet.create({

      container: {
          // paddingTop: 30,
          // paddingHorizontal: 10,
          // paddingBottom: 20
          flex:1,
          // alignItems:"center"
        },
        containerfortextandbutton:{
          flex:6,
          alignItems:"center"

        },
      
      header: {
          // paddingHorizontal: 10
          flex:1,

      },
      infosection:{
        flex:4,
        justifyContent:"space-between",
        alignItems: "center",
        marginHorizontal:"2%",
        // marginRight:"2%"
      },
      // buttoncontainer:{
      //   flex:2,
      //   justifyContent:"space-around",
      //   alignItems:"center",
      //   width:"80%"
      // },
      sectionHeading:{
        flexDirection:"row",
        alignItems:"center"
      },
      headerText: {
          fontSize: 26,
          fontWeight: 'bold',
          textAlign: "center",
          // padding: 20,
          // paddingLeft: 10
      },
      
      section: {
        // paddingBottom: 20,
        // paddingLeft: 40,
        // position: 'relative'
      },
      titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        // paddingBottom: 5,
        // paddingLeft: 20
      },
      descText: {
        fontSize: 20,
        color: '#666',
        lineHeight: 24,
        // paddingHorizontal: 20,
        // paddingBottom: 15
      },
      buttoncontainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"space-around",
        width:"80%"
      },
      button: {
        borderColor: '#FFFFFF',
        padding:"5%",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        backgroundColor: '#FFFFFF'
      }
      
  });

export default OnboardingInit;