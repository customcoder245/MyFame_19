import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager } from "react-native-fbsdk-next";

// Context & API
import { AuthContext } from "../../Context/AuthContext";
import { BASE_URL } from "../../Fetch_API/BaseURL";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import UserData from "../../Fetch_API/UsersData";
import { setProfileData } from "../../redux/profileSlice";
import { setUser } from "../../redux/action";
import { blank } from "../../assets2/Images/allImages";

export default function PrivacyPolicy(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { logout, login } = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);

  // Fetch logged-in users safely using Promise.all to avoid state update race conditions
  useEffect(() => {
    let isMounted = true;

    const fetchLoggedInUsers = async () => {
      try {
        setLoadingUsers(true);
        const rawUsers = await AsyncStorage.getItem("users");
        const userIds = JSON.parse(rawUsers) || [];

        if (userIds.length === 0) return;

        const requests = userIds.map((userId) =>
          fetch(`${BASE_URL}/getuserdata/v1/getUserData/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid: userId }),
          }).then((res) => (res.ok ? res.json() : null))
        );

        const responses = await Promise.all(requests);
        const validUsers = responses
          .filter((res) => res && res.data)
          .map((res) => res.data);

        if (isMounted) {
          setAllUsers(validUsers);
        }
      } catch (error) {
        console.error("Error fetching logged-in users:", error);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    };

    fetchLoggedInUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogoutAndNavigateBack = async () => {
    try {
      const rawUsers = await AsyncStorage.getItem("users");
      const userIds = JSON.parse(rawUsers) || [];

      if (userIds.length > 1) {
        const filteredArray = userIds.filter((id) => id !== profileData?.id);
        const nextUserId = filteredArray[0];

        await AsyncStorage.setItem("users", JSON.stringify(filteredArray));
        await AsyncStorage.setItem("userId", String(nextUserId));
        await UserData(nextUserId);

        dispatch(fetchProfileData(nextUserId));
        dispatch(setUser(nextUserId));
        login("res.user.email", nextUserId);

        await GoogleSignin.signOut();
        LoginManager.logOut();
        navigation.goBack();
      } else {
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem("users");
        await AsyncStorage.removeItem("userId");

        LoginManager.logOut();
        logout();
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  const switchAccount = async (item) => {
    try {
      await UserData(item.id);
      await AsyncStorage.setItem("userId", String(item.id));
      dispatch(fetchProfileData(item.id));
      dispatch(setUser(item.id));
      login("res.user.email", item.id);

      setModalVisible(false);
      navigation.navigate("BottomNavigator");
    } catch (error) {
      console.error("Error while switching account:", error);
    }
  };

  // Reusable row item for setting list options
  const SettingItem = ({ iconType = "feather", iconName, title, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemRow}>
      <View style={styles.itemLeft}>
        {iconType === "feather" ? (
          <Icon name={iconName} size={24} color="#86878B" />
        ) : (
          <MaterialCommunityIcons name={iconName} size={26} color="#86878B" />
        )}
        <Text style={styles.itemText}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.textHead}>ACCOUNT</Text>

        <SettingItem
          iconType="mci"
          iconName="account-outline"
          title="Manage my account"
          onPress={() => navigation.navigate("Account")}
        />

        <SettingItem
          iconType="feather"
          iconName="lock"
          title="Profile QR"
          onPress={() => navigation.navigate("QR Screen")}
        />

        <SettingItem
          iconType="feather"
          iconName="file"
          title="Privacy"
          onPress={() => navigation.navigate("PrivacyScreen")}
        />

        <SettingItem
          iconType="feather"
          iconName="clock"
          title="Activity center"
          onPress={() => navigation.navigate("ActivityCenter")}
        />

        <SettingItem
          iconType="feather"
          iconName="box"
          title="ADS"
          onPress={() => navigation.navigate("SubscriptionScreen")}
        />

        <View style={styles.divider} />
        <Text style={styles.textHead}>SUPPORT</Text>

        <SettingItem
          iconType="feather"
          iconName="file-text"
          title="FAQ's"
          onPress={() => navigation.navigate("ComingSoonScreen")}
        />

        <SettingItem
          iconType="feather"
          iconName="file-text"
          title="Report a problem"
          onPress={() => navigation.navigate("ReportAProblem")}
        />

        <SettingItem
          iconType="mci"
          iconName="help-circle-outline"
          title="Support"
          onPress={() => navigation.navigate("SupportScreen")}
        />

        <SettingItem
          iconType="mci"
          iconName="star-circle-outline"
          title="Influencer Zone"
          onPress={() => navigation.navigate("SupportScreen")}
        />

        <SettingItem
          iconType="mci"
          iconName="file-outline"
          title="Terms and policy"
          onPress={() => navigation.navigate("TermsAndPolicy")}
        />

        <View style={styles.divider} />
        <Text style={styles.textHead}>LOG IN</Text>

        <SettingItem
          iconType="feather"
          iconName="user-check"
          title="Switch account"
          onPress={() => setModalVisible(true)}
        />

        <SettingItem
          iconType="mci"
          iconName="logout"
          title="Log out"
          onPress={handleLogoutAndNavigateBack}
        />
      </ScrollView>

      {/* Account Switch Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Switch account</Text>

            {loadingUsers ? (
              <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
            ) : (
              allUsers.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => switchAccount(item)}
                  activeOpacity={0.8}
                  style={styles.accountCard}
                >
                  <Image
                    source={item.profile_img ? { uri: item.profile_img } : blank}
                    style={styles.avatar}
                  />

                  <View style={styles.accountInfo}>
                    <Text style={styles.username}>{item.username}</Text>

                    {/* Active/Current Devices List */}
                    {Array.isArray(item.device) &&
                      item.device.map((dev, idx) => (
                        <View key={idx} style={{ marginTop: 4 }}>
                          <Text
                            style={{
                              color: dev.is_current ? "#16A34A" : "#666",
                              fontWeight: dev.is_current ? "700" : "500",
                              fontSize: 13,
                            }}
                          >
                            {dev.is_current ? "🟢 Current Login" : "⚪ Logged in"} • {dev.device_name}
                          </Text>
                          <Text style={styles.deviceSubText}>
                            {dev.device_os} • v{dev.app_version}
                          </Text>
                        </View>
                      ))}
                  </View>

                  {item.id === profileData?.id && (
                    <View style={styles.activeDot} />
                  )}
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("LogIn");
              }}
              style={styles.addAccountBtn}
            >
              <Text style={styles.addAccountPlus}>+</Text>
              <Text style={styles.addAccountText}>Add account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textHead: {
    fontSize: 12,
    fontWeight: "700",
    color: "#898989",
    marginTop: 15,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E1E1E",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 15,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  accountInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  deviceSubText: {
    color: "#9CA3AF",
    fontSize: 11,
  },
  activeDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  addAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  addAccountPlus: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },
  addAccountText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
});