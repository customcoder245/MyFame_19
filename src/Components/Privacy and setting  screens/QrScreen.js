import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { AuthContext } from "../../Context/AuthContext";
import { useSelector } from "react-redux";

import {
  icononly,
  link2,
  share1,
} from "../../assets2/Icons/allIcons";

import { port1 } from "../../assets2/Images/allImages";
import { blank } from "../../assets2/Images/allImages";

export default function QrScreen() {
  // ✅ Get logged in user's id and profile data
  const { userId } = useContext(AuthContext);
  const profileData = useSelector((state) => state.profile.profileData);

  // ✅ The shareable HTTPS link
  const profileLink = `https://myfame.com/profile/${userId}`;

  // ✅ Copy link to clipboard
  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(profileLink);
    Alert.alert("Copied! ✅", "Profile link copied to clipboard.");
  };

  // ✅ Share profile link
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Follow me on MyFame! 🎉\n${profileLink}`,
        title: "MyFame Profile",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share profile.");
    }
  };

  return (
    <LinearGradient
      colors={[
        "#F8FCFF",
        "#EEF9FF",
        "#E6F7FF",
        "#FDFEFF",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Top Gradient Glow */}
      <LinearGradient
        colors={[
          "rgba(20,181,251,0.20)",
          "rgba(20,181,251,0.06)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topGlow}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {/* ✅ Show real profile image or fallback */}
          <Image
            source={
              profileData?.profile_img
                ? { uri: profileData.profile_img }
                : blank
            }
            style={styles.avatar}
          />
        </View>

        {/* ✅ Show real name and username */}
        <Text style={styles.name}>
          {profileData?.name || profileData?.username || "MyFame User"}
        </Text>

        <Text style={styles.username}>
          @{profileData?.username || "username"}
        </Text>
      </View>

      {/* QR CARD */}
      <View style={styles.qrSection}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.95)",
            "rgba(255,255,255,0.82)",
          ]}
          style={styles.qrGlass}
        >
          {/* ✅ Dynamic QR Code generated from real profile link */}
          {userId ? (
            <QRCode
              value={profileLink}
              size={200}
              color="#111827"
              backgroundColor="transparent"
            />
          ) : (
            <Text style={{ color: "#aaa" }}>Loading...</Text>
          )}

          {/* Floating Logo */}
          <LinearGradient
            colors={["#14b5fb", "#39c3ff"]}
            style={styles.logoContainer}
          >
            <Image
              source={icononly}
              style={styles.logo}
            />
          </LinearGradient>
        </LinearGradient>

        <Text style={styles.scanText}>
          Scan to instantly connect
        </Text>

        {/* ✅ Show the actual link below QR */}
        <Text style={styles.linkText} numberOfLines={1}>
          {profileLink}
        </Text>
      </View>

      {/* BUTTONS */}
      <View style={styles.actions}>

        {/* ✅ Copy Link Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.actionOuter}
          onPress={handleCopyLink}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.92)",
              "rgba(255,255,255,0.72)",
            ]}
            style={styles.actionBtn}
          >
            <View style={styles.iconBox}>
              <Image
                source={share1}
                style={styles.actionIcon}
              />
            </View>
            <Text style={styles.actionText}>Copy Link</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ✅ Share Profile Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.actionOuter}
          onPress={handleShare}
        >
          <LinearGradient
            colors={["#14b5fb", "#42c7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionBtn}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(255,255,255,0.20)" },
              ]}
            >
              <Image
                source={link2}
                style={[styles.actionIcon, { tintColor: "#FFFFFF" }]}
              />
            </View>
            <Text style={[styles.actionText, { color: "#FFFFFF" }]}>
              Share Profile
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 90,
    paddingBottom: 45,
    justifyContent: "space-between",
    backgroundColor: "#F7FBFF",
  },
  topGlow: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 300,
  },
  header: {
    alignItems: "center",
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: "rgba(20,181,251,0.10)",
    marginBottom: 18,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  name: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -1,
  },
  username: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  qrSection: {
    alignItems: "center",
  },
  qrGlass: {
    width: 310,
    height: 310,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#14b5fb",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 10,
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#14b5fb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  scanText: {
    marginTop: 28,
    fontSize: 15,
    color: "#5B6472",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  // ✅ New style for link text below QR
  linkText: {
    marginTop: 8,
    fontSize: 12,
    color: "#14b5fb",
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionOuter: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#14b5fb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  actionBtn: {
    height: 74,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(20,181,251,0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    tintColor: "#14b5fb",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});