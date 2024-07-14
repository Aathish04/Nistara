import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image , ScrollView} from 'react-native';
import {dbClient} from '../database/database';

const PostCard = (props:Object) => {
    const { profilephoto, username, textualinfo, multimediaurl, timestamp, isclassified, tag, geolocation } = props.post;
  
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={profilephoto ? { uri: profilephoto } : require('../assets/profile/dog.png')}
            style={styles.profilePhoto}
          />
          <View style={styles.headerText}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.tagContainer}>
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textualInfo}>{textualinfo}</Text>
        {multimediaurl && multimediaurl.length > 0 && (
          <Image
            source={require('../assets/flood.jpg')}
            style={styles.multimedia}
          />
        )}
      </View>
    );
  };
const Post: React.FC = () => {
    const [posts, setPosts] = useState([]);
  
    const database = new dbClient();
    useEffect(() => 
    {

        async function fetchposts()
        {
            const res = await database.getPosts();
            const post_list = res.result
            //setPosts(posts_list.result.json())
            setPosts(post_list)
            console.log(posts);

        }

        const interval = setInterval(() => {
            fetchposts()
          }, 5000)
        
        return () => clearInterval(interval); 
       
    },[])
    

    
  
    // const formatDateTime = (dateTimeStr: string) => {
    //   const parts = dateTimeStr.split(' ');
    //   const day = parts[0];
    //   const month = parts[1];
    //   const date = parts[2];
    //   const year = parts[5];
    //   const time = parts[3].slice(0, 5);
  
    //   return `${day}, ${month} ${date} ${year}, ${time} hrs`;
    // };
  
    return (
        <ScrollView style={{ flex: 1 }}>
        {posts && posts.map((t, index) => (
          <PostCard post={t} key={index} />
        ))}
        <PostCard post={
            {"classifier": 1, "geolocation": [37.7749, -122.4194], "isclassified": true, "multimediaurl": ["url1"], "postid": "a758150f-b9eb-4a40-b560-4958a9077dc1", "profilephoto": null, "tag": "REQUEST_ITEM", "textualinfo": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "timestamp": "2024-07-13T09:24:16.672Z", "userid": "000604bd-744f-4ce8-814c-6684075dd13e", "username": "user1"}

        } />
      </ScrollView>
    );
  };
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
  },
  tagContainer: {
    marginBottom: 10,

    
  },
  tagButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#95A8EF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,

  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  textualInfo: {
    marginBottom: 10,
    fontSize: 14,
  },
  multimedia: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});
  
  export default Post;
  

