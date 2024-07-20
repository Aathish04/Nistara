import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, RefreshControl } from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { dbClient } from '../database/database';
import { SQLiteClient } from '../sqlite/localdb';
import { images } from '../constants/Images';

// import { posts } from '../sampledata/posts';

const { width: viewportWidth } = Dimensions.get('window');

function formatTimestamp(timestampString: string) {
  // Parse the timestamp string into a Date object
  const timestamp = new Date(timestampString);
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime.getTime() - timestamp.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  // Formatting based on the time difference
  if (hoursDifference === 0) {
    if (minutesDifference === 0) {
      return `Posted ${secondsDifference} s ago`;
    } else {
      return `Posted ${minutesDifference} min${minutesDifference > 1 ? 's' : ''} ago`;
    }
  } else if (hoursDifference < 24) {
    return `Posted ${hoursDifference} hr${hoursDifference > 1 ? 's' : ''} ago`;
  } else if (hoursDifference >= 24 && hoursDifference < 48) {
    const formattedTime = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')} ${timestamp.getHours() >= 12 ? 'pm' : 'am'}`;
    return `Posted yesterday at ${formattedTime}`;
  } else {
    const formattedDate = `${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear().toString().slice(-2)}`;
    const formattedTime = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')} ${timestamp.getHours() >= 12 ? 'pm' : 'am'}`;
    return `Posted on ${formattedDate} at ${formattedTime}`;
  }
}

function formatPostClass(tag: string){
  if(tag=='REQUEST_ITEM') return ['Request', '#ff6666'] 
  else if(tag=='REQUEST_SEARCH') return ['Request', '#ff6666']
  else if(tag=='REQUEST_EVACUATION') return ['Request', '#ff6666']
  else if(tag=='OFFER') return ['Donating', '#FFA700']
  else if(tag=='INFORMATION') return ['Info', '#95A8EF']
  else return null
}


const AllPostsScreen = ({navigation}: {navigation:any}) =>{

  const PostCard = (props: any) =>{
    const { id, profilephoto, username, textcontent, multimediaurl, timestamp, isclassified, istranslated, language, translatedtextcontent} = props.post
    const tag = props.post.class

    // console.log(language)

    // default userprofile
    let userprofile: any;
    if(profilephoto) userprofile = images[profilephoto];
    else userprofile = images["dog.png"]

    // parse and display time stamp
    const parsedTimeStamp: string = formatTimestamp(timestamp)

    // parse tag - get tag text and color
    let parsedTag: string[] | null;
    if(isclassified) parsedTag = formatPostClass(tag)
    else parsedTag = null;

    const [showTranslated, setShowTranslated] = useState(false);

    return (
      <View key = {id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={userprofile} style={styles.profilePhoto} />
          <View style={styles.postDetails}>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.timeOfPost}>{parsedTimeStamp}</Text>
          </View>
          {(istranslated) && (
            <TouchableOpacity onPress={() => setShowTranslated(!showTranslated)} style={styles.translateButton}>
              <Ionicons name="language" size={24} color="#ccc" />
            </TouchableOpacity>
          )}
          </View>
          { parsedTag && (
            <View style={{...styles.tagContainer,
              backgroundColor: parsedTag[1]
            }}>
              <Text style={styles.tagText}>{parsedTag[0]}</Text>
            </View>
          )}   
        <Text style={styles.textContent}>
          {showTranslated ? translatedtextcontent : textcontent}
        </Text>
        {/* {multimediaurl && multimediaurl.length > 0 && (
          <Carousel
            data={multimediaurl}
            renderItem={({ item }: {item: string}) => (
              <Image source={images[item]} style={styles.multimedia} />
            )}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
          />
        )} */}
        </View>
    )

  }

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
      const localRequests = await sqliteClient.getRequests()
      console.log(localRequests)

    } catch (error) {
      console.error('Error fetching posts: ', error);
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
      <View style={{flex:1}}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
          {posts.map((post: any, index: any) => (
            <PostCard post={post} key={index}/>
          ))}
        
      </ScrollView>
      </View>
  );
};

export default AllPostsScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff'
  },
  card:{
    padding: 30,
    marginBottom: 5,
    backgroundColor: '#fff',

  },
  cardHeader:{
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  profilePhoto:{
    height: 40,
    width: 40,
    marginRight: 20,
  },
  postDetails:{
    flexDirection: "column",
    flex: 1
  },
  userName:{
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeOfPost:{
    color: '#888',
    fontSize: 12,
    marginTop: 2
  },
  tagContainer:{
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
    width: '30%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagText:{
    color: '#fff',
    fontSize: 14
  },
  textContent:{
    marginTop: 20,
    fontSize: 14
  },
  // multimedia:{
  //   marginTop: 10,
  //   width: viewportWidth - 40,
  //   height: 200,
  //   borderRadius: 8,
  // },
  translateButton:{
    marginRight: 10
  }
})