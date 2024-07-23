import React from 'react';
import {Text, TouchableOpacity, View, Linking, Image, StyleSheet, ScrollView} from 'react-native';
import { newsArticles } from '../newsdata/articles';
import { LinearGradient } from "expo-linear-gradient";

const WarningsAwarenessScreen = ({}) =>{
    const NewsCard = ({article}: {article: any}) => {
        const handlePress = () => {
            Linking.openURL(article.siteUrl).catch((err) =>
                console.error("An error occurred", err)
              );
        }

        return (
            <TouchableOpacity style={styles.card} onPress={handlePress} key={article.id}>
                <View style={{ padding: 5 }}>
                    <Image source={{ uri: article.imageUrl }} style={styles.cardImage} />
                    <LinearGradient
                    colors={["transparent", "white"]}
                    style={styles.fadeEffect}/>
                </View>
                <View style={styles.textContent}>
                    <Text style={styles.title}>{article.title}</Text>
                    <Text style={styles.body}>{article.descText}</Text>
                </View>
          </TouchableOpacity>
        )
    }

    return(
        <View style={{flex:1, backgroundColor: '#fff'}}>
            <Text style={styles.headerText}>Ensure the safety of yourself, your loved ones and our community with Nistara!</Text>
            <ScrollView
            style={{ flex: 1 }} >
                {
                    newsArticles.map((article: any, index:any)=>(
                        <View key={article.id}>
                            <NewsCard article = {article} key={article.id} />
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}
export default WarningsAwarenessScreen;

const styles= StyleSheet.create({
    card: {
        marginBottom: 20,
        borderRadius: 35,
        overflow: "hidden",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    },
    cardImage: {
        width: "100%",
        height: 175,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    fadeEffect: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60%",
        justifyContent: "flex-end",
        padding: 10,
    },
    textContent: {
        padding: 10,
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
    },
    body: {
        fontSize: 15,
        color: "#666",
        marginVertical: 15,
    },
    headerText:{
        fontSize: 17,
        color: '#787676',
        paddingHorizontal: 20,
        paddingVertical: 12
    }
})