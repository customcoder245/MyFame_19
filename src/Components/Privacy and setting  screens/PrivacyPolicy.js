import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Account from "./Account";
import {
  AccebilityIcon,
  AccountIcon61,
  BellIcon,
  BookIcon,
  CameIcon,
  CameraIcon4,
  activity,
  clock1,
  clock91,
  exit1,
  home1,
  useraccount1,
} from "../../assets2/Icons/allIcons";
import { blank, User } from "../../assets2/Images/allImages";
import { UmbrellaIcon } from "../../assets2/Icons/allIcons";
import { share2 } from "../../assets2/Icons/allIcons";
import { PenStrokeIco2 } from "../../assets2/Icons/allIcons";
import { MessageokeIcon2 } from "../../assets2/Icons/allIcons";
import { mark } from "../../assets2/Icons/allIcons";
import { LockIcon5 } from "../../assets2/Icons/allIcons";
import { LeftArrowIcon } from "../../assets2/Icons/allIcons";
import { wallen } from "../../assets2/Icons/allIcons";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager } from "react-native-fbsdk-next";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../../redux/profileSlice";
import { setAllUsers, setUser } from "../../redux/action";
import Icon from "react-native-vector-icons/Feather"; // Import Feather icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../Fetch_API/BaseURL";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import UserData from "../../Fetch_API/UsersData";
import { setAllUsers as setGlobalAllUsers } from "../../redux/action";


export default function PrivacyPolicy(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { logout, login, } = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    (async () => {
      const result = await AsyncStorage.getItem("users");
      const allLoggedInUsers = JSON.parse(result);

      if(allLoggedInUsers!= null ){

      
      allLoggedInUsers.map(async (item) => {
        const response = await fetch(
          `${BASE_URL}/getuserdata/v1/getUserData/`,

          // "https://myfame.com/wp-json/getuserdata/v1/getUserData/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: item,
            }),
          }
        );
        const res = await response.json();
        if (response.ok) {
          setAllUsers((pre) => [...pre, res.data]);
        } else {
          console.log(error);
        }
      })};
    })();
  }, []);

  const handleLogoutAndNavigateBack = async () => {
    const result = await AsyncStorage.getItem("users");
    const allLoggedInUsers = JSON.parse(result);
    try {
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
        LoginManager.logOut();
        navigation.goBack();
        console.log("Logut if : ");
      } else {
        setIsLoggedOut(true)
        console.log("Logut else : ");
        // dispatch(setGlobalAllUsers([]))
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem("users");
       
        logout();
        navigation.goBack();

        LoginManager.logOut();
      }
    } catch (error) {
      console.log("Error While logging out", error);
    }



    
  };

  const SwitchAccount = async (item) => {
    try {
      await UserData(item.id);
      await AsyncStorage.setItem("userId", String(item.id)); // Store user id in AsyncStorage
      dispatch(fetchProfileData(item.id));
      login("res.user.emai", item.id);
      dispatch(setUser(item.id));
      setModalVisible(false)
      props.navigation.navigate("BottomNavigator")
    } catch (error) {
      console.log("Error While switching account is : ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>ACCOUNT</Text>

        <TouchableOpacity
          onPress={() => props.navigation.navigate("Account")}
          // onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <MaterialCommunityIcons
                name="account-outline"
                size={26}
                color="#86878B"
              />
              <Text style={styles.txt11}>Manage my account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("SecurityPermission");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="lock" size={24} color="#86878B" />
              <Text style={styles.txt11}>Security & permission</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("ContentPreference");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
                gap:20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="video" size={24} color="#86878B" />
              <Text style={styles.txt11}>Content preferences</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
         <Icon name="credit-card" size={24} color="#86878B" />
            <Text style={styles.txt11}>Balance</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View> */}

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("PrivacyScreen");
          }}
          // onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="file" size={24} color="#86878B" />
              <Text style={styles.txt11}>Privacy </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("ActivityCenter");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
                <Icon name="clock" size={24} color="#86878B" />
              <Text style={styles.txt11}>Activity center</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}
        {/* <View style={styles.divider} />
        <Text style={styles.texthead}>GENERAL</Text>

        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("Notification");
          // }}

          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="bell" size={24} color="#86878B" />
              <Text style={styles.txt11}>Push notifications</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("Language");
          // }}

          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="globe" size={24} color="#86878B" />
              <Text style={styles.txt11}>Language</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

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
            <Icon name="umbrella" size={24} color="#86878B" />
            <Text style={styles.txt11}>Digital Wellbeing</Text>
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
            <Icon name="eye" size={24} color="#86878B" />
            <Text style={styles.txt11}>Accessibility</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("ScreenTime");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="clock" size={24} color="#86878B" />
              <Text style={styles.txt11}>Screen time</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

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
            <Icon name="home" size={24} color="#86878B" />
            <Text style={styles.txt11}>Family pairing</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("ADS");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="box" size={24} color="#86878B" />
              <Text style={styles.txt11}>ADS</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}
        {/* <View style={styles.divider} />

        <Text style={styles.texthead}>Cache & cellular</Text>

        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("OfflineVideos");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
             <Icon name="cloud-off" size={24} color="#86878B" />
              <Text style={styles.txt11}>Offline videos</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
          <Icon name="database" size={24} color="#86878B" />
            <Text style={styles.txt11}>Free up space</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("DataSaver");
          // }}
          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="download" size={24} color="#86878B" />
              <Text style={styles.txt11}>Data saver</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}
        <View style={styles.divider} />

        <Text style={styles.texthead}>SUPPORT</Text>

        {/* <TouchableOpacity
          // onPress={() => {
          //   props.navigation.navigate("ReportAProblem");
          // }}

          onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
           <Icon name="file-text" size={24} color="#86878B" />
              <Text style={styles.txt11}>Report a problem</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SupportScreen");
          }}
          // onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={26}
                color="#86878B"
              />
              <Text style={styles.txt11}>Support</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("TermsAndPolicy");
          }}
        >
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
              <MaterialCommunityIcons
                name="file-outline"
                size={26}
                color="#86878B"
              />

              <Text style={styles.txt11}>Terms and policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.texthead}>LOG IN</Text>

        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}
          // onPress={() => props.navigation.navigate("ComingSoonScreen")}
        >
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
              <Icon name="user-check" size={24} color="#86878B" />
              <Text style={styles.txt11}>Switch account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.openButton}
          // onPress={() => setModalVisible2(true)}
          onPress={handleLogoutAndNavigateBack}
        >
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
              <MaterialCommunityIcons name="logout" size={26} color="#86878B" />
              <Text style={styles.txt11}>Log out</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>
      </ScrollView>

    <Modal
  animationType="fade"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Instagram-like semi-transparent background
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 15,
        elevation: 10,
      }}
    >
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#f5f5f5",
          borderRadius: 20,
          // padding: 10,
        }}
        onPress={() => setModalVisible(false)}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>X</Text>
      </TouchableOpacity>

      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
          Switch account
        </Text>
      </View>

      {!isLoggedOut && allUsers.map((item) => (
        <TouchableOpacity
        onPress={() => SwitchAccount(item)}
          key={item.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
            paddingBottom: 10,
            gap:10
          }}
        >
 
            <Image
              source={item.profile_img !== "" ? { uri: item.profile_img } : blank}
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5, // Make the image circular
                borderWidth: 2,
                borderColor: "#eee",
              }}
            />
   

          <Text style={{ fontSize: 18, color: "#333", fontWeight: "500" }}>
            {item.username}
          </Text>

          {item.id == profileData.id && <View style={{height:10,width:10,borderRadius:10,backgroundColor:'green'}}/>}

          {/* <Image source={mark} style={{ width: 25, height: 25 }} /> */}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => 
        {  
          setModalVisible(false);
          props.navigation.navigate("LogIn")}}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: "#fafafa",
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Text style={{ fontSize: 30, color: "#000", marginRight: 10 }}>+</Text>

        <Text style={{ fontWeight: "700", fontSize: 20, color: "#000" }}>
          Add account
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/*
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent2}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                position: "absolute",
                bottom: 10,
                gap: 30,
              }}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible2(false);
                }}
              >
                <Text style={styles.buttonText2}>Not now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible2(false);
                  setModalVisible3(true);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", gap: 12 }}>
              <TouchableOpacity>
                <Image source={User} style={{ width: 65, height: 65 }} />
              </TouchableOpacity>

              <Text style={styles.modalText2}>Save login info?</Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: "15",
                  fontWeight: "300",
                }}
              >
                you wont need to enter the log in info the next you use this app
                on this device.{" "}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => setModalVisible3(false)}
      >
        <View style={styles.modalContainer3}>
          <View style={styles.modalContent3}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                position: "absolute",
                bottom: 10,
                gap: 30,
              }}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible3(false);
                }}
              >
                <Text style={styles.buttonText2}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible3(false);
                  setModalVisible4(true);
                }}
              >
                <Text style={styles.buttonText}>Log out</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", gap: 12 }}>
              <TouchableOpacity>
                <Image source={User} style={{ width: 65, height: 65 }} />
              </TouchableOpacity>

              <Text style={styles.modalText2}>Log out?</Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: "17",
                  fontWeight: "regular",
                }}
              >
                @alihandro5643
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => setModalVisible4(false)}
      >
        <View style={styles.modalContainer5}>
          <View style={styles.modalContent5}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible4(false);
              }}
            >
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>

            <View style={styles.srctxt_md2}>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                Select account
              </Text>
            </View>

            <View style={[styles.container2]}>
              <View style={styles.container3}>
                <TouchableOpacity>
                  <Image source={User} style={{ width: 65, height: 65 }} />
                </TouchableOpacity>

                <Text style={styles.modalText}>alihandro5643</Text>
              </View>
              <Image source={mark} />
            </View>

            <View style={[styles.container5]}>
              <TouchableOpacity>
                <Text style={{ fontSize: 50, fontWeight: "500" }}>+</Text>
              </TouchableOpacity>

              <Text style={{ fontWeight: "500", fontSize: 20 }}>
                add account
              </Text>
            </View>

            <Text
              style={{
                fontWeight: "700",
                fontSize: 20,
                position: "absolute",
                left: "15%",
                top: "45%",
              }}
            >
              Can't log in?
            </Text>

            <View style={styles.dntfrmn_txts}>
              <Text style={styles.didntantxt}>Didn’t have any account? </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("SignUp")}
              >
                <Text style={styles.siguytxt}>Sign Up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer5: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "40%",
    width: "80%",
    backgroundColor: "#F6F6F6",
  },
  modalContainer2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent3: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "30%",
    width: "80%",
    backgroundColor: "#F6F6F6",
  },
  modalContainer3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    // top: "35%",
    height: "100%",
  },
  modalContent5: {
    backgroundColor: "#F6F1F1",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: "10%",
    height: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#302E2E",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText2: {
    fontSize: 18,
    fontWeight: "500",
    color: "#9D9D9D",
  },
  modalText: {
    fontWeight: "semibold",
    fontSize: 20,
  },
  container2: {
    display: "flex",
    flexDirection: "row",
    gap: 90,
    alignItems: "center",
    marginTop: "8%",
  },
  container3: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  container5: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: "23%",
    gap: 35,
  },
  modalText2: {
    fontSize: 20,
    fontWeight: "bold",
  },

  dntfrmn_txts: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: "15%",
  },
  didntantxt: {
    color: "black",
    fontWeight: "100",
  },
  siguytxt: {
    color: "#00E6FF",
  },
  divider: {
    height: 0.56,
    backgroundColor: "#D0D1D3",
    marginTop: 20,
    marginBottom: 5,
  },
});
