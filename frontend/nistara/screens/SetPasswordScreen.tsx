import React, { useState }from 'react';
import { StyleSheet, Text, View, Image, BackHandler, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import { images } from '../constants/Images'
import { sha256 } from 'js-sha256';
import * as SecureStore from 'expo-secure-store';

const SetPasswordScreen = ({route, navigation}: {route: any, navigation: any})=>{
    const {userInfo} = route.params
    // console.log(userInfo)
    const profileImage:any = images[userInfo.profileImage]

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateYourAccount = async () => {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          return;
        }
    
        setLoading(true);
        setErrorMessage('');

        try {
            let userID: string = sha256(userInfo.maskedNumber + userInfo.email + userInfo.phone + userInfo.dateOfBirth).toString();
      
            const userPayload = {
              ...userInfo,
              password,
              userID
            };

            console.log(userPayload)

            const userPayloadString = JSON.stringify(userPayload);
            await SecureStore.setItemAsync('User', userPayloadString);
            await SecureStore.setItemAsync('stayLoggedIn', 'true');

            const retrieveString = await SecureStore.getItemAsync('User');
            if (retrieveString) {
            const userPayload = JSON.parse(retrieveString);
            console.log(userPayload);
            }

            const retrieveStatus = await SecureStore.getItemAsync('stayLoggedIn')
            console.log(retrieveStatus)

            await SecureStore.setItemAsync('stayLoggedIn', 'false');
            const retrieveStatusNew = await SecureStore.getItemAsync('stayLoggedIn')
            console.log(retrieveStatusNew)

            await SecureStore.deleteItemAsync('User');
            const check = await SecureStore.getItemAsync('User');
            if (check) {
            const userPayload = JSON.parse(check);
            console.log(userPayload);
            }
            else{
                console.log("DELETED")
            }

            await SecureStore.deleteItemAsync('stayLoggedIn');
            setLoading(false);
            // navigation.navigate("HomeTabs")
        }catch (error) {
            setLoading(false);
            console.error(error);
          }
    }
    return(
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.header}>
                <View style={styles.circleView}></View>
                <Image source = {profileImage} style={styles.avatar}/>
                <Text style={styles.headerText}>{userInfo.userName}</Text>
            </View>
            <View style={styles.contactSection}>
                    <Ionicons name="mail-open" size={24} color="#ccc"/>
                    <Text style={styles.contactInfo}>{userInfo.email}</Text>
            </View>
            <ScrollView>
            <Text style={styles.passwordMessage}>Create a strong password to keep your account secure.</Text>
            <View style={styles.inputSection}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                placeholder="Enter Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text !== password) {
                      setErrorMessage('Passwords do not match');
                    } else {
                      setErrorMessage('');
                    }
                }}
                />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <Text style={styles.infoText}>You can sign in to your account with your registered email and password</Text>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#95A8EF" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleCreateYourAccount} >
                        <Text style={styles.buttonText}>Create Your Account!</Text>
                    </TouchableOpacity>
                )}
            
                
            </View>
            </ScrollView>
        </View>
    )
}

export default SetPasswordScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
        paddingTop: 60,
        padding: 20
    },
    header:{
        flexDirection: "row",
        marginTop: -100,
        marginLeft: -40
    },
    backButton:{
        zIndex:2
    },
    circleView:{
        marginLeft: -80,
        marginTop: -50,
        backgroundColor: "#95A8EF",
        borderRadius: 300,
        width: 250,
        height: 255,
        opacity: 0.3
    },
    avatar:{
        zIndex: 1,
        borderRadius: 100,
        width: 115,
        height: 115,
        marginTop: 90,
        marginLeft: -75
    },
    headerText:{
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 90,
        marginLeft: 45,
        color: "#95A8EF",
        flexWrap: 'wrap',
        width: 200
    },
    contactSection:{
        flexDirection: "row",
        paddingBottom: 15,
        paddingTop: 50
    },
    contactInfo:{
        color: "#959595",
        marginLeft: 20,
        fontWeight: "bold",
        fontSize: 16,
        paddingBottom: 20
    },
    inputSection: {
        marginTop: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 30,
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
        marginTop: 60,
        marginLeft: 18,
        backgroundColor: '#95A8EF'
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    passwordMessage:{
        fontWeight: "bold",
        fontSize: 18

    },
    infoText:{
        color: "#959595",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 40
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
    },
    label:{
        marginBottom: 15,
        fontSize: 16,
        fontWeight: "bold"
    }
})