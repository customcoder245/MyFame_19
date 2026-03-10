import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../../redux/profileSlice";
import { setAllUsers } from "../../redux/action";
import { LoginManager } from "react-native-fbsdk-next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import DeactivateAccountAPI from "../../Fetch_API/DeactivateAccountAPI";
import Toast from "react-native-toast-message";
import fetchProfileData from "../../Fetch_API/fetchProfileData";

const DeactivateAccount = () => {
  const profileData = useSelector((state) => state.profile.profileData);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const HandleAccount = async () => {
    setIsLoading(true)
    try {
      const response = await DeactivateAccountAPI(
        JSON.stringify({ userid: profileData.id })
      );
      if (response.success) {

        dispatch(fetchProfileData(profileData.id))
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message
      })

      setTimeout(() => {
          navigation.goBack()
      }, 1500)
      }
      else{
        console.log("Error while deactivating acc",response)
        setIsLoading(false)
      }
    } catch (error) {
      console.log("Error While logging out");
      setIsLoading(false)
    }
   
  };
  return (
    <View style={styles.container}>
      <Text style={styles.username}>
        {profileData.username}: Deactivate this account?
      </Text>

      <Text style={styles.subtitle}>If you deactivate your account:</Text>

      <View style={styles.bulletPoints}>
        <Text style={styles.bullet}>
          {"\u2022"} No one will see your account and content.
        </Text>
        <Text style={styles.bullet}>
          {"\u2022"} Information that isn’t stored in your account, such as
          direct messages, may still be visible to others.
        </Text>
        <Text style={styles.bullet}>
          {"\u2022"} MyFame will continue to keep your data so that you can
          recover it when you reactivate your account.
        </Text>
        <Text style={styles.bullet}>
          {"\u2022"} You can reactivate your account and recover all content
          anytime by using the same login details.
        </Text>
      </View>

      <TouchableOpacity onPress={()=>{

Alert.alert("Deactivate account" , "Are you sure you want to Deactivate this account?" ,[

  {
    text:"Ok",
    onPress:HandleAccount
  },
  {

    text:"Cancel",
    onPress:()=>{
      console.log("cancelled")
    }
  }
])
}} style={styles.deactivateButton} >
       
      
        {
          isLoading ? <ActivityIndicator size='small' color={'white'} /> :
        <Text style={styles.deactivateButtonText}>{profileData.is_deactivate=="0"?"Deactivate":"Re-Activate"}</Text>
        }
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
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    fontSize: 16,
    color: "#000",
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
  deactivateButton: {
    backgroundColor: "#00E2FF",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  deactivateButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DeactivateAccount;
