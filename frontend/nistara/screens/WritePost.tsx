import React, { useState , useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput } from 'react-native';
import {dbClient} from '../database/database';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons'; // Optional, if you want to use an icon
const WritePost = () => {

  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [lat, setLat] = useState<number>(0);
  const [long, setLong] = useState<number>(0);
  const database = new dbClient();
  const [username, setUsername] = useState("Parthiban")
  const [userid, setUserID] = useState('A100')
  // Assuming username, id


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

  const insertPostIntoDatabase = (userid:string,username:string,textualinfo:string) => {
    database.addPost(userid,username,textualinfo,['url'],Date.now(),[lat,long])

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nistara</Text>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={require("../assets/profile/dog.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Post Updates, Make Requests, Donate and more</Text>
      <TextInput
        style={styles.textBox}
        placeholder="Type here..."
        value={text}
        onChangeText={setText}
        multiline
      />
 <TouchableOpacity onPress={() => {}} style={styles.uploadButton}>
      <Icon name="cloud-upload-outline" size={35} color="black" />
      <Text style={styles.uploadButtonText}>Upload images</Text>
    </TouchableOpacity>
 <TouchableOpacity onPress={() => { insertPostIntoDatabase(userid,username,text)}} style={{ 
    backgroundColor: '#95A8EF',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 10
}}>
        <Text style={{alignSelf: "center", color: "white", fontSize: 20}}> Post</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    uploadButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      uploadButtonText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 20,
        marginLeft: 10, // Adds space between the icon and text
      },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '900',
    margin: 10,
    color: '#444',
  },
  textBox: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    margin: 20,
    borderRadius: 10,
    textAlignVertical: 'top',
    fontSize: 20,
  },
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