import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import {
  Group194,
  LeftArrowIcon,
  Search2,
  Message3,
  bin1,
} from "../../assets2/Icons/allIcons";

export default function ActivityCenter(props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Subtle Category Header */}
        <Text style={styles.texthead}>ACCOUNT</Text>

        {/* Watch History */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate("WatchHistory")}
          style={styles.menuRow}
        >
          <View style={styles.leftGroup}>
            <Image source={Group194} style={styles.imgpar11} />
            <Text style={styles.txt11}>Watch history</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </TouchableOpacity>

        {/* Comment History */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate("CommentHistory")}
          style={styles.menuRow}
        >
          <View style={styles.leftGroup}>
            <Image source={Message3} style={styles.imgpar11} />
            <Text style={styles.txt11}>Comment history</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </TouchableOpacity>

        {/* Search History */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate("SearchHistory")}
          style={styles.menuRow}
        >
          <View style={styles.leftGroup}>
            <Image source={Search2} style={styles.imgpar11} />
            <Text style={styles.txt11}>Search history</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </TouchableOpacity>

 
      </ScrollView>
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
    paddingBottom: 30,
  },
  texthead: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86878B",
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6", // Very faint, high-end divider line
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  imgpar11: {
    height: 20,
    width: 18,
    resizeMode: "contain",
  },
  txt11: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  imgpar12: {
    height: 12,
    width: 12,
    resizeMode: "contain",
    opacity: 0.6,
  },
});