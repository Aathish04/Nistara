import React from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import SafeViewAndroid from '../components/SafeViewAndroid';
import * as SecureStore from 'expo-secure-store'


const YourProfileScreen = ({navigation}:{navigation:any}) =>{
    const handleLogOut = async() =>{
        await SecureStore.deleteItemAsync('User');
        await SecureStore.setItemAsync('stayLoggedIn', 'false');
        navigation.navigate("SplashScreen")
    }
    return(
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <TouchableOpacity onPress={handleLogOut}>
                <Text>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
export default YourProfileScreen;