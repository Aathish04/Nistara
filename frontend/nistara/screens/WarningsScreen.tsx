import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

// component screen renders
import WarningsAlertsScreen from './WarningsAlertsScreen';
import WarningsAwarenessScreen from './WarningsAwarenessScreen';

const WarningsTopTabs = () =>{
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
                name="Alerts"
                component={WarningsAlertsScreen}
            />
            <Tab.Screen 
                name="Awareness"
                component={WarningsAwarenessScreen}
            />
        </Tab.Navigator>
    )
}
const WarningsScreen = ({}) =>{
    return(
        <View style={styles.container}>
            <WarningsTopTabs />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 0,
      paddingTop: 0,
    },
  });

export default WarningsScreen;