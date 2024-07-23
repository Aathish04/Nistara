import React, {useState, useEffect, useCallback } from 'react'
import { Text, View, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native'
import { useUser } from '../components/UserContext'
import { SQLiteClient } from '../sqlite/localdb'
import PostCard from '../components/PostCard'
import { Ionicons } from '@expo/vector-icons'

const YourProfilePostsScreen = ({navigation}: {navigation: any}) =>{
    const [posts, setPosts] = useState<any>([]);
    const [message, setMessage] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false);
    const [userMadePosts, setUserMadePosts] = useState(false);

    const localDbClient = new SQLiteClient()

    const {userID, userName, profileImage, language} = useUser()

    const fetchUserPosts = useCallback(async () => {
        try {
            const localUserPosts = await localDbClient.getPostsWhereUserId(userID);
            // const localUserPosts = await localDbClient.getPosts();
            if (localUserPosts && localUserPosts.length > 0) {
                setUserMadePosts(true);
                setPosts(localUserPosts);
                setMessage(null);
            } else {
                setUserMadePosts(false);
                setPosts([]);
            }
        } catch (err) {
            console.error('Error fetching posts from local db: ', err);
            setMessage('We are unable to fetch your posts right now. Please try again later!');
        }
    }, [userID]);


    useEffect(()=>{
        fetchUserPosts()
    }, [fetchUserPosts])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserPosts().then(() => setRefreshing(false));
    }, [fetchUserPosts]);

    return(
      <View style={{ flex: 1, backgroundColor: '#fff'}}>
        {message ? (
            <Text style={styles.messageText}>{message}</Text>
        ) : (
            <>
                {!userMadePosts ? (
                    <View style={styles.noPosts}>
                        <Text style={styles.noPostsText}>You haven't made any posts yet.</Text>
                        <Pressable onPress={()=>{navigation.navigate('WritePost')}}>
                            <Text style={{fontWeight: 'bold', color: '#95A8EF', fontSize: 16}}> Start now!</Text>
                        </Pressable>
                    </View>   
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
                        >

                        {posts.map((post: any, index: any) => (
                            <View key = {post.id} style={styles.card}>
                                <PostCard post={post} key={index} />
                                {post.isclassified? (
                                        <>
                                        {
                                          (post.class=='REQUEST_ITEM' || post.class=='REQUEST_EVACUATION' || post.class=='REQUEST_SEARCH')?
                                          (<View style={styles.track}>
                                            <Ionicons name="time-outline" size={24} color={"#95A8EF"} />
                                            <Pressable onPress={()=>{navigation.navigate("Help")}}>
                                                <Text style={styles.trackText}>Track Request Status</Text>
                                            </Pressable>
                                          </View>
                                          )
                                          :(
                                          <>
                                          {
                                            (post.class=='OFFER')?(
                                                <View style={styles.track}>
                                                    <Ionicons name="time-outline" size={24} color={"#95A8EF"} />
                                                    <Pressable onPress={()=>{navigation.navigate("Donate")}}>
                                                        <Text style={styles.trackText}>Track Donation Status</Text>
                                                    </Pressable>
                                                </View>
                                            ): (<></>)
                                          }
                                          </>
                                        )  
                                        }
                                        </>
                                    ):(
                                        <></>
                                    )}
                            </View>
                        ))}

                    </ScrollView>
                )}
            </>
        )}
    </View>
    )
}

export default YourProfilePostsScreen;

const styles = StyleSheet.create({
    card:{
        padding: 20,
        paddingHorizontal: 30,
        marginBottom: 5,
        backgroundColor: '#fff',
        elevation: 5
    
    },
    noPosts:{
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center"
    },
    messageText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noPostsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    track:{
        paddingTop: 20,
        flexDirection: "row"
    },
    trackText:{
        fontWeight: "bold",
        color: "#95A8EF",
        paddingLeft: 5,
        top: 2
    }
});