// login with email and password
// check against email and password stored in cassandra db
// on successful login, change stayLoggedIn on device to "true" and store User 

import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Pressable } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import SafeViewAndroid from '../components/SafeViewAndroid';
import { dbClient } from '../database/database';
import * as SecureStore from 'expo-secure-store'

interface User {
    userID: string,
    userName: string,
    address: string,
    dateOfBirth: string,
    gender: string,
    profileImage: string,
    maskedNumber: string, 
    email: string,
    phone: string,
    password: string,
    lang: string
  }

const LoginScreen = ({navigation}: {navigation: any}) =>{

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleLogin = async()=>{
        try{
            const client: dbClient = new dbClient()
            const response = await client.getUser(email, password)
            console.log(response)
            if(response.message=='Valid User'){
                setErrorMessage(null)
                const user: User = {
                    userID: response.user.userid,
                    userName: response.user.username,
                    address: response.user.address,
                    dateOfBirth: response.user.dateofbirth,
                    gender: response.user.gender,
                    profileImage: response.user.profileimage,
                    maskedNumber: response.user.maskednumber, 
                    email: response.user.email,
                    phone: response.user.phone,
                    password: response.user.password,
                    lang: response.user.lang
                }
                const userPayloadString = JSON.stringify(user);
                await SecureStore.setItemAsync('User', userPayloadString);
                await SecureStore.setItemAsync('stayLoggedIn', 'true');
                navigation.navigate("HomeTabs")
            }
            else{
                setErrorMessage(response.message)
            }
        }catch(e){
            console.log(e)
        }
    }

    return(
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Log In</Text>
            </View>
            
            <View style={styles.inputSection}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                placeholder="Enter Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                />
                <Text style={styles.label}>Password</Text>
                <View>
                    <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={isPasswordShown}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={{
                            position: "absolute",
                            right: 15,
                            top:12
                        }}
                    >
                        {
                            isPasswordShown == true ? (
                                <Ionicons name="eye-off" size={24} color="#000" />
                            ) : (
                                <Ionicons name="eye" size={24} color="#000" />
                            )
                        }

                    </TouchableOpacity>
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                    style={{
                        ...styles.button,
                        ...{ backgroundColor: '#95A8EF'},
                    }}
                    onPress = {handleLogin}
                    >
                    <Text style={{ fontSize: 18, ... { color: '#FFFFFF' } }}>Log In</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 22
            }}>
                <Text style={{ fontSize: 16 }}>Don't have an account? </Text>
                <Pressable
                    onPress={() => navigation.navigate("Auth", {screen: "OnboardingInit"})}
                >
                    <Text style={{
                        fontSize: 16,
                        color: "#95A8EF",
                        fontWeight: "bold",
                        marginLeft: 6
                    }}>Sign Up</Text>
                </Pressable>
            </View>
        </View>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        paddingTop: 30,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    header: {
        paddingHorizontal: 10
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20
    },
    inputSection: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10
    },
    label:{
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 2,
        paddingTop: 30
    },
    errorText:{
        color: "red",
        paddingVertical: 20
    },
    button:{
        paddingBottom: 14,
        paddingVertical: 14,
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        marginTop: 30
    }
})
