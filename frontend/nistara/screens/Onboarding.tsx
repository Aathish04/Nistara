import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { setuClient } from '../setu/digilocker';
import {Ionicons} from '@expo/vector-icons'

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
        <Text style={styles.headerText}>How it works?</Text>

        <View style={styles.section}>
            <View style={styles.bulletBox} />
            <Text style={styles.titleText}>Community Driven Response</Text>
            <Text style={styles.descText}>
                Leverage the power of social media and harness the collective strength of your community for faster, smarter disaster management.
            </Text>
        </View>
        <View style={styles.section}>
            <View style={styles.bulletBox} />
            <Text style={styles.titleText}>Always Connected</Text>
            <Text style={styles.descText}>
            Nistara ensures you can always communicate and get help, if needed, even when cell networks are down.
            </Text>
        </View>
        <View style={styles.section}>
            <View style={styles.bulletBox} />
            <Text style={styles.titleText}>Stay Informed, Stay Safe</Text>
            <Text style={styles.descText}>
            Get crucial warnings instantly for timely responses and better safety. Trust Nistara to keep you ahead of disasters.
            </Text>
        </View>
          
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: '#95A8EF'},
            }}
            onPress = {()=>navigation.navigate('AadhaarOnboarding', {digilockerReq: digilockerReq})}
            >
            <Text style={{ fontSize: 18, ... { color: '#FFFFFF' } }}>Get started</Text>
        </TouchableOpacity>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20
      },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 20,
        paddingBottom: 30
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        paddingHorizontal: 20,
        paddingBottom: 30
      },
      section: {
        marginBottom: 20,
        paddingHorizontal: 20,
        position: 'relative',
        paddingLeft: 40, // Adjusted to accommodate the bullet box
      },
      bulletBox: {
        position: 'absolute',
        top: 2,
        left: 20, 
        width: 8, 
        height: 8, 
        backgroundColor: '#000',
        marginTop: 10, 
      },
      titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        paddingLeft: 20
      },
      descText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
        paddingHorizontal: 20,
        paddingBottom: 15
      },
      button: {
        paddingBottom: 14,
        paddingVertical: 14,
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        marginTop: 180,
        marginLeft: 20,
    }
      
  });

export default OnboardingInit;