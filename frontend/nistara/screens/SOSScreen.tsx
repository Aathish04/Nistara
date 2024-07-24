import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, Linking, TextInput, ScrollView } from 'react-native';
import { sosHelplines } from '../newsdata/soshelplines';
import { useUser } from '../components/UserContext';
import { images } from '../constants/Images';
import { Ionicons } from '@expo/vector-icons';
import SafeViewAndroid from '../components/SafeViewAndroid';

const SOSScreen = ({ navigation }: {navigation : any}) => {
    const [search, setSearch] = useState<string>('');
    const [filteredHelplines, setFilteredHelplines] = useState<any[]>(sosHelplines);

    const updateSearch = (search: string) => {
        setSearch(search);
        if (search) {
            const newData = sosHelplines.filter(item => {
                const itemData = `${item.title.toUpperCase()} ${item.number}`;
                const textData = search.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredHelplines(newData);
        } else {
            setFilteredHelplines(sosHelplines);
        }
    };

    const renderItem = (item: any) => (
        <View key={item.number} style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.helpline}>{item.title}</Text>
                <Text style={styles.number}>{item.number}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.number}`)} style={styles.chevronButton}>
                <Ionicons name="call-outline" size={24} color="#95A8EF" />
            </TouchableOpacity>
        </View>
    );

    const { profileImage } = useUser();
    const userAvatar = images[profileImage];

    return (
        <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={{ top: 4 }} onPress={() => { navigation.goBack() }}>
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Nistara</Text>
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate("Profile") }}>
                        <Image
                            source={userAvatar}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search for helplines..."
                        onChangeText={updateSearch}
                        value={search}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                        {filteredHelplines.map(item => renderItem(item))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SOSScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        color: '#333',
        marginLeft: 10
    },
    profileImage: {
        width: 35,
        height: 35
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemContent: {
        flex: 1,
    },
    helpline: {
        fontSize: 16,
    },
    number: {
        fontSize: 14,
        color: '#A9A9A9',
        paddingTop: 5,
        fontWeight: "bold"
    },
    chevronButton: {
        padding: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
    },
    scrollView: {
        flex: 1,
    },
});
