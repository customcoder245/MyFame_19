import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";

// Context & API Imports
import { AuthContext } from "../../../Context/AuthContext";
import ExploreCategoriesFetch from "../../../Fetch_API/ExploreCategoriesFetch";
import AllPostsExploreFetch from "../../../Fetch_API/AllPostsExploreFetch";
import SearchRandom from "../../../Fetch_API/SearchRandom";
import SaveSearchHistoryAPI from "../../../Fetch_API/SearchHistoryAPI";

// Redux Actions & Assets
import {
  setUserVideoScroll,
  setUserProfileImageVideoScroll,
} from "../../../redux/action";
import { blank, placeholder_image } from "../../../assets2/Images/allImages";
import { Vector13 } from "../../../assets2/Icons/allIcons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_PADDING = 12;
const CARD_WIDTH = (SCREEN_WIDTH - COLUMN_PADDING * 3) / 2;

export default function Explore(props) {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Fetch Categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await ExploreCategoriesFetch();
        if (data) setCategoryData(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategory();
  }, []);

  // Fetch Initial Explore Posts
  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const response = await AllPostsExploreFetch(userId);
      if (response && response.videos) {
        setAllPosts(response.videos);
      } else {
        setAllPosts([]);
      }
    } catch (error) {
      console.error("Error fetching AllPosts:", error);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitialPosts();
    }, [userId])
  );

  // Search Handler
  const handleSearch = async (text) => {
    if (!text.trim()) {
      fetchInitialPosts();
      return;
    }

    setLoading(true);
    try {
      const response = await SearchRandom(userId, text);
      setAllPosts(response?.data?.liked_videos || response?.videos || []);
      await SaveSearchHistoryAPI(userId, text);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchInitialPosts();
  };

  // Render Post Cards
  const renderAllPosts = ({ item, index }) => {
    if (item.placeholder) return null;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardContainer}
        onPress={() => {
          dispatch(setUserVideoScroll(item.video_url));
          dispatch(setUserProfileImageVideoScroll(item.profile_img));
          props.navigation.navigate("AllPostScroll", {
            index,
            allPosts,
          });
        }}
      >
        <View style={styles.thumbnailWrapper}>
          <Image
            source={
              item.thumbnail_url
                ? { uri: item.thumbnail_url }
                : placeholder_image
            }
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.videoBadge}>
            <Ionicons name="videocam" size={14} color="#FFF" />
          </View>
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.video_title || "Untitled Video"}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.authorSection}>
              <Image
                style={styles.avatar}
                source={
                  item.video_author_profile_img
                    ? { uri: item.video_author_profile_img }
                    : blank
                }
              />
              <Text style={styles.username} numberOfLines={1}>
                {item.video_username || "Creator"}
              </Text>
            </View>

            <View style={styles.likesSection}>
              <Image style={styles.likeIcon} source={Vector13} />
              <Text style={styles.likesCount}>
                {item.video_likes ?? 0}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Header Component with Search Bar and Categories
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Search videos, creators, topics..."
          placeholderTextColor="#8E8E93"
          value={searchText}
          returnKeyType="search"
          onChangeText={setSearchText}
          onSubmitEditing={() => handleSearch(searchText)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category List */}

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {loading ? (
        <View style={styles.loadingContainer}>
          {renderHeader()}
          <ActivityIndicator size="large" color="#000000" style={{ marginTop: 40 }} />
        </View>
      ) : (
        <FlatList
          data={allPosts}
          renderItem={renderAllPosts}
          keyExtractor={(item, index) =>
            item.post_id ? item.post_id.toString() : index.toString()
          }
          numColumns={2}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyText}>No videos found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    height: 44,
    marginHorizontal: COLUMN_PADDING,
    marginVertical: 40,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: COLUMN_PADDING,
    paddingVertical: 6,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: "#000000",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636366",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  listContentContainer: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: COLUMN_PADDING,
    marginBottom: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnailWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#E5E5EA",
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 6,
  },
  cardDetails: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 18,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: "#E5E5EA",
  },
  username: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
    flex: 1,
  },
  likesSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeIcon: {
    width: 13,
    height: 13,
    tintColor: "#8E8E93",
  },
  likesCount: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "500",
  },
});