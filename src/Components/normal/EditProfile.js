import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import UpdateProfile from "../../Fetch_API/UpdateProfile";
import { updateText, setInstagramLink } from "../../redux/action";
import { blank } from "../../assets2/Icons/allIcons";

export default function EditProfile({ navigation }) {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.profile.profileData);
  const about = useSelector((state) => state.text.text);
  const instagramLinkFromRedux = useSelector(
    (state) => state.instagramLink.instagramLink
  );

  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedAbout, setEditedAbout] = useState(profileData?.about || about || "");
  const [instagramLink, setInstagramLinkLocal] = useState(
    instagramLinkFromRedux || ""
  );
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);

  // Fetch API profile data
  useEffect(() => {
    if (profileData?.id || userId) {
      dispatch(fetchProfileData(profileData?.id || userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (profileData) {
      setEditedAbout(profileData.about || "");
      setInstagramLinkLocal(profileData.instagram || "");
    }
  }, [profileData]);

  // Fetch WP user data
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
          console.error("Error fetching user data:", responseData);
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
      } finally {
        setScreenLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setScreenLoading(false);
    }
  }, [userId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access media library is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access camera is required.");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      dispatch(updateText(editedAbout));
      dispatch(setInstagramLink(instagramLink));

      await UpdateProfile(editedAbout, instagramLink, selectedImage);

      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  // Display user image prioritized: local selected -> remote data -> blank fallback
  const profileImageSource = selectedImage
    ? { uri: selectedImage }
    : userData?.profile_img || profileData?.profile_img
    ? { uri: userData?.profile_img || profileData?.profile_img }
    : blank;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Upload Options Header */}
          <View style={styles.photoPickerContainer}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={profileImageSource}
                  style={styles.profileAvatar}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.pickerButtonsRow}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={20}
                    color="#0284C7"
                  />
                  <Text style={styles.pickerBtnText}>Choose Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={takePicture}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={20}
                    color="#0284C7"
                  />
                  <Text style={styles.pickerBtnText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* User Fields Form */}
          <View style={styles.formContainer}>
            {/* Read-Only Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText}>
                  @{profileData?.username || "username"}
                </Text>
              </View>
            </View>

            {/* Editable Bio */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.charCount}>
                  {editedAbout.length}/150
                </Text>
              </View>
              <TextInput
                style={[styles.inputBox, styles.bioInput]}
                value={editedAbout}
                onChangeText={setEditedAbout}
                placeholder="Write something about yourself..."
                placeholderTextColor="#94A3B8"
                multiline
                maxLength={150}
                textAlignVertical="top"
              />
            </View>

            {/* Editable Instagram Link */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram Link</Text>
              <TextInput
                style={styles.inputBox}
                value={instagramLink}
                onChangeText={(text) => {
                  setInstagramLinkLocal(text);
                  dispatch(setInstagramLink(text));
                }}
                placeholder="https://instagram.com/yourhandle"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Action Save CTA */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  /* Image Picker */
  photoPickerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: "center",
    width: "100%",
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#E0F2FE",
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F1F5F9",
  },
  profileAvatar: {
    width: "100%",
    height: "100%",
  },
  pickerButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  pickerBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0284C7",
    marginLeft: 6,
  },

  /* Form Fields */
  formContainer: {
    gap: 18,
    marginBottom: 28,
  },
  inputGroup: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  charCount: {
    fontSize: 12,
    color: "#94A3B8",
  },
  readOnlyBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0F172A",
  },
  bioInput: {
    height: 90,
    paddingTop: 10,
  },

  /* Save CTA */
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0284C7",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});