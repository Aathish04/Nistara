import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity} from "react-native";
import React, {useEffect} from "react";
import { LinearGradient } from "expo-linear-gradient";
import { dbClient } from "../database/database";

const SplashScreen = ({ navigation }: {navigation: any}) => {

  // useEffect(()=>{
  //   const testDB = async ()=>{
  //     const client : dbClient = new dbClient();
  //     const getPostsResponse = await client.getPosts();
  //     console.log(getPostsResponse.message);
  //     console.log(getPostsResponse.result)
  //   }
  //   testDB()
  // },[])
  return (
    <LinearGradient style={styles.container} colors={["#f1f3ff", "#95A8EF"]} locations={[0, 0.45]}>
      <Image
        source={require("../assets/splash/logo.jpg")}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Nistara</Text>
        <Text style={styles.subtitle}>
          Empowering Communities, Saving Lives
        </Text>
      </View>

      <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: '#FFFFFF'},
                ...styles.getStartedButton
            }}
            onPress = {()=>{navigation.navigate("HomeTabs")}}
            >

            <Text style={{ fontSize: 18, ... { color: '#95A8EF' } }}>Get started</Text>
        </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 22,
  },
  textContainer: {
    width: "95%",
    alignItems: "center",
    marginBottom: 90,
    marginTop: 55
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingBottom: 7,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  getStartedButton: {
    width: "95%",
    marginTop: 140,
  },
  button: {
    paddingBottom: 14,
    paddingVertical: 14,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
}
});

export default SplashScreen;
