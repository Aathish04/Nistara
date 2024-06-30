// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from 'react-native';

// Splash Screen
import SplashScreen from './screens/SplashScreen';

// Home Bottom Nav Tabs
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import WarningsScreen from './screens/WarningsScreen';
import DonateScreen from './screens/DonateScreen';
import SOSScreen from './screens/SOSScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs({navigation}:{navigation:any}){
  return(
  <>
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
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>SOS</Text>
  </TouchableOpacity>
  </>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options = {{headerShown: false}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

