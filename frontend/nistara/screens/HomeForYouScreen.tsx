import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import SafeViewAndroid from "../components/SafeViewAndroid";

const ForYouScreen = ({navigation}: {navigation: any}) => {

    return (
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <Text> For You Screen -- Mesh Posts</Text>
        </SafeAreaView>
    )

}

export default ForYouScreen;