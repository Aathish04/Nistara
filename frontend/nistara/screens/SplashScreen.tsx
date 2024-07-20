import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      const authenticate = async () => {
        setTimeout(async () => {
          try {
            const user = await SecureStore.getItemAsync('User');
            const stayLoggedIn = await SecureStore.getItemAsync('stayLoggedIn');
            
            // if user has signed up and chose to stay logged in
            if (user && stayLoggedIn === 'true'){
              const compatible = await LocalAuthentication.hasHardwareAsync();
              if (compatible) {
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                if (enrolled) {
                  const auth = await LocalAuthentication.authenticateAsync({
                  promptMessage: 'Unlock Nistara',
                  fallbackLabel: 'Enter Pattern or Password', // isn't really supported lol, but anyway
                  });
                  if (auth.success) { // yay case
                  setIsAuthenticated(true);
                  navigation.navigate("HomeTabs"); // go straight to home 
                  } else return // Auth failed
                } else return // No Biometrics Found: Set up biometrics to use this feature
              } else return // Biometrics Not Supported: Device does not support biometric authentication
            } else setIsAuthenticating(false); // user should sign up or has logged out and wants to log in
          } catch(error) {
            console.error(error)
            setIsAuthenticated(false)
          }
          setIsAuthenticating(false);
        }, 1000); // delay for 1s, worked hard on the splash screen, want people to see it every damn time uwu
      };
      authenticate();
    }, [])
  );

 
  return (
    <LinearGradient style={styles.container} colors={["#f1f3ff", "#95A8EF"]} locations={[0, 0.45]}>
      <Image
        source={require("../assets/splash/logo.jpg")}
        style={styles.splashimage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Nistara</Text>
        <Text style={styles.subtitle}>
          Empowering Communities, Saving Lives
        </Text>
      </View>
      <View style={styles.loginButtonandContainer}>
        <TouchableOpacity style={styles.button}
              onPress = {()=>{navigation.navigate("Auth", {screen: "OnboardingInit"})}}>
              <Text style={styles.buttonText}>Learn how it works</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
                <Text style={{ fontSize: 16, color:"#fff" }}>Already have an account? </Text>
                <Pressable
                    onPress={() => navigation.navigate("Auth", {screen: "Login"})}>
                    <Text style={styles.loginText}>Log In</Text>
                </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
    // paddingHorizontal: 22,
  },
  splashimage:{
    flex :2,
    width:"100%"
  },
  textContainer: {
    flex:1,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    padding:"2%"
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  loginButtonandContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"space-around",
    width:"80%"
  },
  button: {
    borderColor: '#FFFFFF',
    padding:"5%",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    backgroundColor: '#FFFFFF'
  },
  buttonText:{
    color: "#95A8EF",
    fontSize: 18
  },
  loginContainer:{
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText:{
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  }
});

export default SplashScreen;