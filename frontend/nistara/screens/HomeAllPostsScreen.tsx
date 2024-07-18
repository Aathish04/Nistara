import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, RefreshControl } from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { dbClient } from '../database/database';
import { images } from '../constants/Images';

import { posts } from '../sampledata/posts';

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

  // const [posts, setPosts] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const client = new dbClient();

  // const fetchPosts = useCallback(async () => {
  //   try {
  //     const response = await client.getPosts();
  //     console.log(response.result)
  //     setPosts(response.result);
  //   } catch (error) {
  //     console.error('Error fetching posts: ', error);
  //   }
  // }, []);

  //   useEffect(() => {
  //     fetchPosts();
  //   }, [fetchPosts]);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   fetchPosts().then(() => setRefreshing(false));
  //   }, [fetchPosts]);

    return (
      <View style={{flex:1}}>
      <ScrollView
        style={{ flex: 1 }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
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


// interface PostCard {
//   profilephoto: string | null;
//   username: string;
//   timestamp: string;
//   tag: string;
//   textualinfo: string;
//   multimediaurl: string[];
//   isclassified: boolean;
// }

// interface PostCardProps {
//   post: PostCard;
// }

// const PostCard: React.FC<PostCardProps> = (props) => {
//   const { profilephoto, username, textualinfo, multimediaurl, timestamp, isclassified, tag} = props.post;

//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <Image
//           source={profilephoto ? { uri: profilephoto } : require('../assets/profile/dog.png')}
//           style={styles.profilePhoto}
//         />
//         <View style={styles.headerText}>
//           <Text style={styles.username}>{username}</Text>
//           <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
//         </View>
//       </View>
//       <View style={styles.tagContainer}>
//         <TouchableOpacity style={styles.tagButton}>
//           <Text style={styles.tagText}>{tag}</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.textualInfo}>{textualinfo}</Text>
//       {multimediaurl && multimediaurl.length > 0 && (
//         <Image
//           source={{ uri: multimediaurl[0] }}
//           style={styles.multimedia}
//         />
//       )}
//     </View>
//   );
// };

// const Post: React.FC = () => {
//   const [posts, setPosts] = useState<PostCard[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const database = new dbClient();

//   const fetchPosts = useCallback(async () => {
//     try {
//       // const res = await database.getPosts();
//       // const post_list = res.result as Post[];
//       // setPosts(post_list);
//       // console.log(post_list);
//     } catch (error) {
//       console.error('Error fetching posts: ', error);
//     }
//   }, [database]);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts().then(() => setRefreshing(false));
//   }, [fetchPosts]);

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {posts.map((post, index) => (
//         <PostCard post={post} key={index} />
//       ))}
//       <PostCard post={{
//         profilephoto: null,
//         username: "user1",
//         textualinfo: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         multimediaurl: ["https://example.com/image.jpg"],
//         timestamp: "2024-07-13T09:24:16.672Z",
//         isclassified: true,
//         tag: "REQUEST_ITEM"
//       }} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   profilePhoto: {
//     width: 70,
//     height: 70,
//     borderRadius: 20,
//   },
//   headerText: {
//     marginLeft: 10,
//   },
//   username: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   timestamp: {
//     color: 'gray',
//     fontSize: 12,
//   },
//   tagContainer: {
//     marginBottom: 10,
//   },
//   tagButton: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#95A8EF',
//     borderRadius: 5,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   tagText: {
//     color: 'white',
//     fontSize: 14,
//   },
//   textualInfo: {
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   multimedia: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//   },
// });

// export default Post;
