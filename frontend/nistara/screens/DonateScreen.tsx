import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { SQLiteClient } from '../sqlite/localdb';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import SafeViewAndroid from '../components/SafeViewAndroid';

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

const DonateScreen = () => {
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

    const renderProgressBars = (data: any, colorMap: any) => {
        return (
            <View>
                {Object.keys(data).filter(key => key !== 'null').map((key) => (
                    <View key={key} style={styles.progressContainer}>
                        <Text style={styles.label}>{displayClassText[key]}</Text>
                        <Progress.Bar
                            progress={data[key].matched_count / data[key].count}
                            width={300}
                            color={colorMap[key] || 'gray'}
                            style={styles.progressBar}
                        />
                        <Text style={styles.percentage}>{((data[key].matched_count / data[key].count) * 100).toFixed(1)}%</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
            <View style={styles.container}>
                 <Text style={styles.headerText}>Get involved by understanding the demand for requests and services, and join us in creating or supporting fundraisers.</Text>
            <ScrollView style={{flex:1}}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
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
                                        width={300}
                                        // height={10}
                                        color={postclassColors[key] || 'gray'}
                                        style={styles.progressBar}
                                    />
                                    <Text style={styles.percentage}>{((postclassReqCounts[key].matched_count / postclassReqCounts[key].count) * 100).toFixed(1)}%</Text>
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
                                // height={10}
                                color={postclassColors[key] || 'gray'}
                                style={styles.progressBar}
                            />
                            <Text style={styles.percentage}>{((postclassReqCounts[key].matched_count / postclassReqCounts[key].count) * 100).toFixed(1)}%</Text>
                        </View>
                    )
                ))}
                </View>
                }
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
    progressBar: {
        flex: 1,
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
    }
});

export default DonateScreen;
