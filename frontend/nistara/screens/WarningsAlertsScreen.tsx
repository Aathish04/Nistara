import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { Ionicons } from "@expo/vector-icons";
import { Credential } from '../database/env';

const cred = new Credential();
const BING_MAPS_API_KEY: string = cred.BING_MAPS_API_KEY

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
        // console.log(data)
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

  const generateHtmlContent = () => {
    const userCoords = userLocation
      ? `${userLocation.coords.latitude},${userLocation.coords.longitude}`
      : '20.5937,78.9629';
  
    const markers = alerts.map(alert => {
      const [latitude, longitude] = alert.centroid.split(',').map(Number);
      return `{
        location: new Microsoft.Maps.Location(${longitude}, ${latitude}),
        severityColor: "${alert.severity_color}",
        data: ${JSON.stringify(alert)}
      }`;
    }).join(',');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bing Maps Integration</title>
        <script type="text/javascript" src="https://www.bing.com/api/maps/mapcontrol?key=${BING_MAPS_API_KEY}"></script>
        <script type="text/javascript">
          let map;
          function loadMapScenario() {
            map = new Microsoft.Maps.Map(document.getElementById('map'), {
              center: new Microsoft.Maps.Location(${userCoords}),
              zoom: 5
            });
  
            const markers = [${markers}];
            markers.forEach(markerInfo => {
              const pin = new Microsoft.Maps.Pushpin(markerInfo.location, {
                color: markerInfo.severityColor
              });
              pin.metadata = markerInfo.data;
              Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                window.ReactNativeWebView.postMessage(JSON.stringify(pin.metadata));
              });
              map.entities.push(pin);
            });
          }

        </script>
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          #map {
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body onload="loadMapScenario();">
        <div id="map"></div>
      </body>
      </html>
    `;
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
  originWhitelist={['*']}
  source={{ html: generateHtmlContent() }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  style={{ flex: 1 }}
  onMessage={(event) => {
    const alert = JSON.parse(event.nativeEvent.data);
    handleMarkerPress(alert);
  }}
/>


      {selectedAlert && (
        <View style={styles.overlay}>
          <View style={[styles.modalContent]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
                <Ionicons name="warning-outline" size={26} color={selectedAlert.severity_color} style={{ paddingTop: 7 }} />
                <Text style={styles.modalTitle}>
                  {selectedAlert.severity_color.charAt(0).toUpperCase() + selectedAlert.severity_color.substring(1).toLowerCase()} Alert issued by {selectedAlert.alert_source}
                </Text>
              </View>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={"black"} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Text>{'\u2022'}</Text>
                <Text style={{ flex: 1, paddingLeft: 5 }}>
                  {selectedAlert.severity_level.charAt(0).toUpperCase()}{selectedAlert.severity_level.substring(1).toLowerCase()} occurrence of {' ' + selectedAlert.disaster_type.toLowerCase()}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Text>{'\u2022'}</Text>
                <Text style={{ flex: 1, paddingLeft: 5 }}>Expected in {selectedAlert.area_description}</Text>
              </View>
              {(selectedAlert.severity === "WARNING" || selectedAlert.severity === "Orange" || selectedAlert.severity === "Red" || selectedAlert.severity === "Yellow") ? (
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>Individuals in and near this area are requested to stay on 'ALERT'</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>Individuals in and around this area are requested to stay on '{selectedAlert.severity}'</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Text>{'\u2022'}</Text>
                <Text style={{ flex: 1, paddingLeft: 5 }}>Expected to last from {formatDateTime(selectedAlert.effective_start_time)} to {formatDateTime(selectedAlert.effective_end_time)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
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
    paddingBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    width: 260,
    paddingLeft: 20,
  },
});

export default WarningsAlertsScreen;
