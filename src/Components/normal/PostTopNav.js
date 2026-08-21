import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import AllPosts from "./AllPosts";
import LikedPosts from "./LikedPosts";
import TaggedPosts from "./TaggedPosts";
import PrivateVideos from "./PrivateVideos";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AllTaggedPosts from "./AllTaggedPosts";

const Tab = createMaterialTopTabNavigator();

export default function PostTopNav() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarItemStyle: {
            width: "auto",
          },
        }}
      >
        <Tab.Screen
          name="AllPosts"
          component={AllPosts}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="grid" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LikedPosts"
          component={LikedPosts}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="heart-outline" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TaggedPosts"
          component={AllTaggedPosts}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="tag-outline" size={26}  color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="PrivateVideos"
          component={PrivateVideos}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="lock-outline" size={26}  color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {options.tabBarIcon({ color: isFocused ? "#161722" : "#D7D7D9" })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
});
