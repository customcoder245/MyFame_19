import { StyleSheet, Text, View, Image, TouchableOpacity , ActivityIndicator} from "react-native";
import React, { useState } from "react";

import VerifyEmail from "./VerifyEmail";
import { Grou199, LeftArrowIcon } from "../../assets2/Icons/allIcons";
import { Ionicons } from "@expo/vector-icons";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";
import UpdateAccountInfo from "../../Fetch_API/UpdateAccountInfo";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { useNavigation } from "@react-navigation/native";

export default function AccountImformation(props) {
  const profileData = useSelector((state) => state.profile.profileData);

  console.log("profile Data : ",profileData)
  const [selected, setSelected] = React.useState(profileData.country_code);
  const [phone, setPhone] = React.useState(profileData.phone_number);
  const [isChangePhoneVisible, setIsChangePhoneVisible] = useState(false);
  const [country, setCountry] = useState(profileData.location);
  // const [country, setCountry] = useState("");
  const [showCountry, setShowCountry] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false); // Add this line

  // console.log("profileData.location : ",country,profileData)

  const UpdateAccount = async () => {
    // console.log(profileData.phone_number == phone?profileData.phone_number : "dfa", country);
    setLoading(true); // Set loading to true when the update begins

    try {
      const response = await UpdateAccountInfo(JSON.stringify({
        userid: profileData.id.toString(),
        phone_number: phone,
        location: country,
        country_code : selected
      }));
      if (response.status === 200) {
        dispatch(fetchProfileData(response.data.id));
        // navigation.goBack()
      } else {
        // console.log(response);
      }
    } catch (error) {
      console.log("ERROR while updating user account info : ", error);
    }finally {
      setLoading(false); // Stop loading after completion
    }
  };

  const onSelect = (country) => {
    setShowCountry(false);
    setCountry(country.name);
  };

  return (
    <View style={styles.container}>
          {loading ? ( // Show loader while loading is true
         <View style={styles.loaderContainer}>
         <ActivityIndicator size="large" color="#00A4FF" />
       </View>
    ) : (
      <>
      <View style={{ rowGap: 15 }}>
        <TouchableOpacity
          onPress={() => setIsChangePhoneVisible(!isChangePhoneVisible)}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "13%",
          }}
        >
          <Text style={styles.txt11}>Phone number</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "200" }}>
              {profileData.country_code+profileData.phone_number}
            </Text>
            <Ionicons
              name={showCountry ? "chevron-down" : "chevron-forward"}
              size={24}
              color={"grey"}
            />
          </View>
        </TouchableOpacity>
        {isChangePhoneVisible && (
          <CountryCodeDropdownPicker
            selected={selected}
            setSelected={setSelected}
            // setCountryDetails={setCountry}
            phone={phone}
            setPhone={setPhone}
            countryCodeTextStyles={{ fontSize: 13 }}
          />
        )}
      </View>

      {/* <TouchableOpacity
        onPress={() => props.navigation.navigate("VerifyEmail")}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "13%",
          }}
        >
          <View style={{ display: "flex", flexDirection: "collumn" }}>
            <Text style={styles.txt11}>Email</Text>
            <Text style={{ fontSize: 13, fontWeight: "200", paddingTop: 10 }}>
              Your email account is not verified.
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Image source={Grou199} />
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </View>
      </TouchableOpacity> */}
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          onPress={() => setShowCountry(!showCountry)}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "13%",
          }}
        >
          <View
            style={{ display: "flex", flexDirection: "collumn", width: "50%" }}
          >
            <Text style={styles.txt11}>Account region</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "200" }}>
              {country}
            </Text>
            <Ionicons
              name={showCountry ? "chevron-down" : "chevron-forward"}
              size={24}
              color={"grey"}
            />
          </View>
        </TouchableOpacity>
        {showCountry && (
          <CountryPicker
            {...{
              withCountryNameButton: true,
              withFilter: true,  // Add this line to enable search functionality
              onSelect,

              
            }}
            visible={true}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={UpdateAccount}
        style={{
          backgroundColor: "#00A4FF",
          marginTop: "auto",
          paddingVertical: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color: "white", fontWeight: "700" }}>
          Update Account
        </Text>
      </TouchableOpacity>
      </>
    )}
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
    height: 17,
    width: 17,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
});
