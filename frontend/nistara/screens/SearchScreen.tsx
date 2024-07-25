import React, { useState, useEffect } from "react";
import { Text, View, TextInput, ScrollView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { SQLiteClient } from "../sqlite/localdb";
import PostCard from "../components/PostCard";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const SearchScreen = ({ navigation }: { navigation: any }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState([]);

    const sqliteClient = new SQLiteClient();

    const handleSearch = async () => {
        const results = await sqliteClient.searchPosts(searchQuery);
        if (results) setSearchResults(results);
        else setSearchResults([]);
    }

    const handleRequestItems = async (postid: string) => {
        try {
            const items = await sqliteClient.getRequestItemsWherePostId(postid);
            const itemString = items.join('/ ');
            const message = `I would like to donate ${itemString}`;
            navigation.navigate("WritePost", { message });
        } catch (err) {
            console.error('Unable to fetch request items');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                {searchResults.map((post: any) => (
                    <View key={post.id} style={styles.card}>
                        <PostCard key={post.id} post={post} />
                        <View style={styles.respondToPost}>
                            {(post.class === 'REQUEST_ITEM') ? (
                                <Pressable onPress={() => { handleRequestItems(post.id) }}>
                                    <Text style={styles.responseText}>Be the first to react</Text>
                                </Pressable>
                            ) : (
                                <Pressable onPress={() => { navigation.navigate('WritePost', { message: null }) }}>
                                    <Text style={styles.responseText}>Be the first to react</Text>
                                </Pressable>
                            )}
                            <View style={styles.postInteraction}>
                                <Ionicons name="heart-outline" size={24} color="#000" style={{ paddingHorizontal: 12, top: 2 }} />
                                <FontAwesome name="comment-o" size={22} color="#000" style={{ paddingHorizontal: 12 }} />
                                <Ionicons name="paper-plane-outline" size={22} color='#000' style={{ paddingLeft: 12, top: 2 }} />
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}
export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        marginRight: "5%",
        flex: 1
    },
    scrollView: {
        flex: 1,
    },
    card: {
        paddingVertical: 25,
        paddingHorizontal: 30,
        marginBottom: 5,
        backgroundColor: '#fff',
        elevation: 5
    },
    respondToPost: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
    },
    responseText: {
        color: '#A9A9A9',
        fontWeight: 'bold',
    },
    postInteraction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likePost: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    button: {
        borderColor: '#95A8EF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40, // Ensure the height matches the TextInput
        paddingHorizontal: 15, // Optional: adjust padding for better text fit
        backgroundColor: '#95A8EF'
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: "5%",
        marginTop: "5%"
    }
});
