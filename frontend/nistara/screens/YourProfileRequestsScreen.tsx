import React, {useState, useEffect, useCallback } from 'react'
import { Text, View, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native'
import { useUser } from '../components/UserContext'
import { SQLiteClient } from '../sqlite/localdb'
import { Ionicons } from '@expo/vector-icons'
import ReqDonationCard from '../components/ReqDonationCard'

const YourProfileRequestsScreen = ({navigation}: {navigation: any}) =>{
    const [requests, setRequests] = useState<any>([]);
    const [message, setMessage] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false);
    const [userMadeRequests, setUserMadeRequests] = useState(false);

    const localDbClient = new SQLiteClient()

    const {userID, userName, profileImage, language} = useUser()

    const fetchUserRequests = useCallback(async () => {
        try {
            const localUserRequests = await localDbClient.getRequestsWhereUserId(userID);
            // const localUserRequests = await localDbClient.getRequests();
            if (localUserRequests && localUserRequests.length > 0) {
                setUserMadeRequests(true);
                setRequests(localUserRequests);
                setMessage(null);
            } else {
                setUserMadeRequests(false);
                setRequests([]);
            }
        } catch (err) {
            console.error('Error fetching Requests from local db: ', err);
            setMessage('We are unable to fetch your Requests right now. Please try again later!');
        }
    }, [userID]);


    useEffect(()=>{
        fetchUserRequests()
    }, [fetchUserRequests])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserRequests().then(() => setRefreshing(false));
    }, [fetchUserRequests]);

    return(
        <View style={{ flex: 1, backgroundColor: '#fff'}}>
        {message ? (
            <Text style={styles.messageText}>{message}</Text>
        ) : (
            <>
                {!userMadeRequests ? (
                    <View style={styles.noRequests}>
                        <Text style={styles.noRequestsText}>You haven't made any requests yet.</Text>
                        <Pressable onPress={()=>{navigation.navigate('WritePost')}}>
                            <Text style={{fontWeight: 'bold', color: '#95A8EF', fontSize: 16}}> Start now!</Text>
                        </Pressable>
                    </View>   
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
                        >
                        {requests.map((request: any, index: any) => (
                            <View key = {request.id} style={styles.card}>
                                <ReqDonationCard item={request} key={index} />
                                <View style={styles.status}>
                                    <Ionicons name="information-circle-outline" size={24} color = '#95A8EF'/>
                                    {
                                    request.ismatched? (<Text style={{width: "90%", marginLeft: 10, color: "#808080", fontWeight: "bold"}}>Your request has been matched.</Text>): (<Text style={{width: "90%", marginLeft: 10, color: "#808080", fontWeight: "bold"}}>We are trying to find how we can service your request. Kindly wait for a few more minutes.</Text>)
                                    }
                                </View>
                            </View>
                        ))}

                    </ScrollView>
                )}
            </>
        )}
        </View>
    )
}

export default YourProfileRequestsScreen;

const styles = StyleSheet.create({
    card:{
        padding: 20,
        paddingHorizontal: 30,
        marginBottom: 5,
        backgroundColor: '#fff',
        elevation: 5
    
    },
    noRequests:{
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center"
    },
    messageText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noRequestsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    track:{
        paddingTop: 20,
        flexDirection: "row"
    },
    trackText:{
        fontWeight: "bold",
        color: "#95A8EF",
        paddingLeft: 5,
        top: 2
    },
    status:{
        flexDirection: "row",
        marginTop: 10
    }
});