import React from 'react';
import { Text , TouchableOpacity} from 'react-native';
import { View, StyleSheet  } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {Ionicons} from '@expo/vector-icons'

const Tab = createMaterialTopTabNavigator();

// component screen renders
import Post from './PostScreen';
import WarningsAwarenessScreen from './WarningsAwarenessScreen';

const HomeTopTabs = () =>{
   
    return(
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: "gray", 
            tabBarLabelStyle: {
              fontSize: 15,
              textTransform: "none",
              fontWeight: "600",
            },
            tabBarIndicatorStyle: { backgroundColor: "#000", width: "25%", marginLeft: "12%"},
            tabBarPressColor: "#ddd",
            tabBarStyle: { backgroundColor: "white",  marginTop: 0, paddingTop: 7},
            tabBarIndicatorContainerStyle: { backgroundColor: "white", alignItems: "center"},
            tabBarActiveLabelStyle: { fontWeight: "500" },
          })}
        >
            <Tab.Screen 
                name="All"
                component={Post}
            />
            <Tab.Screen 
                name="For you"
                component={WarningsAwarenessScreen}
            />
        </Tab.Navigator>
    )
}

const HomeScreen = ({navigation}: {navigation:any}) =>{
    return(

    <View style={styles.container}>
            <HomeTopTabs />
            <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("WritePost")}}>
      <Ionicons name="pencil" size={24} color="#fff" />
    </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 0,
      paddingTop: 0,
    },
    button: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f4511e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },
  });

export default HomeScreen;