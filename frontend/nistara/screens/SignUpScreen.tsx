import React from 'react';
import { StyleSheet, Text, View, Image, BackHandler } from 'react-native';

const SignUpScreen = ({route, navigation}:{route:any, navigation:any})=>{
    const {aadhaarInfo, email, phone} = route.params
    console.log(aadhaarInfo)
    return(
        <View>
        <Text>Hello World</Text>
        <Image source={{ uri: aadhaarInfo.photo }} />
        </View>
    )
}

export default SignUpScreen