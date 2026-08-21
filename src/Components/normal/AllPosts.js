import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import AllPostsFetch from "../../Fetch_API/AllPostsFetch";
import { AuthContext } from "../../Context/AuthContext";
import { placeholder_image } from "../../assets2/Images/allImages";
import {
  setUserProfileImageVideoScroll,
  setUserVideoScroll,
} from "../../redux/action";

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 12) / NUM_COLUMNS; // 3-column layout with padding adjustment

// Classy Accent Palette
const PRIMARY_BLUE = "#0284C7";
const SOFT_BLUE_BG = "#F0F7FF";

export default function AllPosts({ navigation }) {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Fetch Posts on Focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchPosts = async () => {
        try {
          setLoading(true);
          const response = await AllPostsFetch(userId);
          if (isMounted) {
            setAllPosts(Array.isArray(response) ? response : []);
          }
        } catch (error) {
          console.error("Error fetching AllPosts:", error);
          if (isMounted) setAllPosts([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchPosts();

      return () => {
        isMounted = false;
      };
    }, [userId])
  );

  // Pad data array to keep grid alignment symmetrical without mutating state
  const getFormattedData = (data) => {
    if (!data || data.length === 0) return [];
    const formatted = [...data];
    const totalRows = Math.floor(formatted.length / NUM_COLUMNS);
    let lastRowElements = formatted.length - totalRows * NUM_COLUMNS;

    while (lastRowElements !== NUM_COLUMNS && lastRowElements !== 0) {
      formatted.push({
        key: `placeholder-${lastRowElements}`,
        isPlaceholder: true,
      });
      lastRowElements++;
    }
    return formatted;
  };

  const handlePostPress = (item, index) => {
    if (item.isPlaceholder) return;

    if (item.video_url) {
      dispatch(setUserVideoScroll(item.video_url));
    }
    if (item.profile_img) {
      dispatch(setUserProfileImageVideoScroll(item.profile_img));
    }

    navigation.navigate("AllPostScroll", {
      index,
      allPosts,
    });
  };

  const renderPostItem = ({ item, index }) => {
    if (item.isPlaceholder) {
      return <View style={[styles.gridTile, styles.placeholderTile]} />;
    }

    return (
      <Pressable
        onPress={() => handlePostPress(item, index)}
        style={({ pressed }) => [
          styles.gridTile,
          pressed && styles.gridTilePressed,
        ]}
      >
        <Image
          source={
            item.thumbnail_url ? { uri: item.thumbnail_url } : placeholder_image
          }
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Video Icon Overlay */}
        <View style={styles.videoBadge}>
          <Ionicons name="videocam" size={14} color="#FFFFFF" />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={PRIMARY_BLUE} />
        </View>
      ) : allPosts.length > 0 ? (
        <FlatList
          data={getFormattedData(allPosts)}
          renderItem={renderPostItem}
          keyExtractor={(item, idx) =>
            item.post_id ? item.post_id.toString() : item.key || idx.toString()
          }
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.rowWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="images-outline" size={36} color="#94A3B8" />
          <Text style={styles.emptyText}>No posts available yet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SOFT_BLUE_BG,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  listContent: {
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 24,
  },
  rowWrapper: {
    justifyContent: "flex-start",
    marginBottom: 3,
  },
  gridTile: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.3, // Classy 3:4 aspect ratio
    marginHorizontal: 1.5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E0F2FE",
    position: "relative",
  },
  gridTilePressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  placeholderTile: {
    backgroundColor: "transparent",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    paddingWidth: 6,
    paddingHeight: 4,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
});