import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Linking,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";

import { check1, check2 } from "../../assets2/Icons/allIcons";
const countries = [
  { country: "Acres Green" },
  { country: "Aetna Estates" },
  { country: "Aguilar" },
  { country: "Air Force Academy" },
  { country: "Akron" },
  { country: "Alamosa" },
  { country: "Alamosa East" },
  { country: "Allenspark" },
];

const cities = [
  { city: "Chandigarh" },
  { city: "Delhi" },
  { city: "Patna" },
  { city: "Dehradoon" },
  { city: "Pune" },
  { city: "Mumbai" },
  { city: "Una" },
  { city: "Amritsar" },
  { city: "Jammu" },
  { city: "Mohali" },
];

const Profile = ({ navigation }) => {
  function openWebsite(websiteLink) {
    Linking.openURL(websiteLink);
  }

  const [selectedCountry, setselectedCountry] = useState("Selected Country");
  const [isClicked, setisClicked] = useState(false);
  const [data, setdata] = useState(countries);

  const [selectedCity, setselectedCity] = useState("Select City");
  const [data2, setdata2] = useState(cities);
  const [isClicked2, setisClicked2] = useState(false);

  const [checkbox, setcheckbox] = useState(true);

  const image = {
    uri: "https://img.freepik.com/free-photo/top-view-monochromatic-pattern-with-copy-space_23-2148770338.jpg?size=626&ext=jpg&ga=GA1.1.1427876047.1695385592&semt=ais",
  };
  const [mobileNumber, setMobileNumber] = useState('');

  const handleMobileNumberChange = (text) => {
    // Allow only numbers and restrict to 10 digits
    const cleanedText = text.replace(/[^0-9]/g, ''); // Removes non-numeric characters
    if (cleanedText.length <= 10) {
      setMobileNumber(cleanedText);
    }
  };


  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.contain}>
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.imagex}
          >
            <View style={styles.imagebx}></View>
          </ImageBackground>
        </View>

        <View style={styles.data2}>
          <Text style={styles.ResetTxt}>Sign Up</Text>

          <Text style={styles.inptxt}>Name :</Text>

          <View style={styles.inputbx}>
            <TextInput style={styles.input} placeholder="Enter Name" />
          </View>
        </View>

        <View style={styles.data2}>
          <Text style={styles.inptxt}>Mobile Number :</Text>

          <View style={styles.inputbx}>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.data2}>
          <Text style={styles.inptxt}>Email :</Text>

          <View style={styles.inputbx}>
            <TextInput style={styles.input} placeholder="Enter email" />
          </View>
        </View>

        <View style={styles.data3}>
          <Text style={styles.inptxt}>State :</Text>

          <TouchableOpacity
            style={styles.data4}
            onPress={() => {
              setisClicked(!isClicked);
            }}
          >
            <Text style={styles.slcttxt}>{selectedCountry}</Text>
          </TouchableOpacity>

          {isClicked ? (
            <View style={styles.dropDownArea}>
              <FlatList
                data={data}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.countryitem}
                      onPress={() => {
                        setselectedCountry(item.country);
                      }}
                    >
                      <Text style={styles.cntitm}> {item.country}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : null}

          {/* <TextInput 
        placeholder='Search' style={styles.searchinput}
        /> */}
        </View>

        <View style={styles.data3}>
          <Text style={styles.inptxt}>City :</Text>

          <TouchableOpacity
            style={styles.data4}
            onPress={() => {
              setisClicked2(!isClicked2);
            }}
          >
            <Text style={styles.slcttxt}>{selectedCity}</Text>
          </TouchableOpacity>

          {isClicked2 ? (
            <View style={styles.dropDownArea2}>
              <FlatList
                data={data2}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.countryitem}
                      onPress={() => {
                        setselectedCity(item.city);
                      }}
                    >
                      <Text style={styles.cntitm}> {item.city}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : null}
        </View>

        <View>
          <TouchableOpacity
            style={styles.checkbx}
            onPress={() => {
              setcheckbox(!checkbox);
            }}
          >
            {checkbox ? (
              <Image style={styles.icon} source={check1} />
            ) : (
              <Image style={styles.icon} source={check2} />
            )}

            <Text
              onPress={() =>
                openWebsite("http://eatout.us/terms-of-service.html")
              }
              style={styles.accpt}
            >
              Accept Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttbx}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.logtxt}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lsttxt}>
          <Text style={styles.txt01}>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.txt02}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 40,
  },
  linktxt: {
    marginLeft: -100,
  },
  imagebx: {
    alignItems: "center",
    marginTop: 20,
  },

  img1: {
    width: 160,
    height: 100,
  },
  input: {
    height: 55,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 7,
    borderColor: "#f2f2f2",
  },
  data: {
    width: "70%",
    marginTop: 50,
    marginLeft: 28,
  },

  data2: {
    width: "85%",
    marginTop: 20,
    marginLeft: 28,
  },
  inputbx: {
    alignItems: "center",
  },
  inptxt: {
    fontSize: 19,
    fontWeight: "500",
    marginTop: 20,
  },
  lintxt: {
    color: "orange",
    textDecorationLine: "underline",
    marginLeft: 28,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 10,
    width: "85%",
    height: 55,
    borderRadius: 7,
    justifyContent: "center",
  },
  buttbx: {
    alignItems: "center",
    flex: "1",
    marginTop: 70,
  },
  logtxt: {
    fontSize: 17,
    fontWeight: "500",
    color: "#cccccc",
  },
  lsttxt: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    flex: "1",
    justifyContent: "center",
    marginTop: 100,
  },
  txt02: {
    color: "#67D945",
    fontSize: 15,
  },
  txt01: {
    fontSize: 15,
    color: "#cccccc",
  },
  dropDown: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#8e8e8e",
    alignSelf: "center",
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },

  icon: {
    width: 20,
    height: 20,
  },
  dropDownArea: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    elevation: "78",
    alignSelf: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 28,
  },
  searchinput: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#8e8e8e",
    alignSelf: "center",
    marginTop: 20,
    paddingLeft: 15,
  },
  countryitem: {
    width: "80%",
    height: 55,
    // borderBottomColor:"black",
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
  },
  cntitm: {
    borderBottomColor: "black",
    fontWeight: "500",
    borderBottomColor: "black",
  },
  data3: {
    marginLeft: 28,
    marginTop: "5%",
  },
  data4: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
    marginLeft: 3,
    borderColor: "#f2f2f2",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 17,
    borderRadius: 9,
    justifyContent: "space-between",
  },
  slcttxt: {
    color: "#8c8c8c",
  },
  dropDownArea2: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    elevation: "78",
    alignSelf: "center",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 28,
  },
  upr: {
    marginTop: 20,
  },
  checkbx: {
    flexDirection: "row",
    marginTop: 17,
    marginLeft: 34,
    gap: 7,
  },
  accpt: {
    color: "#a6a6a6",
  },
  imagex: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },

  img1: {
    width: 160,
    height: 100,
    marginTop: 15,
  },
  contain: {
    width: "100%",
    borderBottomWidth: 7,
    borderColor: "#b3e5b3",
  },
  imagex: {
    height: 190,
  },
  ResetTxt: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "700",
  },
});

export default Profile;
