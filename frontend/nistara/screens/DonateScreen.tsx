import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SQLiteClient } from '../sqlite/localdb';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import SafeViewAndroid from '../components/SafeViewAndroid';
import { fundraisers } from '../newsdata/fundraisers';



// Define the color scheme
const postclassColors: Record<any, string> = {
    'REQUEST_ITEM': '#FF6666',
    'REQUEST_SEARCH': '#FFA07A',
    'REQUEST_EVACUATION': '#FFA700'
};

const umbrellatypeColors: Record<any, string> = {
    'CLOTHING_AND_SHELTER': '#87CEEB',
    'EMERGENCY_LIGHTING_AND_COMMUNICATION': '#6495ED',
    'FOOD_AND_WATER': '#95A8EF',
    'HYGIENE': '#c2e090',
    'SAFETY_AND_PROTECTION': '#857bbf',
    'TOOLS_AND_EQUIPMENT': '#A9A9A9'
};

const displayClassText: Record<any, string> = {
    'REQUEST_ITEM': 'Item Requests',
    'REQUEST_SEARCH': 'Search Requests',
    'REQUEST_EVACUATION': 'Evacuation Requests',
    'CLOTHING_AND_SHELTER': 'Clothing & Shelter',
    'EMERGENCY_LIGHTING_AND_COMMUNICATION': 'Lighting & Comms.',
    'FOOD_AND_WATER': 'Food & Water',
    'HYGIENE': 'Hygiene',
    'SAFETY_AND_PROTECTION': 'Safety & Protection',
    'TOOLS_AND_EQUIPMENT': 'Tools & Equipment'
};

const DonateScreen = ({navigation}:{navigation: any}) => {
    const [postclassReqCounts, setPostClassReqCounts] = useState<any | null>(null);
    const [umbrellatypeReqCounts, setUmbrellaTypeReqCounts] = useState<any | null>(null);
    const [isItemCollapsed, setIsItemCollapsed] = useState<boolean>(true);
    const [isAnalyticsCollapsed, setAnalyticsCollapsed] = useState<boolean>(false)

    const sqliteClient = new SQLiteClient();

    useEffect(() => {
        const getReqCounts = async () => {
            const { postclassData, umbrellatypeData } = await sqliteClient.getRequestCounts();
            if (postclassData) setPostClassReqCounts(postclassData);
            if (umbrellatypeData) setUmbrellaTypeReqCounts(umbrellatypeData);
        };

        getReqCounts();
    }, []);

    const toggleItemAccordion = () => {
        setIsItemCollapsed(!isItemCollapsed);
    };

    const handleWritePost = (items: string) =>{
        const message = `I would like to donate ${items}`
        navigation.navigate("WritePost", {message})
        
    }

    const pluralOrSingular = (num: number) => {
        const message = (num==1) ? "request" : "requests";
        return message
    }

    const renderProgressBars = (data: any, colorMap: any) => {
        return (
            <View>
                {Object.keys(data).filter(key => key !== 'null').map((key) => (
                    <TouchableOpacity onPress = {()=>{handleWritePost(displayClassText[key])}}>
                        <View key={key} style={styles.progressContainer}>
                            <Text style={styles.label}>{displayClassText[key]}</Text>
                            <Progress.Bar
                                progress={data[key].matched_count / data[key].count}
                                color={colorMap[key] || '#ccc'}
                                // style={styles.progressBar}
                            />
                            <View style={{flexDirection: "column", paddingLeft: 10}}>
                                <Text style={{...styles.percentage, flexWrap: "wrap", width: 90}}>Fulfilled {(data[key].matched_count)} {pluralOrSingular(data[key].matched_count)}</Text>
                                <Text style={styles.percentage}>out of {data[key].count}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const FundraiserCard = ({fundraiser}: {fundraiser: any}) =>{
        console.log(fundraiser)
        return(
            <View key = {fundraiser.id} style={styles.card}>
                <View key = {fundraiser.id} style={styles.cardHeader}>
                    <Image source={{uri: fundraiser.profilePhoto}} style={styles.profilePhoto} />
                    <View style={styles.postDetails}>
                        <Text style={styles.userName}>{fundraiser.issuedBy}</Text>
                        <Text style={{}}>{fundraiser.issuedByDesc}</Text>
                        <Text style={styles.timeOfPost}>{fundraiser.timeOfIssue}</Text>
                    </View>
                </View>
                    <Text style={styles.textContent}>
                        {fundraiser.textcontent}
                    </Text>
                    <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 10}}>
                        <Text>Goal: {fundraiser.goal}</Text>
                        <Text>{fundraiser.raised}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            ...{ backgroundColor: '#95A8EF'} }}
                        >
                        <Text style={{ fontSize: 16, ... { color: '#FFFFFF' } }}>Donate</Text>
                    </TouchableOpacity>
                </View>  
        )
    }

    return (
            <View style={styles.container}>
                 {/* <Text style={styles.headerText}>Get involved by understanding the demand for requests and services, and join us in creating or supporting fundraisers.</Text> */}
            <ScrollView style={{flex:1}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 20}}>
                    <Text style = {styles.analyticsHeaderText}>Request Analytics</Text>
                    <TouchableOpacity onPress={()=>setAnalyticsCollapsed(!isAnalyticsCollapsed)}>
                        <Ionicons name="chevron-down" size={24} color="#A9A9A9" />
                    </TouchableOpacity>
                </View>
                { isAnalyticsCollapsed && 
                <View style = {styles.analytics}>
                {postclassReqCounts && Object.keys(postclassReqCounts).map((key) => (
                    key === 'REQUEST_ITEM' ? (
                        <View key={key}>
                            <TouchableOpacity onPress={toggleItemAccordion}>
                                <View style={styles.progressContainer}>
                                    <Text style={[styles.label, { color: '#000', fontWeight: "condensed" }]}>{displayClassText[key]}</Text>
                                    <Progress.Bar
                                        progress={postclassReqCounts[key].matched_count / postclassReqCounts[key].count}
                                        color={postclassColors[key] || 'gray'}
                                    />
                                    <View style={{flexDirection: "column", paddingLeft: 10}}>
                                        <Text style={{...styles.percentage, flexWrap: "wrap", width: 90}}>Fulfilled {(postclassReqCounts[key].matched_count)} {pluralOrSingular(postclassReqCounts[key].matched_count)}</Text>
                                        <Text style={styles.percentage}>out of {postclassReqCounts[key].count}</Text>
                                    </View>
                            </View>
                            </TouchableOpacity>
                            {!isItemCollapsed && (
                                <View style={styles.accordionContent}>
                                    {umbrellatypeReqCounts && renderProgressBars(umbrellatypeReqCounts, umbrellatypeColors)}
                                </View>
                            )}
                        </View>
                    ) : (
                        <View key={key} style={styles.progressContainer}>
                            <Text style={[styles.label, {  color: '#000', fontWeight: "condensed"  }]}>{displayClassText[key]}</Text>
                            <Progress.Bar
                                progress={postclassReqCounts[key].matched_count / postclassReqCounts[key].count}
                                color={postclassColors[key] || 'gray'}
                            />
                            <View style={{flexDirection: "column", paddingLeft: 10}}>
                                <Text style={{...styles.percentage, flexWrap: "wrap", width: 90}}>Fulfilled {(postclassReqCounts[key].matched_count)} {pluralOrSingular(postclassReqCounts[key].matched_count)}</Text>
                                <Text style={styles.percentage}>out of {postclassReqCounts[key].count}</Text>
                            </View>
                        </View>
                    )
                ))}
                </View>
                }
                <Text style = {styles.analyticsHeaderText}>Fundraisers</Text>
                <View style={styles.fundraisers}>
                { fundraisers && 
                    fundraisers.map((fundraiser: any, index: number)=>(
                        <View>
                            <FundraiserCard fundraiser={fundraiser} />
                            <View style={{
                                borderWidth: 0.2,
                                borderColor: "#bbb",
                            }}/>
                        </View>
                    ))
                }
                </View>
            </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 25
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    progressContainer: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginRight: 8,
        width: 100,
        color: '#A9A9A9',
        fontWeight: "bold",
        flexWrap: "wrap"
    },
    percentage: {
        marginLeft: 8,
        fontSize: 14,
        color: 'gray',
    },
    accordionContent: {
        paddingLeft: 20,
    },
    headerText:{
        fontSize: 17,
        color: '#787676',
        paddingVertical: 12
    },
    analytics:{
        paddingTop: 10
    },
    analyticsHeaderText:{
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom: 10,
        color: "#A9A9A9"
    },
    card:{
        padding: 5,
        backgroundColor: '#fff',
        paddingVertical: 20
    
      },
    cardHeader:{
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    profilePhoto:{
        height: 33,
        width: 33,
        marginRight: 20,
        top: 10
    },
    postDetails:{
        flexDirection: "column",
        flex: 1
    },
    userName:{
        fontWeight: 'bold',
        fontSize: 16,
    },
    timeOfPost:{
        color: '#888',
        fontSize: 12,
        marginTop: 2
    },
    textContent:{
        marginTop: 20,
        fontSize: 14
    },
    fundraisers:{
        paddingTop: 10
    },
    button:{
        paddingVertical: 7,
        borderColor: '#95A8EF',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: "40%",
        marginTop: 10
    }
});

export default DonateScreen;
