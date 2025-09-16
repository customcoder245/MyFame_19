import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import BottomNavigator from "./Navigation/Bottom/BottomNavigator";

import Parent from "./Components/normal/Parent";
import HomeScreen from "./Navigation/Top/Components-top/HomeScreen";
import ResetScreen from "./Components/normal/ResetScreen";
import Profile from "./Components/normal/Profile";
import DashboardScreen from "./Components/normal/DashboardScreen";
import TestScreen from "./Components/normal/TestScreen";
import LoaderScreen from "./Components/normal/LoaderScreen";
import ProfileScreen from "./Components/normal/ProfileScreen";
import PostTopNav from "./Components/normal/PostTopNav";
import Chat from "./Navigation/Bottom/Components-bottom/Chat";
import LogInPage from "./Navigation/Bottom/Components-bottom/LogInPage";
import SignUp from "./Components/normal/SignUp";
import Editprofile from "./Components/normal/EditProfile";
import CreatorTools from "./Components/normal/CreatorTools";
import QrScreen from "./Components/normal/QrScreen";
import Account from "./Components/Privacy and setting  screens/Account";
import AccountImformation from "./Components/Privacy and setting  screens/AccountImformation";
import VerifyEmail from "./Components/Privacy and setting  screens/VerifyEmail";
import PrivacyPolicy from "./Components/Privacy and setting  screens/PrivacyPolicy";
import Friends from "./Components/normal/Friends";
import TopTabNavigator from "./Navigation/Bottom/Components-bottom/TopNavigator";
import NoOfLikes from "./Components/normal/NoOfLikes";
import PrivacyScreen from "./Components/Privacy and setting  screens/PrivacyScreen";
import SecurityPermission from "./Components/Privacy and setting  screens/Security&Permission";
import ManageDevice from "./Components/Privacy and setting  screens/ManageDevice";
import TwoStepValidation from "./Components/Privacy and setting  screens/TwoStepValidation";
import Notification from "./Components/Privacy and setting  screens/Notification";
import InAppNotification from "./Components/Privacy and setting  screens/InAppNotification";
import ActivityCenter from "./Components/Privacy and setting  screens/ActivityCenter";
import CommentHistory from "./Components/Privacy and setting  screens/CommentHistory";
import RecentlyDeleted from "./Components/Privacy and setting  screens/RecentlyDeletd";
import ContentPreference from "./Components/Privacy and setting  screens/ContentPreference";
import RestrictedMode from "./Components/Privacy and setting  screens/RestrictedMode";
import ADS from "./Components/Privacy and setting  screens/ADS";
import Language from "./Components/Privacy and setting  screens/Language";
import ScreenTime from "./Components/Privacy and setting  screens/ScreenTime";
import DailyScreenTime from "./Components/normal/DailyScreenTime";
import OfflineVideos from "./Components/Privacy and setting  screens/OfflineVideos";
import DataSaver from "./Components/Privacy and setting  screens/DataSaver";
import ReportAProblem from "./Components/normal/ReportAProblem";
import SupportScreen from "./Components/normal/SupportScreen";
import TermsAndPolicy from "./Components/Privacy and setting  screens/TermsAndPolicy";
import CommunityGuidelines from "./Components/Privacy and setting  screens/CommunityGuidelines";
import TermsOfService from "./Components/Privacy and setting  screens/TermsOfService";
import PrivacyPolicyScreen from "./Components/Privacy and setting  screens/PrivacyPolicyScreen";
import IntellectualPolicy from "./Components/Privacy and setting  screens/IntellectualPolicy";
import Opensourcesoftware from "./Components/normal/Opensourcesoftware";
import Explore from "./Navigation/Bottom/Components-bottom/Explore";
import ForgotPassword from "./Components/normal/ForgotPassword";
import ResetPassword from "@components/normal/ResetPassword";
import VerifyOtp from "@components/normal/VerifyOtp";
import { Settting, clo0ckmahamn, logonew } from "./assets2/Icons/allIcons";
import NewUi from "./Components/normal/NewUi";
import Cam from "./Components/Camera/Cam";
import AppNav from "./StackScreens/AppNav";
import UsersList from "./Components/normal/AllUsers";
import userdata from "./Fetch_API/UsersData";
import UpdateProfile from "./Fetch_API/UpdateProfile";
import EditDemo from "./Components/normal/EditDemo";
import AllUsersPosts from "./Components/normal/AllUsersPosts";
import CommentScreen from "./Components/normal/CommentScreen";
import AllUsersData from "./Components/normal/AllUsersData";
import OtherUserProfileScreen from "./Components/normal/OtherUserProfileScreen";
import AllPostScroll from "./Components/normal/AllPostScroll";
import CreatePost from "./screens/Post/CreatePost";
import TermsOfServiceFetch from "./Fetch_API/TermsOfServiceFetch";
import ListOfMusic from "@screens/ListOfMusic";
import PostTopNav2 from "./Components/normal/PostTopNav2";
import UserChat from "@screens/Chat/UserChat";
import VideoItem from "./Navigation/Top/Components-top/VideoItem";
import PreviewPost from "@screens/Post/PreviewPost";
import SwipeableUserList from "@components/normal/Swipe";
import LikedUsersScreen from "@components/normal/LikedUsersScreen";
import ComingSoonScreen from "@components/normal/ComingSoonScreen";
import ChangePasswordFromSettings from "@components/Privacy and setting  screens/ChangePasswordFromSettings";
import DeleteOrDeactivateAcc from "@components/Privacy and setting  screens/DeleteOrDeactivateAcc";
import DeactivateAccount from "@components/Privacy and setting  screens/DeactivateAccount";
import DeleteAccount from "@components/Privacy and setting  screens/DeleteAccount";
import FollowingList from "@components/normal/FollowingList";
import FollowersCount from "@components/normal/FollowersCount";
import FollowersList from "@components/normal/FollowersList";
const Stack = createStackNavigator();

const AppNavigation = ({}) => {
  const bottomSheetRef = useRef(null); 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Loader"
          component={LoaderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppNav"
          component={AppNav}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
          initialParams={{ bottomSheetRef }}
        />
                <Stack.Screen
          name="Videoitem"
          component={VideoItem}
          options={{ headerShown: false }}
          initialParams={{ bottomSheetRef }}
        />                
        <Stack.Screen 
        name="ComingSoonScreen"
        component={ComingSoonScreen}
        // options={{ headerShown: false }}
        options={{ headerTitle:"Coming Soon" }}
      />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen
          name="PostTopNav"
          component={PostTopNav}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="PostTopNav2"
          component={PostTopNav2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigator"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Editprofile"
          component={Editprofile}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Edit Profile",
          }}
        />
                <Stack.Screen
          name="LikedUsersScreen"
          component={LikedUsersScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Likes",
          }}
        />
        <Stack.Screen
          name="CreatorTools"
          component={CreatorTools}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="QR Screen"
          component={QrScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,

            headerTitle: "",

            headerStyle: {
              backgroundColor: "#ECECEC",
            },
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ headerTintColor: "black", headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="AccountImformation"
          component={AccountImformation}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Account Information",
          }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={{
            headerTintColor: "black",
            headerTitle: "",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle:"Privacy and Settings"
          }}
        />
        <Stack.Screen
          name="Friends"
          component={Friends}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListOfMusic"
          component={ListOfMusic}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopTabNavigator"
          component={TopTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Likes"
          component={NoOfLikes}
          options={{
            headerTintColor: "black",

            headerBackTitleVisible: false,
            headerRight: () => (
              <Image
                source={Settting} // Provide the path to your image
                style={{ width: 25, height: 25, marginRight: 15 }} // Adjust the width, height, and margin as needed
              />
            ),
          }}
        />

        <Stack.Screen
          name="PrivacyScreen"
          component={PrivacyScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Privacy",
          }}
        />

        <Stack.Screen
          name="UserChat"
          component={UserChat}
          options={{
            headerShown : false
            // headerTintColor: "black",
            // headerBackTitleVisible: false,
            // headerTitle: "Privacy",
          }}
        />

        <Stack.Screen
          name="SecurityPermission"
          component={SecurityPermission}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ManageDevice"
          component={ManageDevice}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="TwoStepValidation"
          component={TwoStepValidation}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "",
          }}
        />

        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="InAppNotification"
          component={InAppNotification}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ActivityCenter"
          component={ActivityCenter}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CommentHistory"
          component={CommentHistory}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="RecentlyDeleted"
          component={RecentlyDeleted}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ContentPreference"
          component={ContentPreference}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Content Preference",
          }}
        />
        <Stack.Screen
          name="RestrictedMode"
          component={RestrictedMode}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ADS"
          component={ADS}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ScreenTime"
          component={ScreenTime}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="DailyScreenTime"
          component={DailyScreenTime}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="OfflineVideos"
          component={OfflineVideos}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="DataSaver"
          component={DataSaver}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="Cameera" component={Cam} />
        <Stack.Screen
          name="ReportAProblem"
          component={ReportAProblem}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerRight: () => (
              <Image
                source={clo0ckmahamn} // Provide the path to your image
                style={{ width: 25, height: 25, marginRight: 15 }} // Adjust the width, height, and margin as needed
              />
            ),
          }}
        />
        <Stack.Screen
          name="SupportScreen"
          component={SupportScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerShown:false
          }}
        />
        <Stack.Screen
          name="TermsAndPolicy"
          component={TermsAndPolicy}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Terms And Policy",
          }}
        />
        <Stack.Screen
          name="PreviewPost"
          component={PreviewPost}
          options={{
           headerShown:false
          }}
        />
        <Stack.Screen
          name="CommunityGuidelines"
          component={CommunityGuidelines}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Community Guidelines",
          }}
        />
        <Stack.Screen
          name="TermsOfServiceFetch"
          component={TermsOfServiceFetch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={TermsOfService}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Terms of service",
          }}
        />

        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Privacy Policy",
          }}
        />

        <Stack.Screen
          name="IntellectualPolicy"
          component={IntellectualPolicy}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Intellectual Policy",
          }}
        />

        <Stack.Screen
          name="Opensourcesoftware"
          component={Opensourcesoftware}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Open source",
          }}
        />

        <Stack.Screen
          name="Explore"
          component={Explore}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerRight: () => (
              <Image
                source={clo0ckmahamn} // Provide the path to your image
                style={{ width: 25, height: 25, marginRight: 15 }} // Adjust the width, height, and margin as needed
              />
            ),
          }}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Reset"
          component={ResetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
                <Stack.Screen
          name="Swipe"
          component={SwipeableUserList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerRight: ({ navigation }) => (
              <TouchableOpacity>
                <Image
                  source={usersquare}
                  style={{ width: 30, height: 30, marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            headerTitle: () => <Image style={styles.logo2} source={logonew} />,
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />

        <Stack.Screen
          name="UsersList"
          component={UsersList}
          options={{
            headerTintColor: "black",

            headerBackTitleVisible: false,
            // headerRight: () => (
            //   <Image
            //     source={Settting} // Provide the path to your image
            //     style={{ width: 25, height: 25, marginRight: 15 }} // Adjust the width, height, and margin as needed
            //   />
            // ),
            headerTitle: "Connect with friends",
          }}
        />

        <Stack.Screen
          name="userdata"
          component={userdata}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditDemo"
          component={EditDemo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllUsersPosts"
          component={AllUsersPosts}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AllPostScroll"
          component={AllPostScroll}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Terms of service",
          }}
        />

        <Stack.Screen
          name="AllUsersData"
          component={AllUsersData}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "AllUsersData",
          }}
        />
                <Stack.Screen
          name="FollowingList"
          component={FollowingList}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Following",
          }}
        />
        <Stack.Screen
          name="FollowersList"
          component={FollowersList}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "Followers",
          }}
        />
        <Stack.Screen
          name="ChangePasswordFromSettings"
          component={ChangePasswordFromSettings}
          options={{
           headerShown:false
          }}
        />

        <Stack.Screen
          name="DeleteOrDeactivateAcc"
          component={DeleteOrDeactivateAcc}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="DeactivateAccount"
          component={DeactivateAccount}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="OtherUserProfileScreen"
          component={OtherUserProfileScreen}
          options={{
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitle: " ",
            headerShown: false,
          }}
        />

        {/* <Stack.Screen name="Splash" component={Splash} /> */}

        {/* <Stack.Screen
          name="Parent"
          component={Parent}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="NewUi"
          component={NewUi}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  img1: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  backgroundimage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  catg4: {
    width: 30,
    height: 30,
  },
  catgmain: {
    marginRight: 10,
  },
  catgmain2: {
    marginLeft: 10,
  },
  logo2: {},
  footx: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "118%",
  },
});

export default AppNavigation;
