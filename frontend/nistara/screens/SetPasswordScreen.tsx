import React, { useState }from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons'
import { images } from '../constants/Images'
import { sha256 } from 'js-sha256';
import * as SecureStore from 'expo-secure-store';
import { dbClient } from '../database/database';
import SafeViewAndroid from '../components/SafeViewAndroid';

import { languages } from '../constants/Languages';

const SetPasswordScreen = ({route, navigation}: {route: any, navigation: any})=>{
    const {userInfo} = route.params
    const profileImage:any = images[userInfo.profileImage]
    const client: dbClient = new dbClient()

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [lang, setLang] = useState(languages["English"])


    const languageItems = Object.keys(languages).map(key => ({ label: key, value: languages[key] }));
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
              userID,
              lang
            };
            const userPayloadString = JSON.stringify(userPayload);
            await SecureStore.setItemAsync('User', userPayloadString);
            await SecureStore.setItemAsync('stayLoggedIn', 'true');
            const response = await client.addUser(userPayload);
            console.log(response)

            setLoading(false);
            navigation.navigate("HomeTabs")
        }catch (error) {
            setLoading(false);
            console.error(error);
          }
    }
    return(
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            
            <View style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.circleView}></View>
                <Image source = {profileImage} style={styles.avatar}/>
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>{userInfo.userName}</Text>
                </View>
            </View>
            <ScrollView>
            <View style={styles.content}>
                <View style={styles.contactSection}>
                        <Ionicons name="mail-open" size={24} color="#ccc"/>
                        <Text style={styles.contactInfo}>{userInfo.email}</Text>
                </View>
                
                <Text style={styles.label}>Your Preferred Language</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={lang}
                        onValueChange={(itemValue) => setLang(itemValue)}
                        style={styles.picker}
                    >
                        {languageItems.map(item => (
                            <Picker.Item label={item.label} value={item.value} key={item.value} />
                        ))}
                    </Picker>
                </View>
                
                    <Text style={styles.passwordMessage}>Create a strong password to keep your account secure.</Text>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Set Password</Text>
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
                        <Text style={styles.infoText}>You can sign in to your account with your registered email and password.</Text>     
                    </View>
                
            </View>
            <View style={{alignItems: 'center'}}>
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
        
        </SafeAreaView>
    )
}

export default SetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
      header: {
        flexDirection: "row",
        paddingHorizontal: 10
    },
    circleView:{
        marginLeft: -140,
        marginTop: -120,
        backgroundColor: "#95A8EF",
        borderRadius: 300,
        width: 250,
        height: 255,
        opacity: 0.4
    },
    backButton:{
        zIndex:2
    },
    avatar:{
        zIndex: 1,
        borderRadius: 100,
        width: 105,
        height: 105,
        marginLeft: -70,
        top: 5
    },
    headerContent:{
        flexDirection: "column",
        width: 220,
        paddingLeft: 20,
        paddingVertical: 30,
        paddingRight: 10
    },
    headerText:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#95A8EF"
    },
    content:{
        paddingHorizontal: 15,
        paddingVertical: 30
    },
    contactSection:{
        flexDirection: "row",
        paddingBottom: 10   
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
        backgroundColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    passwordMessage:{
        fontSize: 16,
        fontWeight: "condensedBold"
    },
    infoText:{
        color: "#959595",
        fontWeight: "bold",
        fontSize: 16
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    label:{
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: "bold"
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 30,
    },
    picker: {
        height: 50,
        width: '100%',
    },
})