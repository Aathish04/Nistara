import { StatusBar } from 'expo-status-bar';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons,SimpleLineIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet,Text, View, Image, Alert, Button} from 'react-native';

// get currently logged in user details
import { UserProvider } from './components/UserContext';
import { useUser } from './components/UserContext';

// for profile image
import { images } from './constants/Images';

// For expo-nearby-connections
import { Buffer } from 'buffer';
import { startAdvertising, startDiscovery, sanitycheck,requestPermissionsAsync, addOnEndpointConnectedListener, addOnEndpointLostListener, addonPayloadReceivedListener, sendPayload} from './modules/nearby-connections-expo';

// Splash Screen
import SplashScreen from './screens/SplashScreen';

// Authentication Screens
import OnboardingInit from './screens/Onboarding';
import AadhaarOnboarding from './screens/AadhaarAuth';
import SignUpScreen from './screens/SignUpScreen';
import SetPasswordScreen from './screens/SetPasswordScreen';
import LoginScreen from './screens/LoginScreen';

// Home Bottom Nav Tabs
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import WarningsScreen from './screens/WarningsScreen';
import DonateScreen from './screens/DonateScreen';
import SOSScreen from './screens/SOSScreen';
import WritePost from './screens/WritePost';

// User Profile Screens
import YourProfileScreen from './screens/YourProfileScreen';

// sqlite --local store
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name = "OnboardingInit" component = {OnboardingInit} />
        <Stack.Screen name = "AadhaarOnboarding" component={AadhaarOnboarding} />
        <Stack.Screen name = "SignUp" component = {SignUpScreen} />
        <Stack.Screen name="SetPassword" component = {SetPasswordScreen} />
        <Stack.Screen name="Login" component={LoginScreen}/>

    </Stack.Navigator>
  )
}

function HomeTabs({navigation}:{navigation:any}){

  const { userID, userName, profileImage, language } = useUser();
  let userAvatar: any;
  if (profileImage) userAvatar = images[profileImage]
  else userAvatar = require('./assets/profile/dog.png')


  return(
  <>
      <View style={{
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white"
      }}>
        {/* <Ionicons name='menu' size={24} color = {"black"} /> */}
        <Text style={{fontSize: 22, fontWeight: "500"}}>Nistara</Text>
        <TouchableOpacity onPress = {()=>{navigation.navigate("Profile")}}>
          <Image
            source={userAvatar}
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
            }}
          />
        </TouchableOpacity>
      </View>
  <View style={{
        borderWidth: 0.2,
        borderColor: "#bbb",
  }}/>
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === "Home") return <Ionicons name="home-outline" size={size} color={color} />
        else if (route.name === "Search") return <Ionicons name="search-outline" size={size} color={color} />
        else if (route.name === "Warnings") return <Ionicons name="warning-outline" size={size} color={color} />
        else if (route.name === "Donate") return <SimpleLineIcons name="badge" size={size} color={color} />
      },  
    tabBarActiveTintColor: "black",
    tabBarInactiveTintColor: "gray",
    tabBarStyle: {
      paddingBottom: 15,
      paddingTop: 15,
      height: 80,
    },
    tabBarLabelStyle: {
      fontSize: 12,
    },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Search"
      component={SearchScreen}
      options={{ headerShown: false }}
    />

    <Tab.Screen
      name="Warnings"
      component={WarningsScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Donate"
      component={DonateScreen}
      options={{ headerShown: false }}
    />

  </Tab.Navigator>

  <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 45,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#95A8EF',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          zIndex: 1,
        }} 
        onPress={() => {navigation.navigate("SOSScreen")}}
  >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>SOS</Text>
  </TouchableOpacity>
  </>
  )
}

export default function App() {
  let [perms,setPerms] = useState("No Perms Yet")
  let [conns, setConns] = useState<Array<string>>([]);
  const encoder =  new TextEncoder();
  async function requestPerms(){
    setPerms(JSON.stringify(await requestPermissionsAsync()))
  }

  addOnEndpointConnectedListener(
  (event) => {
    console.log("Endpoint Found:" + JSON.stringify(event));
    let oldConns = [...conns];
    oldConns.push(event.endpointId)
    oldConns = [...new Set(oldConns)];
    setConns(oldConns)
  });

  addOnEndpointLostListener(
    (event)=>{
      console.log("Endpoint Lost: "+JSON.stringify(event))
      let oldConns = new Set(conns)
      oldConns.delete(event.endpointId);
      setConns([...oldConns]);
    }
  )

  addonPayloadReceivedListener(
    (event)=>{
      console.log(event)
      Alert.alert(`Got Message: ${Buffer.from(event.payload, 'base64').toString('utf-8')}!`)
    }
  )

  function sendData(){
    Alert.alert("Send Payload","Send Payload",[
      {
        text: 'Send Hello',
        onPress: () => {for (let ep of conns){sendPayload(ep,encoder.encode("Hello"))}},
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Send OK', onPress: () => {for (let ep of conns){sendPayload(ep,encoder.encode("OK"))}}},
    ])
  }

  let actualview = (
  <SQLiteProvider databaseName='nistara.db' onInit={createTable}>
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options = {{headerShown: false}}
          />
          <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SOSScreen"
            component={SOSScreen}
            options={{ headerShown: false}}
          />
          <Stack.Screen 
            name="Profile"
            component={YourProfileScreen}
            options= {{ headerShown: false}}
          />
          <Stack.Screen 
            name="WritePost"
            component={WritePost}
            options= {{ headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
    </SQLiteProvider>
  );
  let meshtestview = (
    <View style={styles.container}>
      <Text>{sanitycheck()}</Text>
      <Text>{perms}</Text>
      <Button title="Request Perms" onPress={requestPerms}></Button>
      <Button title="Start Advertising" onPress={startAdvertising}></Button>
      <Button title="Start Discovery" onPress={startDiscovery}></Button>
      <Text id='Connections'>Connections: {JSON.stringify(conns)}</Text>
      <Button title="Send Payload" onPress={sendData}></Button>
      <StatusBar style="auto" />
    </View>
  )
  
  return actualview
}

async function createTable(db: SQLiteDatabase){
    await db.execAsync(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      geolocation TEXT,
      multimediaurl TEXT,
      textcontent TEXT,
      timestamp TEXT,
      lastupdatetimestamp TEXT,
      userid TEXT,
      username TEXT,
      profilephoto TEXT,
      language TEXT,
      classifier INTEGER,
      isclassified INTEGER,
      class TEXT,
      translator INTEGER,
      istranslated INTEGER,
      translatedtextcontent TEXT,
      mesh INTEGER
    )`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      geolocation TEXT,
      ismatched INTEGER,
      item TEXT,
      matcherid INTEGER,
      postclass TEXT,
      postid TEXT,
      profilephoto TEXT,
      quantity INTEGER,
      timestamp TEXT,
      translatedtextcontent TEXT,
      umbrellatype TEXT,
      userid TEXT,
      username TEXT   
    )`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS donations(
      id TEXT PRIMARY KEY,
      geolocation TEXT,
      ismatched INTEGER,
      item TEXT,
      matcherid INTEGER,
      postclass TEXT,
      postid TEXT,
      profilephoto TEXT,
      quantity INTEGER,
      timestamp TEXT,
      translatedtextcontent TEXT,
      umbrellatype TEXT,
      userid TEXT,
      username TEXT 
    )`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS matches
      requestid TEXT,
      donationid TEXT,
      donorack INTEGER,
      matcherid INTEGER,
      matchtime TEXT,
      requesterack INTEGER,
      PRIMARY KEY (requestid, donationid)
      `)
console.log("Tables created successfully")
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
