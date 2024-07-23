import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text} from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import { dbClient } from '../database/database';
import { SQLiteClient } from '../sqlite/localdb';;
import { Ionicons, FontAwesome } from '@expo/vector-icons'

import PostCard from '../components/PostCard';

const AllPostsScreen = ({navigation}: {navigation:any}) =>{
  const [posts, setPosts] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const client = new dbClient();
  const sqliteClient = new SQLiteClient();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await client.getPosts();
      if(response.result){
        await sqliteClient.validateAddAndUpdatePosts(response.result, false)
      }
      const localPosts = await sqliteClient.getPosts()
      if(localPosts){
        setPosts(localPosts)
      }

      const requestsResponse = await client.getRequestPosts();
      if(requestsResponse.result){
        await sqliteClient.validateAddAndUpdateRequests(requestsResponse.result)
      }

      const donationResponse = await client.getDonationPosts();
      if(donationResponse.result){
        await sqliteClient.validateAddAndUpdateDonations(donationResponse.result)
      }

      const matchResponse = await client.getMatches();
      if(matchResponse.result){
        await sqliteClient.validateAddAndUpdateMatches(matchResponse.result)
      }

    } catch (error) {
      console.error('Error fetching and updating tables: ', error);
    }
  }, []);

    useEffect(() => {
      fetchPosts();
    }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
    }, [fetchPosts]);

  const handleRequestItems = async(postid : string) =>{
    try{
      const items = await sqliteClient.getRequestItemsWherePostId(postid);
      const itemString = items.join('/ ')
      const message = `I would like to donate ${itemString}`
      navigation.navigate("WritePost", {message})
    }catch(err){
      console.error('Unable to fetch request items')
    }
  }

    return (
      <View style={{flex:1, backgroundColor: '#fff'}}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
          {posts.map((post: any, index: any) => (
            <View key= {post.id} style={styles.card}>
              <PostCard post={post} key={index}/>
              <View style={styles.respondToPost}>
              {(post.class=='REQUEST_ITEM')?(
                
                  <Pressable onPress ={()=>{handleRequestItems(post.id)}}>
                    <Text style={styles.responseText}>Be the first to react</Text>
                  </Pressable>
                  
                ):
              (
                <Pressable onPress ={()=>{navigation.navigate('WritePost', {message: null})}}>
                    <Text style={styles.responseText}>Be the first to react</Text>
                  </Pressable>
              )}
              <View style={styles.postInteraction}>
                <Ionicons name="heart-outline" size={24} color="#000" style={{paddingHorizontal: 12, top: 2}}/>
                <FontAwesome name="comment-o" size={22} color="#000" style={{paddingHorizontal: 12}}/>
                <Ionicons name="paper-plane-outline" size={22} color='#000' style={{paddingLeft: 12, top: 2}}/>
              </View>
              </View>
            </View>
          ))}
        
      </ScrollView>
      </View>
  );
};

export default AllPostsScreen;

const styles = StyleSheet.create({
  card:{
    paddingVertical: 25,
    paddingHorizontal: 30,
    marginBottom: 5,
    backgroundColor: '#fff',
    elevation: 5
  },
  container:{
    flex: 1,
    backgroundColor: '#fff'
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
})