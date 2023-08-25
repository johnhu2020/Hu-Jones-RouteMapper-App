/* Comments section-John Hu and Mathew Jones

  Overview: This app allows the user to track their routes by accessing their current location coordinates and printing a polyline on the world map wherever the user goes. The user begins when they accept the app's request of location. Next, they will be brought to a screen of the world map, buttons including start, end, and turn, as well as a stopwatch. The app begins tracking down the user route when the user presses start. When start is clicked, a marker called 'start' will appear on the user's exact starting location and the app will automatically zoom in a zoomed in region of the user's current location. When the user begins moving, the app will automatically draw a polyline that follows the user's footsteps. At any point during the route, the user can click on the turn button, essentially plotting a new marker onto the map with the label 'Turn number: "index"' (index just means the 'nth' marker on the screen). All throughout the route, the app will track down the user time via a stopwatch and the user's distance traveled. Additionally, throughout the route, the app will automatically update the region so that the user does not have to move the screen when entering a new region. When the user is finished, they can press the red STOP button that pauses the stopwatch time, ends the route, plots the last marker called 'end', and zooms out of the zoomed in region. When the STOP button is pressed, it will change to 'Analyze Results' button. At this point, the user can do two things. One is to just look at the map with the plotted markers and polyline, zoom in and out, and analyze their route. They can also press on the red analyze results button, which will open a modal that displays the user's distance, the time it took, the average speed, as well as number of turns, or markers, made. To exit the modal, the user can either press 'Done', which puts them back to the old plotted route screen or 'Quit' which brings the user back to the main screen, allowing them to run it again. 


  Limitations:
  -Since I am using 'region={{}}' in mapview, I am able to update the userRegion, however, this prevents the user from being able to move the screen around -zoom in and out- on their own. They are only able to do so after the route is ended. This may be an issue since the app does not zoom in all the way, and it may be hard for the user to see their route when route is being tracked. 
  -If the user places a marker that is either in front or very close to another marker, they will not be able to click on that marker's title or see one of the markers clearly. For example if the user moved 0m, the start and end will share the same coordinates. This will cause the markers to 'fight' for that spot, so that point will keep changing from red pin (start) to green pin (end) and back and forth. 
  -I used 'toFixed' to shave off the decimals of my distance and speed values, but sometimes the app still includes many decimals for example when I got '5.79999999995 m'.
  -If the user obtains weird distance or time values, the average speed may be displayed as 'infinity'. Not sure where that is coming from. 
*/
import React, { useState, useEffect, useCallback } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import * as Location from 'expo-location';
import { Card } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
      <SafeAreaView>
        <Text style={{ fontSize: 20 }}> </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          The Route Mapper
        </Text>
        <Text style={{ color: 'black', fontSize: 10, textAlign: 'center' }}>
          Track your routes now!
        </Text>

        <Image
          source={require('./assets/mapIcon.gif')}
          style={{ width: '100%', height: '70%' }}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={{ height: '20%', width: '100%' }}
          onPress={() => {
            navigation.navigate('Game');
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Begin
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function Game({ navigation }) {
  mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#523735',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#c9b2a6',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#dcd2be',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ae9e90',
        },
      ],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#93817c',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a5b076',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#447530',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f1e6',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#fdfcf8',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f8c967',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#e9bc62',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e98d58',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#db8555',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#806b63',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8f7d77',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ebe3cd',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#b9d3c2',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#92998d',
        },
      ],
    },
  ];

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [userRegion, setUserRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [start, setStart] = useState({ latitude: 0, longitude: 0 });
  const [gameInAction, setGameInAction] = useState(false);
  const [allCoordinates, setAllCoordinates] = useState([]);
  const [currentLineWidth, setCurrentLineWidth] = useState(5);
  const [currentMarkerOpacity, setCurrentMarkerOpacity] = useState(0);
  const [endMarkerOpacity, setEndMarkerOpacity] = useState(0);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);
  8;
  const [modalVisible, setModalVisible] = useState(false);
  const [touchableDisplay, setTouchableDisplay] = useState('End');
  const [totalDistanceTraveled, setTotalDistanceTraveled] = useState(0);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [allMarkerLocations, setAllMarkerLocations] = useState([]);
  const [endTitle, setEndTitle] = useState();
  const [buttonDisability, setButtonDisability] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required to use this app.');
      }

      const location = await Location.getCurrentPositionAsync();
      setUserRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 100,
        longitudeDelta: 100,
      });

      setStart({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setAllCoordinates([
        ...allCoordinates,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      ]);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const startActiveRoute = () => {
    requestLocationPermission();
    _animateToGoal();
    setCurrentMarkerOpacity(1);
    setStopwatchStart(true);
    setGameInAction(true);
  };

  const addMarkerCoordinates = () => {
    const newMarker = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };
    setAllMarkerLocations([...allMarkerLocations, newMarker]);
  };

  const endRoute = () => {
    setStopwatchStart(false);
    _zoomOut();
    setGameInAction(false);
    setEndMarkerOpacity(1);
    setEndTitle('End');
    setTouchableDisplay('Analyze Results');
    setTotalDistanceTraveled(Number(totalDistanceTraveled.toFixed(5) * 1000));
    setButtonDisability(true);
    getTimeInVal();
  };

  function getDistance(coord1, coord2) {
    const R = 6371;
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);
    const lat1 = toRadians(coord1.latitude);
    const lat2 = toRadians(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function locationChange(event) {
    if (gameInAction) {
      setUserRegion({
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.00022,
        longitudeDelta: 0.00321,
      });
      setCurrentLocation({
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      });
      setAllCoordinates([
        ...allCoordinates,
        {
          latitude: event.nativeEvent.coordinate.latitude,
          longitude: event.nativeEvent.coordinate.longitude,
        },
      ]);
      if (allCoordinates.length >= 2) {
        let tempVal = getDistance(allCoordinates[allCoordinates.length - 1], {
          latitude: event.nativeEvent.coordinate.latitude,
          longitude: event.nativeEvent.coordinate.longitude,
        });
        setTotalDistanceTraveled(totalDistanceTraveled + tempVal);
      }
    }
  }

  const getTimeInVal = () => {
    let time = JSON.stringify(stopwatchTime);
    let hoursToSeconds = Number(time.substring(1, 3)) * 3600;
    let minutesToSeconds = Number(time.substring(4, 6)) * 60;
    let seconds = Number(time.substring(7, 9));
    setFinalTime(hoursToSeconds + minutesToSeconds + seconds);
    setSpeed(totalDistanceTraveled / finalTime);
  };

  const _mapView = React.createRef();

  function _animateToGoal() {
    if (_mapView.current) {
      _mapView.current.animateToRegion(
        {
          latitude: start.latitude,
          longitude: start.longitude,
          latitudeDelta: 0.0003,
          longitudeDelta: 0.000032,
        },
        1000
      );
    }
  }

  function _zoomOut() {
    if (_mapView.current) {
      _mapView.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 100,
          longitudeDelta: 100,
        },
        1000
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stopwatch
        laps
        secs
        start={stopwatchStart}
        reset={stopwatchReset}
        options={options}
        getTime={(time) => setStopwatchTime(time)}
      />

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={userRegion}
        onUserLocationChange={(e) => locationChange(e)}
        region={userRegion}
        customMapStyle={mapStyle}
        ref={_mapView}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={true}
        showsBuildings={true}
        showsIndoors={true}
        loadingEnabled={true}
        rotateEnabled={true}>
        {allMarkerLocations.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            pinColor={'black'}
            title={'Turn number: ' + (index + 1)}
          />
        ))}

        <Marker coordinate={start} title="Start" opacity={currentMarkerOpacity}>
          <Image
            source={require('./assets/redPin.png')}
            style={{ width: windowWidth * 0.08, height: windowWidth * 0.08 }}
          />
        </Marker>
        <Marker
          coordinate={currentLocation}
          title={endTitle}
          opacity={endMarkerOpacity}>
          <Image
            source={require('./assets/greenPin.png')}
            style={{ width: windowWidth * 0.08, height: windowWidth * 0.08 }}
          />
        </Marker>

        <Polyline
          coordinates={allCoordinates}
          strokeColor={'red'}
          strokeWidth={currentLineWidth}
        />
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{ top: '15%', width: '100%', height: '80%' }}>
          <Card style={{ backgroundColor: '#f2b8c6' }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Total Distance = {totalDistanceTraveled} m
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Total Time = {finalTime} s
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Average Speed = {(totalDistanceTraveled / finalTime).toFixed(4)}{' '}
              m/s
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Total number of turns = {allMarkerLocations.length} #
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 30,
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <Text> </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text> </Text>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 30,
                  width: '100%',
                }}>
                Quit
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>

      <View style={styles.touchableContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            borderRadius: 5,
            height: '100%',
            width: '54%',
          }}
          onPress={() => {
            touchableDisplay == 'End' ? endRoute() : setModalVisible(true);
          }}>
          <Text style={{fontSize: 10}}> </Text>
          <Text
            style={styles.buttonStyle}>
            {touchableDisplay}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: '#9ae0d9', width: '25%', borderRadius: 5,}}
          disabled={buttonDisability}
          onPress={() => startActiveRoute()}>
          <Text style={{fontSize: 10}}> </Text>
          <Text
            style={styles.buttonStyle}>
            Start!
          </Text>
        </TouchableOpacity>
        <Text> </Text>
        <TouchableOpacity
        style={{backgroundColor: '#9ae0d9', width: '25%', borderRadius: 5,}}
          disabled={buttonDisability}
          onPress={addMarkerCoordinates}>
          <Text style={{fontSize: 10}}> </Text>
          <Text
            style={styles.buttonStyle}>
            Turn
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initalRouteName={'Home'}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '82%',
  },
  touchableContainer: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  buttonStyle: {
    color: 'black',
    fontFamily: 'Cochin',
    textAlign: 'center',
    fontSize: 20,
    width: '100%',
  }, 
});

const options = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    width: '100%',
    height: '8%',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    color: '#f3e0e2',
    marginLeft: 7,
    textAlign: 'center',
  },
};
