import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Share,
  BackHandler,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Assets
import { qrcode1, blank, Group80, Unfollow } from "../../assets2/Images/allImages";

// Context & API Functions
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import MyFollowerData from "../../Fetch_API/MyFollowerData";
import FetchOtherUserProfile from "../../Fetch_API/FetchOtherUserProfile";

// Redux Actions
import {
  setProfileScreenFollowerId,
  setFollowerId,
  setVideoAuthorUserId,
} from "../../redux/action";

import PostTopNav2 from "./PostTopNav2";

export default function OtherUserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userId } = useContext(AuthContext);
  const profileData = useSelector((state) => state.profile.profileData);

  const [userData, setUserData] = useState(null);
  const [screenLoading, setScreenLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  // Follow/Unfollow states
  const [followStatus, setFollowStatus] = useState(false);
  const [fetchDataOnToggle, setFetchDataOnToggle] = useState(false);

  // Route parameters (Normal vs Deep Link navigation)
  const item = route.params?.item || null;
  const deepLinkUserId = route.params?.userId || null;
  const isDeepLink = !item && !!deepLinkUserId;

  // Sync initial follow status when item parameter exists
  useEffect(() => {
    if (item) {
      setFollowStatus(item.follow_status ?? false);
    }
  }, [item]);

  // Fetch Other User Profile Data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setScreenLoading(true);
      try {
        if (isDeepLink && deepLinkUserId) {
          dispatch(setVideoAuthorUserId(deepLinkUserId));
          await new Promise((res) => setTimeout(res, 100));
        }

        const responseData = await FetchOtherUserProfile();
        if (isMounted) {
          if (responseData && responseData.data) {
            setUserData(responseData.data);
          } else {
            Alert.alert("Error", "Failed to fetch user data");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        if (isMounted) setScreenLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [deepLinkUserId, isDeepLink, dispatch]);

  // Ensure logged-in user profile data is present
  useEffect(() => {
    if (userId && (!profileData || !profileData.id)) {
      dispatch(fetchProfileData(userId));
    }
  }, [userId, profileData, dispatch]);

  // Handle Smart Navigation Back
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomNavigator" }],
        })
      );
    }
  }, [navigation]);

  // Hardware Back Press for Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [handleBack])
  );

  // Follow/Unfollow Toggle Action
  const handleToggleFollow = () => {
    if (!profileData || !profileData.id) {
      console.log("Profile data loading, please wait...");
      return;
    }

    const profileOwnerId = userData?.id || deepLinkUserId || item?.id;
    if (!profileOwnerId) return;

    setFollowStatus((prev) => !prev);
    dispatch(setFollowerId(profileOwnerId));
    setFetchDataOnToggle(true);
  };

  const handleDataFetched = () => {
    setFetchDataOnToggle(false);
  };

  // Share Profile Function
  const handleShareProfile = async () => {
    const targetId = userData?.id || deepLinkUserId || item?.id;
    try {
      await Share.share({
        message: `Check out @${userData?.username || "creator"} on MyFame! 🎉\nhttps://myfame.com/profile/${targetId}`,
        title: "MyFame Profile",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share profile.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <TouchableOpacity
        style={styles.avatarWrapper}
        onPress={() => setProfileModal(true)}
        activeOpacity={0.85}
      >
        <Image
          source={userData?.profile_img ? { uri: userData.profile_img } : blank}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Username Handle */}
      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>
          @{userData?.username || "user"}
        </Text>
      </View>

      {/* User Performance Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData?.total_posts ?? 0}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData?.followers_count ?? 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData?.following_count ?? 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData?.total_like_counts ?? 0}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
      </View>

      {/* Action Buttons Toolbar */}
      <View style={styles.actionToolbar}>
        {/* Follow / Unfollow Button */}
        <TouchableOpacity
          style={styles.followActionBtn}
          onPress={handleToggleFollow}
          activeOpacity={0.8}
        >
          <Image
            source={followStatus ? Unfollow : Group80}
            style={styles.followBtnImage}
          />
        </TouchableOpacity>

        {/* Bookmark Action */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => userData?.id && dispatch(setProfileScreenFollowerId(userData.id))}
          activeOpacity={0.7}
        >
          <Ionicons name="bookmark-outline" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Share Profile Action */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleShareProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Biography */}
      <Text style={styles.bioText}>
        {userData?.about || "No bio available."}
      </Text>

      {/* Content Posts Section */}
      <View style={styles.contentSection}>
        {!screenLoading ? (
          followStatus || userData?.account_type === "1" ? (
            <PostTopNav2 />
          ) : (
            <View style={styles.privateContainer}>
              <Ionicons name="lock-closed-outline" size={36} color="#6B7280" />
              <Text style={styles.privateText}>This Account is Private</Text>
              <Text style={styles.privateSubText}>
                Follow this account to view their posts and content.
              </Text>
            </View>
          )
        ) : (
          <ActivityIndicator size="small" color="#111827" style={{ marginTop: 20 }} />
        )}
      </View>

      {/* API Trigger Component for Follow Syncing */}
      {fetchDataOnToggle && profileData?.id && (
        <MyFollowerData onFetched={handleDataFetched} />
      )}

      {/* Settings Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContent}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                navigation.navigate("CreatorTools");
                setModalVisible(false);
              }}
            >
              <Ionicons name="construct-outline" size={22} color="#111827" />
              <Text style={styles.modalItemText}>Creator Tools</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                navigation.navigate("QR Screen");
                setModalVisible(false);
              }}
            >
              <Image source={qrcode1} style={styles.modalIcon} />
              <Text style={styles.modalItemText}>My QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                navigation.navigate("PrivacyPolicy");
                setModalVisible(false);
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color="#111827" />
              <Text style={styles.modalItemText}>Privacy & Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeSheetBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Image Full View Lightbox */}
      <Modal
        transparent={true}
        visible={profileModal}
        animationType="fade"
        onRequestClose={() => setProfileModal(false)}
      >
        <TouchableOpacity
          style={styles.lightboxOverlay}
          activeOpacity={1}
          onPress={() => setProfileModal(false)}
        >
          <Image
            source={userData?.profile_img ? { uri: userData.profile_img } : blank}
            resizeMode="cover"
            style={styles.lightboxImage}
          />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F2F4F7",
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerBar: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarWrapper: {
    elevation: 4,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 60,
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  usernameContainer: {
    marginTop: 12,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    width: "100%",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  actionToolbar: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    alignItems: "center",
  },
  followActionBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  followBtnImage: {
    width: 120,
    height: 44,
    resizeMode: "contain",
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 16,
    width: "85%",
    textAlign: "center",
    color: "#4B5563",
  },
  contentSection: {
    width: "100%",
    marginTop: 20,
  },
  privateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  privateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
  },
  privateSubText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 18,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  modalIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  closeSheetBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  closeSheetText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  lightboxOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  lightboxImage: {
    height: 280,
    width: 280,
    borderRadius: 140,
  },
});