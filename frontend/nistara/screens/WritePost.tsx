import React, { useState , useEffect} from 'react';;
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput, SafeAreaView } from 'react-native';
import {dbClient} from '../database/database';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'
import SafeViewAndroid from '../components/SafeViewAndroid';
import { useUser } from '../components/UserContext';
import { images } from '../constants/Images';
import { useRoute } from '@react-navigation/native';

const WritePost = ({navigation}:{navigation: any}) => {

  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [text, setText] = useState('');
  const [lat, setLat] = useState<number>(20.5937);
  const [long, setLong] = useState<number>(78.9629);
  
  
  const database = new dbClient();

  const { userID, userName, profileImage } = useUser();
  const userAvatar: any = images[profileImage];


  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLat(location?.coords.latitude)
      setLong(location?.coords.longitude)
    })();
  }, []);

  const handlePost = async (userID:string,username:string,profilephoto: string, textualinfo:string) => {
    let response;
    try{
      response = await database.addPost(userID,username,profilephoto, textualinfo,['url'],Date.now(),[lat,long])
    }catch(e){
      if(response) setErrorMsg(response.message)
      console.error(e)
    }
  }

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{top:4}} onPress={()=>{navigation.goBack()}}>
                        <Ionicons name="chevron-back" size={24} color="black"/>
                </TouchableOpacity>
                  <Text style={styles.title}>Nistara</Text>
              </View>
              <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
                <Image
                  source={userAvatar}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
                  <Text style={styles.subtitle}>Post Updates, Make Requests, Donate and more</Text>
                  <TextInput
                    style={styles.textBox}
                    placeholder="Type here..."
                    value={text}
                    onChangeText={setText}
                    multiline
                  />
                <TouchableOpacity onPress={() => {}} style={styles.uploadButton}>
                      <Ionicons name="cloud-upload-outline" size={24} color="black" />
                      <Text style={styles.uploadButtonText}>Upload images</Text>
                </TouchableOpacity>
          </View>
          <View style={{paddingVertical: 140,alignItems: 'center', marginBottom: 50}}>
              <TouchableOpacity
                  style={{
                      ...styles.button,
                      ...{ backgroundColor: '#95A8EF'},
                  }}
                  onPress = {()=>{handlePost(userID, userName, profileImage, text)}}
                  >
                  <Text style={{ fontSize: 20, ... { color: '#FFFFFF' } }}>Post!</Text>
              </TouchableOpacity>
          </View>
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content:{
    padding: 20
  },
  uploadButton: {
      paddingBottom: 12,
      paddingVertical: 12,
      backgroundColor: '#ccc',
      borderRadius: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: "50%",
      marginTop: 40,
      marginLeft: 10
    },
    uploadButtonText: {
      alignSelf: 'center',
      fontSize: 16,
      marginLeft: 10, // Adds space between the icon and text
    },
    header: {
      paddingTop: 25,
      paddingBottom: 15,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: 22,
      fontWeight: '500',
      color: '#333',
      marginLeft: 10
    },
    profileImage: {
      width: 35,
      height: 35
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'condensed',
      color: '#444',
      paddingBottom: 30,
      paddingHorizontal: 10
    },
    textBox: {
      height: 200,
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      textAlignVertical: 'top',
      fontSize: 18,
      marginHorizontal: 10
    },
    button:{
      paddingBottom: 14,
        paddingVertical: 14,
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        marginTop: 70
    }
});

export default WritePost;
  // const formatDateTime = (dateTimeStr: string) => {
    //   const parts = dateTimeStr.split(' ');
    //   const day = parts[0];
    //   const month = parts[1];
    //   const date = parts[2];
    //   const year = parts[5];
    //   const time = parts[3].slice(0, 5);
  
    //   return `${day}, ${month} ${date} ${year}, ${time} hrs`;
    // };