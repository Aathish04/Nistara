import React, {useState, useEffect, useCallback } from 'react'
import { Text, View, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native'
import { useUser } from '../components/UserContext'
import { SQLiteClient } from '../sqlite/localdb'
import { Ionicons } from '@expo/vector-icons'
import ReqDonationCard from '../components/ReqDonationCard'

const YourProfileDonationsScreen = ({navigation}: {navigation: any}) =>{
    const [donations, setDonations] = useState<any>([]);
    const [message, setMessage] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false);
    const [userMadeDonations, setUserMadeDonations] = useState(false);

    const localDbClient = new SQLiteClient()

    const {userID, userName, profileImage, language} = useUser()

    const fetchUserDonations = useCallback(async () => {
        try {
            const localUserDonations = await localDbClient.getDonationsWhereUserId(userID);
            // const localUserDonations = await localDbClient.getDonations();
            if (localUserDonations && localUserDonations.length > 0) {
                setUserMadeDonations(true);
                setDonations(localUserDonations);
                setMessage(null);
            } else {
                setUserMadeDonations(false);
                setDonations([]);
            }
        } catch (err) {
            console.error('Error fetching Donations from local db: ', err);
            setMessage('We are unable to fetch your Donations right now. Please try again later!');
        }
    }, [userID]);


    useEffect(()=>{
        fetchUserDonations()
    }, [fetchUserDonations])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserDonations().then(() => setRefreshing(false));
    }, [fetchUserDonations]);

    return(
        <View style={{ flex: 1, backgroundColor: '#fff'}}>
        {message ? (
            <Text style={styles.messageText}>{message}</Text>
        ) : (
            <>
                {!userMadeDonations ? (
                    <View style={styles.noDonations}>
                        <Text style={styles.noDonationsText}>You haven't made any donations yet.</Text>
                        <Pressable onPress={()=>{navigation.navigate('WritePost')}}>
                            <Text style={{fontWeight: 'bold', color: '#95A8EF', fontSize: 16}}> Start now!</Text>
                        </Pressable>
                    </View>   
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
                        >
                        {donations.map((donation: any, index: any) => (
                            <View key = {donation.id} style={styles.card}>
                                <ReqDonationCard item={donation} key={index} />
                                <View style={styles.status}>
                                    <Ionicons name="information-circle-outline" size={24} color = '#95A8EF'/>
                                    {
                                    donation.ismatched? (<Text style={{width: "90%", marginLeft: 10, color: "#808080", fontWeight: "bold"}}>Your donation has been matched.</Text>): (<Text style={{width: "90%", marginLeft: 10, color: "#808080", fontWeight: "bold"}}>We are trying to find someone who is in need of your kindness. Kindly wait for a few more minutes.</Text>)
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

export default YourProfileDonationsScreen;

const styles = StyleSheet.create({
    card:{
        padding: 20,
        paddingHorizontal: 30,
        marginBottom: 5,
        backgroundColor: '#fff',
        elevation: 5
    
    },
    noDonations:{
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
    noDonationsText: {
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