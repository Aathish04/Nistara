import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { SQLiteClient } from "../sqlite/localdb";

const ForYouScreen = ({navigation}: {navigation: any}) => {
    const client = new SQLiteClient()

    const testSQLite = async() =>{
        console.log("here")
        // await client.createTable()
        await client.getAllPosts()
    }

    return (
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <TouchableOpacity onPress= {()=>{testSQLite()}}>
                <Text>Click here to test sqlite</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}

export default ForYouScreen;