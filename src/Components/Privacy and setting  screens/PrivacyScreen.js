import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { useState } from "react";
import {
  LeftArrowIcon,
  mess,
  mess2,
  mess3,
  toggle,
} from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";

import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
import PrivateAccount from "../../Fetch_API/PrivateAccount";
import { useDispatch, useSelector } from "react-redux";
import { setApiResponse } from "../../redux/action";
import { BASE_URL } from "../../Fetch_API/BaseURL";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import { Switch } from "react-native-paper";
export default function PrivacyScreen() {
  const toggleSource = toggle;
  const onSource = on;
  const { userId } = useContext(AuthContext);
  const {
    imageSource1,
    imageSource2,
    imageSource3,
    switchImage1,
    switchImage2,
    switchImage3,
  } = ChangeToggleImage(toggleSource, onSource);
  const profileData = useSelector((state) => state.profile.profileData);
  const [isSwitchOn, setIsSwitchOn] = React.useState(profileData.account_type == "1" ? false : true );

  const dispatch = useDispatch();

  const apiResponse = useSelector((state) => state.api.responseData);


  const handleSwitchAccount = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/updateAccountType/v1/updateAccountType/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: profileData.id, // Use profileData.id directly
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData, "Successfully switched account");
        Alert.alert('Success', 'Account type switched successfully!');
        dispatch(setApiResponse(responseData)); // Dispatching the full response data
      } else {
        console.error("Failed to switch account", responseData);
        Alert.alert('Error', responseData.message || "Failed to fetch users data");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      Alert.alert('Error', "An error occurred. Please try again later.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
        
      }
    }, [userId])
  );
  

  const onToggleSwitch = async() => {
    setIsSwitchOn(!isSwitchOn);
    try {
      const response = await fetch(
        `${BASE_URL}/updateAccountType/v1/updateAccountType/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: profileData.id, // Use profileData.id directly
          }),
        }
      );

      const responseData = await response.json();
     
      dispatch(fetchProfileData(profileData.id))

      
    } catch (error) {
      console.log("ERROR is : ",error)
    }
   

  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>DISCOVERREBILITY</Text>

        {/* <TouchableOpacity onPress={switchImage1}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                // flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Private Account</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                With private account only users you approve can follow you and
                watch your videos. Your existing followers can be effected.
              </Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity> */}


{/* 
<TouchableOpacity
  onPress={() => {
    handleSwitchAccount();
  }}
> */}
  <View
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: "13%",
    }}
  >
    <View
      style={{
        display: "flex",
        maxWidth: "90%",
      }}
    >
      <Text style={styles.txt11}>Private Account</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "200",
          paddingTop: 10,
          maxWidth: "95%",
        }}
      >
        With private account only users you approve can follow you and watch
        your videos. Your existing followers can be affected.
      </Text>
    </View>
 {/* <Image
      source={
        profileData.account_type === 1
          ? toggleSource 
          : onSource 
      }
      style={styles.imgpar13}
    /> */}
    <Switch value={isSwitchOn} color="green" onValueChange={onToggleSwitch} />
  </View>
{/* </TouchableOpacity> */}



<View>


  <Text>All Advertisers</Text>
</View>

        {/* <TouchableOpacity onPress={switchImage2}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                // flexDirection: "column",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Activity status</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                When this is turned on you and your followers will see each
                others activitystatus onlly when both of you turned this on.
              </Text>
            </View>
            <Image
              source={imageSource2 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={switchImage3}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                // flexDirection: "column",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Post in nearby feed.</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Your post will be shown in the nearby feed based on the
                l;ocation where you uploadeed them.{" "}
              </Text>
            </View>
            <Image
              source={imageSource3 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity> */}

        {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Suggest your account to others</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>
              Sync contacts and Facebook friends.
            </Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View style={{ display: "flex", 
              // flexDirection: "collumn" 
              }}>
              <Text style={styles.txt11}>Location Services</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Your post will be shown in the nearby feed based on the
                l;ocation where you uploadeed them.{" "}
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>INTERACTIONS</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image source={mess3} style={styles.imgpar11} />
            <Text style={styles.txt11}>Push notifications</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image source={mess2} style={styles.imgpar11} />
            <Text style={styles.txt11}>Push notifications</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image source={mess} style={styles.imgpar11} />
            <Text style={styles.txt11}>Digital Wellbeing</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  texthead: {
    fontSize: 12,
    fontWeight: "300",
    color: "#86878B",
    marginTop: "8%",
  },
  imgpar11: {
    height: 20,
    width: 18,
  },
  txt11: {
    fontSize: 17,
    color: "#161722",
    fontWeight: "500",
  },
  imgpar12: {
    height: 12,
    width: 12,
  },
  imgpar13: {
    height: 35,
    width: 45,
  },
});
