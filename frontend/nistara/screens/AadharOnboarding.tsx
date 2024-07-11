import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Linking, TouchableOpacity } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import { setuClient } from '../setu/digilocker';

interface DigilockerRequest {
    id: string,
    status: string,
    url: string,
    validUpto: string,
    traceId: string
}

const AadharOnboarding = ({navigation}: {navigation: any}) =>{
    const client: setuClient = new setuClient()

    const [digilockerReq, setDigilockerReq] = useState<DigilockerRequest | null>(null)

    const getDigilockerRequest = async() =>{
        const response = await client.getDigilockerRequest()
        setDigilockerReq(response)
    }

    const handlePress = () =>{
        getDigilockerRequest()
        if(digilockerReq) Linking.openURL(digilockerReq.url).catch(err => console.error("Couldn't load page", err));
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
        <Text style={styles.headerText}>Aadhar Onboarding</Text>
        <Text style={styles.descriptionText}>
                To ensure your information remains safe and secure, we need you to verify your identity with your Aadhaar.
        </Text>
        <View style={styles.section}>
            <View style={styles.bulletBox} />
            <Text style={styles.titleText}>Account Safety</Text>
            <Text style={styles.descText}>
                By using Aadhar, we boost security and reliability on our platform, ensuring your account is protected against any fraudulent attempts or unauthorized access.
            </Text>
        </View>
        <View style={styles.section}>
            <View style={styles.bulletBox} />
            <Text style={styles.titleText}>Data Safety And Trust</Text>
            <Text style={styles.descText}>
            Your data is important to us, and safeguarding it is our top priority. Using Aadhaar helps us keep your personal information secure.
            </Text>
        </View>
          
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: '#95A8EF'},
            }}
            onPress = {()=>{handlePress()}}
            >
            <Text style={{ fontSize: 18, ... { color: '#FFFFFF' } }}>Verify now</Text>
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
        left: 20, // Position the bullet box closer to the edge
        width: 8, // Width of the bullet box
        height: 8, // Height of the bullet box
        backgroundColor: '#000',
        marginTop: 10, // Aligns with the title
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
        marginTop: 240,
        marginLeft: 20
    }
      
  });

export default AadharOnboarding;