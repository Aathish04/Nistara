import React, {useState, useEffect} from 'react';
import { Text, TouchableOpacity, SafeAreaView, View, StyleSheet, Image } from 'react-native';
import SafeViewAndroid from '../components/SafeViewAndroid';
import * as SecureStore from 'expo-secure-store'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {Ionicons} from '@expo/vector-icons'
import { images } from '../constants/Images';

const Tab = createMaterialTopTabNavigator();

import YourProfilePostsScreen from './YourProfilePostsScreen';
import YourProfileDonationsScreen from './YourProfileDonationsScreen';
import YourProfileRequestsScreen from './YourProfileRequestsScreen';

const YourProfileTopTabs = () =>{
    return(
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: "gray", 
            tabBarLabelStyle: {
              fontSize: 15,
              textTransform: "none",
              fontWeight: "600",
            },
            tabBarIndicatorStyle: { backgroundColor: "#000", width: "25%", marginLeft: "4%"},
            tabBarPressColor: "#ddd",
            tabBarStyle: { backgroundColor: "white",  marginTop: 0, paddingTop: 7},
            tabBarIndicatorContainerStyle: { backgroundColor: "white", alignItems: "center"},
            tabBarActiveLabelStyle: { fontWeight: "500" },
          })}
        >
            <Tab.Screen 
                name="Posts"
                component={YourProfilePostsScreen}
            />
            <Tab.Screen 
                name="Help"
                component={YourProfileRequestsScreen}
            />
            <Tab.Screen 
                name = "Donate"
                component={YourProfileDonationsScreen}
            />
        </Tab.Navigator>
    )
}


const YourProfileScreen = ({navigation}:{navigation:any}) =>{
    
    const [userDetails, setUserDetails] = useState<any>(null)

    useEffect(()=>{
        const getUserDetails = async() =>{
            const jsonValue = await SecureStore.getItemAsync('User');
            if(jsonValue){
            const { userID, userName, profileImage, language, address} = JSON.parse(jsonValue);
            setUserDetails({userID, userName, profileImage, language, address})
            }
        }
        getUserDetails()
    }, [])

    const handleLogOut = async() =>{
        await SecureStore.deleteItemAsync('User');
        await SecureStore.setItemAsync('stayLoggedIn', 'false');
        navigation.navigate("SplashScreen")
    }

    const getDistrictAndState = (address: string) => {
        const addressParts = address.split(', ');
        const district = addressParts[addressParts.length - 2];
        const stateAndPin = addressParts[addressParts.length - 1];
        const state = stateAndPin.split('-')[0]
        return `${district}, ${state}`;
    }

    return(
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.titleText}>Your Profile</Text>
                    </View>
                    <View style={styles.logout}>
                        <TouchableOpacity onPress={()=>{handleLogOut()}}>
                            <Ionicons name = "power" size={24} color="#FF6666" />
                        </TouchableOpacity>
                        <Text>Log out</Text>
                    </View>
                </View>
                <View style={{
                borderWidth: 0.2,
                borderColor: "#bbb",
                 }}/>
                {userDetails && (
                    <View style={styles.profileContainer}>
                        <Image source = {images[userDetails.profileImage]} style = {styles.profilePhoto} />
                        <View style={styles.userDetailsContainer}>
                            <Text style={styles.userNameText}>{userDetails.userName}</Text>
                            <View style={styles.addressContainer}>
                                <Ionicons name="location" size={22} color="#95A8EF" />
                                <Text style={styles.addressText}>{getDistrictAndState(userDetails.address)}</Text>
                            </View>
                        </View>
                    </View>
                )}
                < YourProfileTopTabs />
            </View>
        </SafeAreaView>
    )
}
export default YourProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        padding: 20
        
    },
    titleContainer:{
        flexDirection: "row"
    },
    titleText:{
        fontWeight: "bold",
        fontSize: 22,
        paddingLeft: 20
    },
    profileContainer:{
        flexDirection: "row",
        padding: 20,
        paddingBottom: 10
    },
    profilePhoto:{
        width: 70,
        height: 70
    },
    userDetailsContainer:{
        flexDirection: "column",
        paddingLeft: 20
    },
    userNameText:{
        fontWeight: "bold",
        fontSize: 19,
        paddingBottom: 10
    },
    addressContainer:{
        flexDirection: "row"
    },
    addressText: {
        fontSize: 16,
        paddingLeft: 8
    },
    logout:{
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        marginRight: 10
    }
})