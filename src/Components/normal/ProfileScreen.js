import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PostTopNav from "./PostTopNav";
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import getRandomAd from "../../Fetch_API/getRandomAd";

import { Group12, blank } from "../../assets2/Images/allImages";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.profile.profileData);

  const [modalVisible, setModalVisible] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adData, setAdData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId, dispatch])
  );

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ad = await getRandomAd();
        const adContent = ad?.data?.data || ad?.data || ad;

        if (adContent?.featured_image) {
          setAdData(adContent);
          setAdModalVisible(true);
        }
      } catch (error) {
        console.error("Ad fetch error:", error);
        setAdData(null);
        setAdModalVisible(false);
      }
    };

    fetchAd();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Action Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("UsersList")}
        >
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={24}
            color="#0F172A"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          @{profileData?.username || "profile"}
        </Text>

        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={26}
            color="#0F172A"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Seamless Profile Header */}
        <View style={styles.profileSection}>
          {/* Avatar & Key Metrics Header */}
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setProfileModal(true)}
              >
                <Image
                  source={
                    profileData?.profile_img
                      ? { uri: profileData.profile_img }
                      : blank
                  }
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.editBadge}
                onPress={() => navigation.navigate("Editprofile")}
              >
                <Image source={Group12} style={styles.editBadgeImg} />
              </TouchableOpacity>
            </View>

            {/* Inline Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {profileData?.total_posts ?? 0}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("FollowersList")}
              >
                <Text style={styles.statNumber}>
                  {profileData?.followers_count ?? 0}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("FollowingList")}
              >
                <Text style={styles.statNumber}>
                  {profileData?.following_count ?? 0}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {profileData?.total_like_counts ?? 0}
                </Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>

          {/* User Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {profileData?.about || "No bio available."}
            </Text>
          </View>

          {/* Vibrant Blue Primary Action Button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Editprofile")}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs Area */}
        <View style={styles.tabNavContainer}>
          <PostTopNav />
        </View>
      </ScrollView>

      {/* Options Menu Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.optionsSheet}>
            <View style={styles.sheetIndicator} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Settings & Options</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("CreatorTools");
              }}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="shield-star-outline"
                  size={20}
                  color="#0284C7"
                />
              </View>
              <Text style={styles.menuItemText}>Creator Tools</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("QR Screen");
              }}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={20}
                  color="#0284C7"
                />
              </View>
              <Text style={styles.menuItemText}>My QR Code</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("PrivacyPolicy");
              }}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={20}
                  color="#0284C7"
                />
              </View>
              <Text style={styles.menuItemText}>Privacy & Settings</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Expanded Profile Image Modal */}
      <Modal
        transparent={true}
        visible={profileModal}
        animationType="fade"
        onRequestClose={() => setProfileModal(false)}
      >
        <TouchableOpacity
          style={styles.fullImageOverlay}
          activeOpacity={1}
          onPress={() => setProfileModal(false)}
        >
          <Image
            source={
              profileData?.profile_img
                ? { uri: profileData.profile_img }
                : blank
            }
            resizeMode="cover"
            style={styles.expandedAvatar}
          />
        </TouchableOpacity>
      </Modal>

      {/* Sponsored Ad Modal */}
      {adModalVisible && adData && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={adModalVisible}
          onRequestClose={() => setAdModalVisible(false)}
        >
          <View style={styles.adOverlay}>
            <View style={styles.adCard}>
              <TouchableOpacity
                style={styles.adClose}
                onPress={() => setAdModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              {adData.featured_image && (
                <Image
                  source={{ uri: adData.featured_image }}
                  style={styles.adImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.adContent}>
                <Text style={styles.adBadge}>SPONSORED</Text>
                <Text style={styles.adTitle} numberOfLines={1}>
                  {adData.title || "Sponsored Ad"}
                </Text>
                <Text style={styles.adDesc} numberOfLines={2}>
                  {adData.description || "Check out this product!"}
                </Text>

                <View style={styles.adMetaContainer}>
                  <Text style={styles.adMetaText}>
                    {adData.category ? adData.category : "Featured"}
                  </Text>
                  {adData.price ? (
                    <Text style={[styles.adMetaText, styles.adPriceText]}>
                      {adData.price}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.adButton}
                  onPress={() => {
                    if (adData.link) {
                      Linking.openURL(adData.link);
                    }
                    setAdModalVisible(false);
                  }}
                >
                  <Text style={styles.adButtonText}>View Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
  },

  /* Top Bar */
  headerBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 35,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  iconBtn: {
    padding: 4,
  },

  /* Edge-to-Edge Profile Section */
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },

  /* Header Row: Avatar + Inline Stats */
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  editBadgeImg: {
    width: 20,
    height: 20,
  },

  /* Stats Row */
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 16,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  /* Bio */
  bioContainer: {
    marginBottom: 16,
  },
  bioText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },

  /* Premium Blue Primary Action Button */
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0284C7", // Bright professional electric blue
    width: "100%",
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  /* Tabs Section */
  tabNavContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* Bottom Sheet Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  optionsSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  sheetIndicator: {
    width: 36,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  /* Full Image View Modal */
  fullImageOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
  },
  expandedAvatar: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  /* Sponsored Ad Modal */
  adOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    paddingHorizontal: 20,
  },
  adCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  adClose: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  adImage: {
    width: "100%",
    height: 170,
  },
  adContent: {
    padding: 18,
    alignItems: "center",
  },
  adBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0284C7",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 4,
  },
  adDesc: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 12,
  },
  adMetaContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  adMetaText: {
    fontSize: 11,
    color: "#475569",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adPriceText: {
    fontWeight: "700",
    color: "#0F172A",
  },
  adButton: {
    backgroundColor: "#0284C7",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    width: "100%",
  },
  adButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});