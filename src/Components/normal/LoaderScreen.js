import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import DashboardScreen from "./DashboardScreen";

import { Section3 } from "../../assets2/Images/allImages";
import { useFocusEffect } from "@react-navigation/native";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { AuthContext } from "../../Context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import UserData from "../../Fetch_API/UsersData";
import { setAllUsers } from "../../redux/action";

export default function LognIn(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();


  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        (async()=>{
          await UserData(userId)
          dispatch(fetchProfileData(userId));
        })();
      }
      else{
        dispatch(setAllUsers([]))
      }
    }, [userId])
  );


  useEffect(()=>{


    const bootstrap = async()=>{

      const initialUrl = await Linking.getInitialURL();


    if(initialUrl && initialUrl.includes('/profile/')){
      setIsLoading(false);
      props.navigation.replace("BottomNavigator");
      return;  
    }
    }
  })

useEffect(() => {
  const bootstrap = async () => {
    // ✅ Check deep link FIRST before doing anything
    const initialUrl = await Linking.getInitialURL();

    if (initialUrl && initialUrl.includes('/profile/')) {
      // ✅ Deep link case — skip the 2 second wait
      // go to BottomNavigator immediately so NavigationContainer
      // can then navigate to OtherUserProfileScreen on top
      setIsLoading(false);
      props.navigation.replace("BottomNavigator");
      return; // stop here — linking config handles the rest
    }

    // Normal launch — keep the 2 second splash
    const timer = setTimeout(() => {
      setIsLoading(false);
      props.navigation.replace("BottomNavigator");
    }, 2000);

    return () => clearTimeout(timer);
  };

  bootstrap();
}, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={Section3} style={styles.background}>
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        >
          <View style={styles.textContainer}>
            <Text style={styles.textWelcome}>Welcome To <Text style={styles.textMyFame}>MyFame</Text></Text>
           
          </View>

          {/* <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Analyze profits and losses from all your sportbooks all in one
              place.
            </Text>
          </View> */}
        </LinearGradient>
      </ImageBackground>
      <View style={styles.buttonContainer}>
        {isLoading ? <ActivityIndicator size="large" color="#00E2FF" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    height:"100%"
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 150,
  },
  textWelcome: {
    fontSize: 65,
    fontWeight: "100",
    color: "#fff",
    textAlign:"center"
  },
  textMyFame: {
    fontSize: 55,
    fontWeight: "600",
    color: "#00E6FF",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 55,
  },
  infoText: {

    
    color: "#fff",
    textAlign: "center",
    width: 300,
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: "#010101",
    height: 150,
  },
  button: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontWeight: "800",
  },
});
