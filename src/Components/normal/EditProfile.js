import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import UpdateProfile from "../../Fetch_API/UpdateProfile";
import { updateText, setInstagramLink } from "../../redux/action";
import { gallery, camera, blank } from "../../assets2/Icons/allIcons";
import { save } from "../../assets2/Images/allImages";

export default function EditProfile(props) {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  const about = useSelector((state) => state.text.text);
  const instagramLinkFromRedux = useSelector(
    (state) => state.instagramLink.instagramLink
  );

  const [userData, setUserData] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [username, setUsername] = useState(profileData?.username || "");
  const [bio, setBio] = useState(profileData?.about || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedAbout, setEditedAbout] = useState(profileData?.about || about);
  const [instagramLink, setInstagramLinkLocal] = useState(instagramLinkFromRedux);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true); // Initially set to true

  const handleSave = async () => {
    setLoading(true);
    try {
      dispatch(updateText(editedAbout));
      dispatch(setInstagramLink(instagramLink));

      await UpdateProfile(editedAbout, instagramLink, selectedImage);

      // Alert.alert("Success", "Profile updated successfully!");
      props.navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProfileData(profileData.id));
  }, [userId, dispatch]);

  useEffect(() => {
    if (profileData) {
      setEditedAbout(profileData.about || "");
      setInstagramLinkLocal(profileData.instagram || "");
    }
  }, [profileData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://myfame.com/index.php/wp-json/getuserdata/v1/getUserData/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid: userId }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          setUserData(responseData.data);
        } else {
          console.error("Error:", responseData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setScreenLoading(false); // Hide loader once data is fetched
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access camera required");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const handleInstagramLinkChange = (link) => {
    setInstagramLinkLocal(link);
    dispatch(setInstagramLink(link));
  };

  if (screenLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00E2FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: keyboardVisible ? "90%" : 0 }]}
      behavior="padding"
    >
      <ScrollView>
        <View style={styles.chng_pht31}>
          <TouchableOpacity onPress={() => pickImage()}>
            <ImageBackground
              source={userData.profile_img ? { uri: userData.profile_img } : blank}
              style={styles.Propic}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.overlay} />
              <Image source={gallery} style={{ width: 40, height: 40 }} />
            </ImageBackground>
            <Text style={{ marginTop: "25%" }}>Choose image</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => takePicture()} style={styles.takepicture}>
            <View
              style={{
                borderColor: "black",
                borderWidth: 0.7,
                width: "70%",
                height: 83,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
              }}
            >
              <Image source={camera} style={{ width: 37, height: 40 }} />
            </View>
            <Text style={styles.grp_14567_txt}>Take a picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.NM_txter_mn_maha}>
          <View style={styles.NM_txter_mn_2}>
            <View style={styles.NM_txter_mn_sub_2}>
              <Text style={styles.NM_txter}>Name</Text>
              <Text style={styles.NM_txterwsp}>
                {profileData ? profileData.username : "Loading..."}
              </Text>
            </View>
          </View>

          <View style={styles.NM_txter_mn_2}>
            <View style={styles.NM_txter_mn_sub_2}>
              <Text style={styles.NM_txter}>UserName</Text>
              <Text style={styles.NM_txterw2}>
                {profileData ? profileData.username : "Loading..."}
              </Text>
            </View>
          </View>

          <View style={styles.NM_txter_mn_4}>
            <View style={styles.NM_txter_mn_sub_4}>
              <Text style={styles.NM_txter}>Bio</Text>

              <View style={{ marginTop: "5%" }}>
                <TextInput
                  style={[styles.NM_txterw3, styles.textInputBox]}
                  value={editedAbout}
                  onChangeText={setEditedAbout}
                  placeholder={profileData?.about || "Enter your bio"}
                  multiline
                  maxLength={30}
                />
              </View>
            </View>
          </View>

          {/* <View style={styles.NM_txter_mn_2}>
            <View style={styles.NM_txter_mn_sub_2}>
              <Text style={styles.NM_txter}>Instagram</Text>
              <TextInput
                style={[styles.NM_txterw2, styles.textInputBox2]}
                value={instagramLink}
                onChangeText={handleInstagramLinkChange}
                placeholder={profileData?.instagram || "Enter Instagram link"}
                maxLength={40}
              />
            </View>
          </View> */}
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00E2FF" />
          </View>
        )}
          <View
            style={{
              marginTop: "10%",
              marginBottom: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{

                justifyContent: "center",
                alignItems: "center",
                marginTop: "7%",
              }}
              onPress={handleSave}
            >
<Image source={save}/>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    height: "90%",
  },
  chng_pht31: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    paddingTop: "5%",
    
  },
  grp_14567_txt: {
    marginTop: "20%",
  },
  NM_txter: {
    color: "#161722",
    fontSize: 17,
  },
  NM_txterw2: {
    color: "#86878B",
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1,
    padding: "5%",
    width: "100%",
    borderRadius: 6,
  },
  NM_txterwsp: {
    color: "#86878B",
    fontSize: 18,
    borderColor: "gray",
    borderWidth: 1,
    padding: "5%",
    width: "100%",
    marginLeft: "21%",
    borderRadius: 6,
  },
  NM_txterw3: {
    color: "#86878B",
    fontSize: 16,
  },
  image_uyt: {
    width: 10,
    height: 10,
  },
  NM_txter_mn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    marginTop: "8%",
  },
  NM_txter_mn_sub: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  NM_txter_mn_2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "6%",
    marginTop: "8%",
  },
  NM_txter_mn_sub_2: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
    gap: 84,
    alignItems:"center"
  },
  NM_txter_mn_3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: "8%",
    marginLeft: "34%",
  },
  image_uyt_2: {
    height: 20,
    width: 20,
  },
  NM_txter_mn_4: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "6%",
    marginTop: "8%",
  },
  NM_txter_mn_sub_4: {
    justifyContent: "space-between",
    width: "100%",
  },
  NM_txter_mn_maha: {
    marginTop: "10%",
  },
  Propic: {
    width: 87,
    height: 85,
    resizeMode: "contain",
    borderRadius: 90,
    borderRadius: 90, // Example border radius
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  takepicture: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: 125,
    backgroundColor: "white",
    borderRadius: 60,
    borderColor: "black",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 90, // Example border radius, same as imageBackground
    overflow: "hidden",
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  textInputBox: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5, // Optional: gives rounded corners
    textDecorationLine: "none",
    height: 100,
    textAlignVertical: "top", // Ensures text starts at the top
    padding: 5, // Removes any default padding
  },
  cat_name: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5, // Optional: gives rounded corners
    textDecorationLine: "none",
    height: 50,
    textAlignVertical: "top", // Ensures text starts at the top
    padding: 5, // Removes any default padding
  },
  InstagramTextInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5, // Optional: gives rounded corners
    textDecorationLine: "none",
    height: 100,
    textAlignVertical: "top", // Ensures text starts at the top
    padding: 5, // Removes any default padding
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"white"
  },
});
