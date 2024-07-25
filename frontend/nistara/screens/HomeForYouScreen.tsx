import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { SQLiteClient } from "../sqlite/localdb";

const ForYouScreen = ({navigation}: {navigation: any}) => {
    const sqliteClient = new SQLiteClient()
    const deleteAllTables = async() =>{
        // await sqliteClient.clearAllTables()
        // const {postclassData, umbrellatypeData} = await sqliteClient.getRequestCounts()
        // console.log(postclassData)
        // console.log(umbrellatypeData)
        await sqliteClient.searchPosts("food")
    }
    return (

        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <TouchableOpacity onPress = {()=>{deleteAllTables()}}>
                <Text> For You Screen -- Mesh Posts</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}

export default ForYouScreen;