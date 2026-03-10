import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";

const ProfileScreen = () => {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);

  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchProfileData(userId));
  }, [userId, dispatch]);

  return (
    <View style={styles.container}>
      <Text>User Data Screen</Text>
      <View>
        <Text>Name: {profileData ? profileData.username : "Loading..."}</Text>
        <Text>Email: {profileData ? profileData.email : "Loading..."}</Text>
        {/* Display other user data as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
