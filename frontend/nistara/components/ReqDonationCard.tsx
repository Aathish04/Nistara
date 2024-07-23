import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants/Images';
import { useUser } from './UserContext';
import { SQLiteClient } from '../sqlite/localdb';

const { width: viewportWidth } = Dimensions.get('window');

function formatTimestamp(timestampString: string) {
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
      return `Last updated ${secondsDifference} s ago`;
    } else {
      return `Last updated ${minutesDifference} min${minutesDifference > 1 ? 's' : ''} ago`;
    }
  } else if (hoursDifference < 24) {
    return `Last updated ${hoursDifference} hr${hoursDifference > 1 ? 's' : ''} ago`;
  } else if (hoursDifference >= 24 && hoursDifference < 48) {
    const formattedTime = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')} ${timestamp.getHours() >= 12 ? 'pm' : 'am'}`;
    return `Last updated at ${formattedTime}`;
  } else {
    const formattedDate = `${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear().toString().slice(-2)}`;
    const formattedTime = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')} ${timestamp.getHours() >= 12 ? 'pm' : 'am'}`;
    return `Last updated on ${formattedDate} at ${formattedTime}`;
  }
}

function formatPostClass(postclass: string){
  if(postclass=='REQUEST_ITEM') return ['Request Item', '#FF6666']
  else if(postclass=='REQUEST_SEARCH') return ['Request Search', '#FFA07A']
  else if(postclass=='REQUEST_EVACUATION') return ['Request Evacuation', '#FFA700']
  else if(postclass=='OFFER') return ['Donating', '#FFA700']
  else return null
 
}

function formatUmbrellaType(tag: string){
  if(tag=='EMERGENCY_LIGHTING_AND_COMMUNICATION') return ['Lighting & Comms.', '#6495ED']
  else if(tag=='HYGIENE') return ['Hygiene', '#c2e090']
  else if(tag=='TOOLS_AND_EQUIPMENT') return ['Tools & Equipment', '#A9A9A9'] // Light Grey
  else if(tag=='FOOD_AND_WATER') return ['Food & Water', '#95A8EF'] // Moccasin
  else if(tag=='CLOTHING_AND_SHELTER') return ['Clothing & Shelter', '#87CEEB'] // Light Sky Blue
  else if(tag=='SAFETY_AND_PROTECTION') return ['Safety & Protection', '#857bbf'] // Thistle
  else return null
}

const ReqDonationCard = (props: any) =>{
    const { id, userid, item, quantity, postclass, umbrellatype, postid, timestamp} = props.item
    const [post, setPost] = useState<any | null>(null)
    const {userID, profileImage} = useUser()
    const localDbClient = new SQLiteClient();
    
    useEffect(()=>{
      const getCorrespondingPost = async() =>{
        const getPost = await localDbClient.getPostsWherePostId(postid);
        setPost(getPost)
      }
      getCorrespondingPost()
    }, [props])
    let istranslated, textcontent, translatedtextcontent
    if(post){
      istranslated = post.istranslated;
      textcontent = post.textcontent,
      translatedtextcontent = post.translatedtextcontent
    }
    
    let userprofile
    if(profileImage) userprofile = images[profileImage]
    else userprofile = images['dog.png']

    // parse and display time stamp
    const parsedTimeStamp: string = formatTimestamp(timestamp)

    // parse tag - get tag text and color
    let parsedTag: string[] | null;
    parsedTag = formatUmbrellaType(umbrellatype)

    // parse post class - get class and color
    let parsedPostClass: string[] | null;
    parsedPostClass = formatPostClass(postclass)

    const [showTranslated, setShowTranslated] = useState(false);

    return (
      <View>
        <View style={styles.cardHeader}>
          <Image source={userprofile} style={styles.profilePhoto} />
          <View style={styles.postDetails}>
            <Text style={styles.userName}>You</Text>
            <Text style={styles.timeOfPost}>{parsedTimeStamp}</Text>
          </View>
          
          </View>
          { parsedPostClass && (
            <View style={styles.tags}>
              <View style={{...styles.tagContainer, backgroundColor: parsedPostClass[1]}}>
                <Text style={styles.tagText}>{parsedPostClass[0]}</Text>
              </View>
              {
                parsedTag && (
                  <View style={{...styles.tagContainer,
                    backgroundColor: parsedTag[1], marginLeft: 20
                  }}>
                    <Text style={styles.tagText}>{parsedTag[0]}</Text>
                  </View>
                )
              }
            </View>
          )} 
          {
            item && (
              <View style={styles.item}>
                <Text style={{fontSize: 15, marginBottom: 5}}>Item:  {item[0].toUpperCase()+item.substring(1,)}</Text>
                {quantity? (<Text style={{fontSize: 15, marginLeft: -4 }}>Quantity:  {quantity}</Text>): (<Text style={{fontSize: 15, marginLeft: -4}}> Quantity:  N/A</Text>)}
              </View>
            )
          }
          { post && (
            <View style={styles.post}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontSize: 16, fontWeight: "bold"}}>Your Post</Text>
                {(istranslated) && (
                  <TouchableOpacity onPress={() => setShowTranslated(!showTranslated)} style={styles.translateButton}>
                    <Ionicons name="language" size={24} color="#ccc" />
                  </TouchableOpacity>
                )} 
              </View>
            <Text style={styles.textContent}>
              {showTranslated ? translatedtextcontent : textcontent}
            </Text>
          </View>
          )}
        </View>
    )

  }

export default ReqDonationCard;

const styles = StyleSheet.create({
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
      paddingHorizontal: 20,
      paddingVertical: 7,
      borderRadius: 6,
      width: 'auto',
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
    translateButton:{
      marginRight: 10
    },
    tags:{
      flexDirection: "row",
      marginBottom: 10
    },
    item:{

    },
    post:{
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      width: "80%"
    }
  })