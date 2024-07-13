// import React from 'react';
// import { StyleSheet, Text, View, Image, BackHandler } from 'react-native';
// import {Ionicons} from '@expo/vector-icons'


// // const SignUpScreen = ({route, navigation}:{route:any, navigation:any})=>{
// const SignUpScreen = ({navigation}:{navigation:any})=>{
//     // const {aadhaarInfo, email, phone} = route.params

//     const getUserNameParsed = (name: string) =>{
//         const nameList = name.toLowerCase().split(' ')
//         const capitalizedNames = nameList.map(word => word.charAt(0).toUpperCase() + word.slice(1));
//         return capitalizedNames.join(' ');
//     }

    

//     const userName = getUserNameParsed(aadhaarInfo.name)
//     return(
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <View style={styles.circleView}></View>
//                 <Image source={{ uri: 'data:image/jpeg;base64,'+aadhaarInfo.photo }} style={styles.aadhaarPhoto} />
//                 <View style={styles.headerContent}>
//                     <Text style={styles.headerText}>Welcome,</Text>
//                     <Text style = {styles.userNameText}>{userName}</Text>
//                 </View>
//             </View>
//             <View style={styles.userDetails}>
//                 <View style={styles.section}>
//                     <Ionicons name="call" size={24} color="#95A8EF"/>
//                 </View>
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         backgroundColor: "#fff"
//     },
//     header:{
//         flexDirection: "row",
//         marginTop: 0,
//         marginLeft: 0
//     },
//     circleView:{
//         marginLeft: -70,
//         marginTop: -50,
//         backgroundColor: "#95A8EF",
//         borderRadius: 100,
//         width: 200,
//         height: 200,
//         opacity: 0.5
//     },
//     aadhaarPhoto:{
//         zIndex: 1,
//         borderRadius: 100,
//         width: 100,
//         height: 100,
//         marginTop: 50,
//         marginLeft: -65
//     },
//     headerText:{
//         fontSize: 28,
//         fontWeight: "bold",
//         marginTop: 60,
//         marginLeft: 35,
//         color: "#95A8EF"
//     },
//     userNameText:{
//         marginLeft: 35,
//         fontSize: 20,
//         paddingTop: 5
//     },
//     headerContent:{
//         flexDirection: "column"
//     },
//     userDetails:{
//         flexDirection: "column",
//         marginTop: 50,
//         marginLeft: 30,
//         marginRight: 30
//     },
//     section:{

//     }
// })

// export default SignUpScreen