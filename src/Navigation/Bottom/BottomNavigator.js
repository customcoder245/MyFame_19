import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chat from "./Components-bottom/Chat";
import LogInPage from "./Components-bottom/LogInPage";
import HomeScreen from "../Top/Components-top/HomeScreen";
import TopTabNavigator from "./Components-bottom/TopNavigator";
import Explore from "./Components-bottom/Explore";
import Cam from "../../Components/Camera/Cam";
import AppNav from "../../StackScreens/AppNav";
import ItemData from "../../Fetch_API/ItemData";
import FollowingList from "@components/normal/FollowingList";
import {
  Accounttrokecon,
  Group144,
  home1,
  SearchIcon,
} from "../../assets2/Icons/allIcons";
import { MessageokeIcon } from "../../assets2/Icons/allIcons";
import App from "../../Components/Camera/Cam";
import MyFollowerData from "../../Fetch_API/MyFollowerData";
import UserData from "../../Fetch_API/UsersData";
import ListOfMusic from "../../screens/ListOfMusic";
import { push } from "../../../utils/navigation";
import { generateAccessToken } from "@services/spotify";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import EveryPostNUserId from "@components/normal/EveryPostNUserId";
import MoveSignIn from "@components/normal/MoveSignIn";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import PlayIcon from "../../assets2/Icons/PlayIcon";
const Bottom = createBottomTabNavigator();
const BottomNavigator = () => {
  generateAccessToken();
  const navigation = useNavigation()
  const { userId } = useContext(AuthContext);

  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "black",

          height: "8.5%",
          elevation: 5,
          shadowOpacity: 0.25,
          borderTopColor: "black",
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarHideOnKeyboard : true,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarIconStyle: {
          marginTop: 5,
        },
      })}
    >
      <Bottom.Screen
        name="Home"
        component={userId ? TopTabNavigator : EveryPostNUserId}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 10,  // Increase this value to move the text away from the bottom
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="home-outline" size={26} color={focused?'white':'gray'} style={{marginTop:5}} />
          ),
        }}
      />
      <Bottom.Screen
        name="Discover"
        component={userId ? Explore : MoveSignIn}
        options={{
          tabBarLabel: "Explore", // Remove the text label
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 10,  // Increase this value to move the text away from the bottom
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="magnify" size={26} color={focused?'white':'gray'} />
          ),
        }}
      />
      <Bottom.Screen
        name="Chat2"
        component={userId ?() => <></> : MoveSignIn}
        options={{
          tabBarLabel: "", // Remove the text label
          headerShown: false,
          tabBarLabelStyle: {
          },
          tabBarIcon: ({ focused }) => (
            userId ? <Pressable
            style={[
              styles.tabIconContainer,
              focused && styles.activeTabIconContainer,
            ]}
            onPress={() => {
              navigation.navigate('TermsOfServiceFetch')
            }}
          >
            <PlayIcon />
          </Pressable>
          : <View
          style={[
            styles.tabIconContainer,
            focused && styles.activeTabIconContainer,
          ]}
          onPress={() => {
            navigation.navigate('TermsOfServiceFetch')
          }}
        >
          <PlayIcon />
        </View>
          ),
        }}        
      />
      <Bottom.Screen
        name="Chat"
        component={ userId ? Chat : MoveSignIn}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="message-reply-text-outline" size={26} color={focused?'white':'gray'} />
          ),
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 10,  // Increase this value to move the text away from the bottom
          },
        }}
      />
      <Bottom.Screen
        name="Me"
        component={AppNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="account-outline" size={26} color={focused?'white':'gray'} />
          ),
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 10,  // Increase this value to move the text away from the bottom
          },
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
    width: 56,
    height: 56,
  },
  activeTabIcon: {
    tintColor: "white",
  },
});

export default BottomNavigator;
