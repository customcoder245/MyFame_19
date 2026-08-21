import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../../Top/Components-top/HomeScreen";
import AllUsersPosts from "../../../Components/normal/AllUsersPosts";
import { useSelector } from "react-redux";
import SwipeableUserList from "@components/normal/Swipe";
const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  // Function placeholders for additional functionality
  const profileData = useSelector((state) => state.profile.profileData);


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          marginTop: 30,
          // width: "55%",
          // marginLeft:"17%",
          
        },
        tabBarLabelStyle: {
          color: "white",
          fontWeight: "normal", // Set default font weight
        },
        tabBarActiveTintColor: "white", // Set active label color
        tabBarInactiveTintColor: "gray", // Set inactive label color
        tabBarIndicatorStyle: {
          backgroundColor: "", // Customize indicator color
          height: 2,
        },
      }}
    >  
      <Tab.Screen
        name="ForYou"
        component={AllUsersPosts }
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabText,
                focused && styles.activeTabText,
                { textAlign: "center" , marginLeft:"48%"},
              ]}
              onPress={() => handleTabPress("ForYou ")} // Handle tab press
            >
               For You
            </Text>
          ),
          tabBarIconStyle: {  width: 100 },
          tabBarIndicatorStyle: { width: 0, backgroundColor: "" },
        }}
      />
      <Tab.Screen
        name="Following"
        component={profileData && profileData.following_post_count >= 1 ? HomeScreen : SwipeableUserList}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabText,
                focused && styles.activeTabText,
                { textAlign: "left" , marginRight:"76%"},

              ]}
              onPress={() => handleTabPress("Following")} // Handle tab press
            >
             Following
            </Text>
          ),
          tabBarIconStyle: { width: 10 },
          tabBarIndicatorStyle: { width: 0, backgroundColor: "" },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabText: {
    color: "white",
    width: 100,
    marginLeft: 100,
    fontWeight: "400",
fontSize:14
  },
  activeTabText: {
    fontWeight: "bold",
    fontSize:15
  },
});

export default TopTabNavigator;
