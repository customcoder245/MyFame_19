import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Chat from "./Chat";
import LogInPage from "./LogInPage";
import HomeScreen from "../../Top/Components-top/HomeScreen";
import TopTabNavigator from "./TopNavigator";
import Explore from "./Explore";
import Cam from "../../../Components/Camera/Cam";
import AppNav from "../../../StackScreens/AppNav";
import ItemData from "../../../Fetch_API/ItemData";

import {
  Accounttrokecon,
  Group144,
  home1,
  SearchIcon,
} from "../../../assets2/Icons/allIcons";
import { MessageokeIcon } from "../../../assets2/Icons/allIcons";
import App from "../../../Components/Camera/Cam";
import MyFollowerData from "../../../Fetch_API/MyFollowerData";
import UserData from "../../../Fetch_API/UsersData";
import ListOfMusic from "../../../screens/ListOfMusic";
import { push } from "../../../../../utils/navigation";
import { generateAccessToken } from "@services/spotify";
const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
  generateAccessToken();

  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "black",
          borderRadius: 6,
          height: "10%",
          elevation: 5,
          shadowOpacity: 0.25,
          borderTopColor: "black",
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarIconStyle: {
          marginTop: 5,
        },
      })}
    >
      <Bottom.Screen
        name="Home"
        component={TopTabNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer,
              ]}
            >
              <Image
                source={home1}
                style={[styles.tabIcon, focused && styles.activeTabIcon]}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Discover"
        component={Explore}
        options={{
          tabBarLabel: "Explore", // Remove the text label
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer,
              ]}
            >
              <Image
                source={SearchIcon}
                style={[styles.tabIcon, focused && styles.activeTabIcon]}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Chat2"
        component={() => <></>}
        options={{
          tabBarLabel: "", // Remove the text label
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Pressable
              style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer,
              ]}
              onPress={() => {
                push({ screenName: "TermsOfServiceFetch" });
                console.log("---> click");
              }}
            >
              <Image source={Group144} style={[styles.tabIcon2]} />
            </Pressable>
          ),
        }}
      />
      <Bottom.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer,
              ]}
            >
              <Image
                source={MessageokeIcon}
                style={[styles.tabIcon, focused && styles.activeTabIcon]}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Me"
        component={AppNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer,
              ]}
            >
              <Image
                source={Accounttrokecon}
                style={[styles.tabIcon, focused && styles.activeTabIcon]}
              />
            </View>
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabIconContainer: {},
  tabIcon: {
    width: 20,
    height: 20,
    tintColor: "gray",
  },
  tabIcon2: {
    width: 50,
    height: 50,
  },
  activeTabIcon: {
    tintColor: "white",
  },
});

export default BottomNavigator;
