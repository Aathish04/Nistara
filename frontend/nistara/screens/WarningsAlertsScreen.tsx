import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons} from "@expo/vector-icons";

interface Alert {
  severity: string;
  identifier: number;
  effective_start_time: string;
  effective_end_time: string;
  disaster_type: string;
  area_description: string;
  severity_level: string;
  type: number;
  actual_lang: string;
  warning_message: string;
  disseminated: string;
  severity_color: string;
  alert_id_sdma_autoinc: number;
  centroid: string;
  alert_source: string;
  area_covered: string;
  sender_org_id: string;
}


const WarningsAlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [msg, setMsg] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    };
    getLocation();
  }, []);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const response = await fetch('https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Length': '0',
          },
        });
        const data: Alert[] = await response.json();
        setAlerts(data);
      } catch (err) {
        console.error('Error fetching data: ', err);
      }
    };

    fetchAlertData();
  }, []);

  const handleMarkerPress = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const closeModal = () => {
    setSelectedAlert(null);
  };

  const formatDateTime = (dateTimeStr: string) => {
    const parts = dateTimeStr.split(' ');
    const day = parts[0];
    const month = parts[1];
    const date = parts[2];
    const year = parts[5];
    const time = parts[3].slice(0, 5);

    return `${day}, ${month} ${date} ${year}, ${time} hrs`;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation?.coords.latitude || 20.5937,
          longitude: userLocation?.coords.longitude || 78.9629,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}
      >

      {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}


        {alerts.map((alert) => {
          const [longitude, latitude] = alert.centroid.split(',').map(Number);
          return (
            <Marker
              key={alert.identifier}
              coordinate={{ latitude, longitude }}
              pinColor={alert.severity_color}
              onPress={() => handleMarkerPress(alert)}
            />
          );
        })}
      </MapView>

      {(selectedAlert)?(
        <View style={styles.overlay}>
          <View style={[styles.modalContent]}>

            <View style={styles.modalHeader}>
                <View style = {{flex:1, flexDirection: "row", justifyContent: "flex-start"}}>
                <Ionicons name="warning-outline" size={26} color={selectedAlert.severity_color} style={{paddingTop: 7}}/>
                <Text style={styles.modalTitle}>
                    {selectedAlert.severity_color.charAt(0).toUpperCase()+selectedAlert.severity_color.substring(1,).toLowerCase()} Alert issued by {selectedAlert.alert_source}
                </Text>
                </View>
                <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={"black"} />
                </TouchableOpacity>
            </View>
            <>

            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5}}>{selectedAlert.severity_level.charAt(0).toUpperCase()}{selectedAlert.severity_level.substring(1,).toLowerCase()} occurence of 
                    {' '+selectedAlert.disaster_type.toLowerCase()}
                </Text>
            </View>

            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5}}>Expected in {selectedAlert.area_description}</Text>
            </View>

            {(selectedAlert.severity==="WARNING" || selectedAlert.severity=="Orange" || selectedAlert.severity == "Red" || selectedAlert.severity == "Yellow")?(
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5}}>Individuals in and near this area are requested to stay on 'ALERT'</Text>
            </View>):(
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5}}>Individuals in and around this area are requested to stay on '{selectedAlert.severity}'</Text>
            </View>
            )}

            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5}}>Expected to last from {formatDateTime(selectedAlert.effective_start_time)} to {formatDateTime(selectedAlert.effective_end_time)}</Text>
            </View>
            
            </>

          </View>
        </View>
      ):(<></>)}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFD0D6',
    justifyContent: 'flex-end',
    opacity: 0.95,
    zIndex: 2,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60
  },
  modalContent: {
    padding: 20
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    width: 260,
    paddingLeft: 20
  }
});

export default WarningsAlertsScreen;
