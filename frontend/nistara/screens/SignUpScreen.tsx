import React from 'react';
import { StyleSheet, Text, View, Image, BackHandler, TouchableOpacity } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import { aadhaarInfo } from '../data';

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
    // const {aadhaarInfo, email, phone} = route.params
    const email = "example@gmail.com"
    const phone = "1234567890"
    const userName = getUserNameFormatted(aadhaarInfo.name)
    const displayAddress = getAddressToDisplayFormatted(aadhaarInfo.address);
    // console.log(constructPayload(aadhaarInfo, userName, displayAddress, email, phone))

    const handlePress =()=>{
        const userInfo: payLoad = constructPayload(aadhaarInfo, userName, displayAddress, email, phone)
        // console.log(userInfo)
        navigation.navigate("SetPassword", {userInfo: userInfo})
    }

    return(
        <View style={styles.container}>
            <Ionicons name="chevron-back" size={30} color="#000"/>
            <View style={styles.header}>
                <View style={styles.circleView}></View>
                <Image source={{ uri: 'data:image/jpeg;base64,'+aadhaarInfo.photo }} style={styles.aadhaarPhoto} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>Welcome,</Text>
                    <Text style = {styles.userNameText}>{userName}</Text>
                </View>
            </View>
            <View style={styles.userDetails}>
                <View style={styles.contactSection}>
                    <Ionicons name="call" size={22} color="#ccc"/>
                    <Text style={styles.contactInfo}>+91 {phone}</Text>
                </View>
                <View style={styles.contactSection}>
                    <Ionicons name="mail-open" size={22} color="#ccc"/>
                    <Text style={styles.contactInfo}>{email}</Text>
                </View>
                <View style={styles.section}>
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
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Date Of Birth</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.dateOfBirth}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="transgender" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Gender</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.gender}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-add" size={24} color="#95A8EF" />
                        <Text style={styles.sectionHeaderTitle}>Aadhaar Number</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{aadhaarInfo.maskedNumber}</Text>
                    </View>
                </View>
            </View>
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
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
        paddingTop: 60,
        paddingLeft: 20
    },
    header:{
        flexDirection: "row",
        marginTop: -100,
        marginLeft: -40
    },
    circleView:{
        marginLeft: -80,
        marginTop: -50,
        backgroundColor: "#95A8EF",
        borderRadius: 300,
        width: 250,
        height: 255,
        opacity: 0.4
    },
    aadhaarPhoto:{
        zIndex: 1,
        borderRadius: 100,
        width: 115,
        height: 115,
        marginTop: 80,
        marginLeft: -75
    },
    headerText:{
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 90,
        marginLeft: 25,
        color: "#95A8EF"
    },
    userNameText:{
        marginLeft: 25,
        fontSize: 22,
        paddingTop: 5,
        flexWrap: 'wrap',
        width: 200
    },
    headerContent:{
        flexDirection: "column"
    },
    userDetails:{
        flexDirection: "column",
        marginTop: 50,
        marginLeft: 20
    },
    contactSection:{
        flexDirection: "row",
        paddingBottom: 15
    },
    contactInfo:{
        color: "#959595",
        marginLeft: 20,
        fontWeight: "bold"
    },
    section:{
        paddingTop: 20
    },
    sectionHeader:{
        flexDirection: "row"
    },
    sectionHeaderTitle:{ 
        paddingLeft: 25,
        fontSize: 18,
        fontWeight: "500"
    },
    sectionContent:{
        paddingTop: 5,
        paddingLeft: 50,
    },
    sectionText:{
        color: "#959595",
        fontWeight: "bold",
        flexWrap: 'wrap',
        width: 250
    },
    button: {
        paddingBottom: 14,
        paddingVertical: 14,
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        marginTop: 140,
        marginLeft: 10
    }
})

export default SignUpScreen