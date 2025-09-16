import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../../redux/profileSlice";
import { setAllUsers, setUser } from "../../redux/action";
import { LoginManager } from "react-native-fbsdk-next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import DeleteAccountAPI from "../../Fetch_API/DeleteAccountAPI";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteAccount = () => {
  const profileData = useSelector((state) => state.profile.profileData);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const HandleDeleteAccount = async () => {
    setLoading(true); // Start loading

    try {
      const response = await DeleteAccountAPI(
        JSON.stringify({ userid: profileData.id })
      );
      if (response.success) {
        const result = await AsyncStorage.getItem("users");
        const allLoggedInUsers = JSON.parse(result);
      
          if (allLoggedInUsers.length > 1) {
            const filteredArray = allLoggedInUsers.filter(
              (id) => id != profileData.id
            );
            await AsyncStorage.setItem("users", JSON.stringify(filteredArray));
            await UserData(filteredArray[0]);
            await AsyncStorage.setItem("userId", String(filteredArray[0])); // Store user id in AsyncStorage
            dispatch(fetchProfileData(filteredArray[0]));
            login("res.user.emai", filteredArray[0]);
            dispatch(setUser(filteredArray[0]));
            await GoogleSignin.signOut();
            // LoginManager.logOut();
            navigation.goBack();
            console.log("Logut if : ");
          } else {
            // setIsLoggedOut(true)
            console.log("Logut else : ");
            // dispatch(setGlobalAllUsers([]))
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem("users");
           
            logout();
            navigation.navigate("BottomNavigator");
    
            LoginManager.logOut();
          }
        } 
    
    } catch (error) {
      console.log("Error While logging out", error);
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Delete this account?</Text>

      {loading && <ActivityIndicator size="large" color="#00E2FF" style={styles.loader} />}

      <Text style={styles.subtitle}>If you delete your account:</Text>

      <View style={styles.bulletPoints}>
        <Text style={styles.bullet}>
          {"\u2022"} Your account and content will be permanently deleted.
        </Text>
        <Text style={styles.bullet}>
          {"\u2022"} Information that isn’t stored in your account, such as direct messages, may still be visible to others.
        </Text>
        <Text style={styles.bullet}>
          {"\u2022"} You won’t be able to recover your account after deletion.
        </Text>
      </View>

      <TouchableOpacity onPress={()=>{

        Alert.alert("Delete account" , "Are you sure you want to delete this account?" ,[

          {
            text:"Ok",
            onPress:HandleDeleteAccount
          },
          {

            text:"Cancel",
            onPress:()=>{
              console.log("cancelled")
            }
          }
        ])
      }} style={styles.deleteButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  bulletPoints: {
    marginBottom: 40,
  },
  bullet: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#00E2FF",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeleteAccount;
