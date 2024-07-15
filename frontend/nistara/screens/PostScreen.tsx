import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { dbClient } from '../database/database';

interface Post {
  profilephoto: string | null;
  username: string;
  textualinfo: string;
  multimediaurl: string[];
  timestamp: string;
  isclassified: boolean;
  tag: string;
  geolocation: [number, number];
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = (props) => {
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
          source={{ uri: multimediaurl[0] }}
          style={styles.multimedia}
        />
      )}
    </View>
  );
};

const Post: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const database = new dbClient();

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await database.getPosts();
  //       const post_list = res.result as Post[];
  //       setPosts(post_list);
  //       console.log(post_list);
  //     } catch (error) {
  //       console.error('Error fetching posts: ', error);
  //     }
  //   };

  //   const interval = setInterval(fetchPosts, 5000);
  //   // fetchPosts();

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      {posts.map((post, index) => (
        <PostCard post={post} key={index} />
      ))}
      <PostCard post={{
        profilephoto: null,
        username: "user1",
        textualinfo: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        multimediaurl: ["https://example.com/image.jpg"],
        timestamp: "2024-07-13T09:24:16.672Z",
        isclassified: true,
        tag: "REQUEST_ITEM",
        geolocation: [37.7749, -122.4194]
      }} />
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
