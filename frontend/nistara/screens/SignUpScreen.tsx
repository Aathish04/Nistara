import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import SafeViewAndroid from '../components/SafeViewAndroid';
// import { aadhaarInfo } from '../sampledata/data';
// import { aadhaarInfo } from '../data';

type Address = {
    careOf: string;
    country: string;
    district: string;
    house: string;
    landmark: string;
    locality: string;
    pin: string;
    postOffice: string;
    state: string;
    street: string;
    subDistrict: string;
    vtc: string;
  };

type Aadhaar = {
    address: Address,
    dateOfBirth: string,
    email: string,
    gender: string,
    generatedAt: string,
    maskedNumber: string,
    name: string,
    phone: string,
    photo: string,
    verified:object,
    xml: object
}

type payLoad = {
    userName: string,
    email: string,
    phone: string,
    address: string,
    dateOfBirth: string,
    gender: string,
    maskedNumber: string,
    profileImage: string
}

const getUserNameFormatted = (name: string) =>{
    const nameList = name.toLowerCase().split(' ')
    const capitalized = nameList.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalized.join(' ');
}

const getAddressToDisplayFormatted = (address: Address): Address => {
    const capitalizeWords = (str: string): string => {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
  
    const prettierAddress: Partial<Address> = {};
    const keys: (keyof Address)[] = ["country", "district", "landmark", "locality", "postOffice", "state", "street", "subDistrict", "vtc"];
    
    for (const key of keys) {
      if (address[key]) {
        prettierAddress[key] = capitalizeWords(address[key].toLowerCase());
      } else {
        prettierAddress[key] = address[key];
      }
    }
  
    return { ...address, ...prettierAddress } as Address;
};


const getAddressAsStr = (address: Address): string =>{
    return `${address.house}, ${address.street}, ${address.landmark}, ${address.locality}, ${address.vtc}, ${address.district}, ${address.state} - ${address.pin}`;
}

const constructPayload = (aadhaar: Aadhaar, userName:string, formattedAddress:Address, email: string, phone: string ): payLoad =>{
    const address: string = getAddressAsStr(formattedAddress)
    const profileImages = ['dog.png', 'bird.png', 'butterfly.png', 'jaguar.png', 'koala.png',
                            'lion.png', 'panda.png', 'pig.png', 'swallow.png', 'walrus.png'
                            ]
    const randomProfileImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    return {
        userName,
        email,
        phone,
        address,
        dateOfBirth: aadhaar.dateOfBirth,
        gender: aadhaar.gender,
        maskedNumber: aadhaar.maskedNumber,
        profileImage: randomProfileImage
    }
}

 
  

const SignUpScreen = ({route, navigation}:{route:any, navigation:any})=>{
    const {aadhaarInfo, email, phone} = route.params
    // const email = "example@gmail.com"
    // const phone = "1234567890"
    const userName = getUserNameFormatted(aadhaarInfo.name)
    const displayAddress = getAddressToDisplayFormatted(aadhaarInfo.address);
    // console.log(constructPayload(aadhaarInfo, userName, displayAddress, email, phone))

    const handlePress =()=>{
        const userInfo: payLoad = constructPayload(aadhaarInfo, userName, displayAddress, email, phone)
        // console.log(userInfo)
        navigation.navigate("SetPassword", {userInfo: userInfo})
    }

    return(
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
        <View style={styles.container}>
            <View style={styles.circleView}></View>
            <View style={styles.header}>
                <Image source={{ uri: 'data:image/jpeg;base64,'+aadhaarInfo.photo }} style={styles.aadhaarPhoto} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>Welcome,</Text>
                    <Text style = {styles.userNameText}>{userName}</Text>
                </View>
            </View>
            <View style={styles.contactSection}>
                    <Ionicons name="call" size={22} color="#ccc"/>
                    <Text style={styles.contactInfo}>+91 {phone}</Text>
                </View>
            <View style={styles.contactSection}>
                <Ionicons name="mail-open" size={22} color="#ccc"/>
                <Text style={styles.contactInfo}>{email}</Text>
            </View>

            <View style={styles.userDetails}>
                <View>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Address</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{displayAddress.careOf}</Text>
                        <Text style={styles.sectionText}>{displayAddress.house}, {displayAddress.street}, {displayAddress.landmark} {displayAddress.locality}</Text>
                        <Text style={styles.sectionText}>{displayAddress.vtc}, {displayAddress.district}, {displayAddress.state}</Text>
                        <Text style={styles.sectionText}>Pin: {displayAddress.pin}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Date Of Birth</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.dateOfBirth}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="transgender" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Gender</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.gender}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-add" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Aadhaar Number</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.maskedNumber}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                style={{
                    ...styles.button,
                    ...{ backgroundColor: '#95A8EF'},
                }}
                onPress = {handlePress}
                >
                <Text style={{ fontSize: 18, ... { color: '#FFFFFF' } }}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
      },
      header: {
        padding:"10%",
        flexDirection: "row",
        flex:1,
        alignItems:"center"
      },
    circleView:{
        marginLeft: -140,
        marginTop: -120,
        backgroundColor: "#95A8EF",
        borderRadius: 300,
        width: 250,
        height: 255,
        opacity: 0.4,
        position:"absolute"
    },
    aadhaarPhoto:{
        borderRadius: 100,
        width: 105,
        height: 105,
    },
    headerText:{
        fontSize: 28,
        fontWeight: "bold",
        color: "#95A8EF",
        textAlign:"right"
    },
    userNameText:{
        fontSize: 22,
        flexWrap: "wrap",
        fontWeight: "condensedBold",
        textAlign:"right"
    },
    headerContent:{
        flexDirection: "column",
        flex:2
    },
    userDetails:{
        flexDirection: "column",
        flex:5,
        justifyContent:"space-around",
        marginHorizontal:"10%"
    },
    contactSection:{
        flexDirection: "row",
        marginVertical:"1%",
        // justifyContent:"space-around",
        marginHorizontal:"10%",
        gap:10
        
    },
    contactInfo:{
        color: "#959595",
        fontWeight: "bold",
        fontSize: 15
    },
    sectionHeader:{
        flexDirection: "row",
        gap:10
    },
    sectionHeaderTitle:{ 
        fontSize: 18,
        fontWeight: "bold"
    },
    sectionContent:{
        marginLeft:"12%"
    },
    sectionText:{
        color: "#959595",
        fontWeight: "bold",
        flexWrap: 'wrap',
        width: "90%"
    },
    buttonContainer:{alignItems: 'center',flex:1},
    button: {
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        height: "60%"
    }
})

export default SignUpScreen