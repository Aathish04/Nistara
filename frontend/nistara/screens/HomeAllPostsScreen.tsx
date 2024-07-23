import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import { dbClient } from '../database/database';
import { SQLiteClient } from '../sqlite/localdb';;

import PostCard from '../components/PostCard';

// import { posts } from '../sampledata/posts';

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
            </View>
          ))}
        
      </ScrollView>
      </View>
  );
};

export default AllPostsScreen;

const styles = StyleSheet.create({
  card:{
    padding: 30,
    marginBottom: 5,
    backgroundColor: '#fff',
    elevation: 5
  },
  container:{
    flex: 1,
    backgroundColor: '#fff'
  }
})