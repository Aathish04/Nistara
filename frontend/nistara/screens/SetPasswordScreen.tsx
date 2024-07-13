import React from 'react';
import { StyleSheet, Text, View, Image, BackHandler, TouchableOpacity } from 'react-native';
import {Ionicons} from '@expo/vector-icons'

const SetPasswordScreen = ({route, navigation}: {route: any, navigation: any})=>{
    const {userInfo} = route.params
    console.log(userInfo)
    return(
        <Text>Password Screen</Text>
    )
}

export default SetPasswordScreen;