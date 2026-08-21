import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

// API & Context
import UserData from "../../Fetch_API/UsersData";
import MyfollowerData2 from "../../Fetch_API/MyfollowerData2";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { setVideoAuthorUserId } from "../../redux/action";
import { AuthContext } from "../../Context/AuthContext";

// Assets
import { blank } from "../../assets2/Images/allImages";

const { width } = Dimensions.get("window");

// Primary App Blue
const PRIMARY_BLUE = "#0284C7"; // Vibrant default blue

export default function ClassyExploreUsersScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const profileData = useSelector((state) => state.profile.profileData);
  const dispatch = useDispatch();
  const { userId } = useContext(AuthContext);
  const navigation = useNavigation();

  // Keep user profile synced on focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId, dispatch])
  );

  const loadUsers = async () => {
    try {
      const data = await UserData();
      if (Array.isArray(data)) {
        setUsers(data);
        // Apply existing search query if refreshing
        if (searchQuery.trim()) {
          filterUsers(searchQuery, data);
        } else {
          setFilteredUsers(data);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  // Real-time Search Handler
  const filterUsers = (query, list = users) => {
    setSearchQuery(query);
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
      setFilteredUsers(list);
      return;
    }

    const matched = list.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const handle = `@${username.replace(/\s+/g, "")}`;
      return username.includes(cleanQuery) || handle.includes(cleanQuery);
    });

    setFilteredUsers(matched);
  };

  // Optimistic Follow/Unfollow toggle
  const handleToggleFollow = async (targetUserId) => {
    const currentUserId = profileData?.id || userId;
    if (!currentUserId) return;

    const updateUserList = (prevList) =>
      prevList.map((user) =>
        user.id === targetUserId
          ? { ...user, follow_status: !user.follow_status }
          : user
      );

    setUsers((prev) => updateUserList(prev));
    setFilteredUsers((prev) => updateUserList(prev));

    try {
      await MyfollowerData2(currentUserId, targetUserId);
      dispatch(fetchProfileData(currentUserId));
    } catch (error) {
      console.error("Follow error:", error);
      // Rollback on failure
      setUsers((prev) => updateUserList(prev));
      setFilteredUsers((prev) => updateUserList(prev));
    }
  };

  const handleOpenProfile = (user) => {
    dispatch(setVideoAuthorUserId(user.id));
    navigation.navigate("OtherUserProfileScreen", { item: user });
  };

  const renderClassyUserCard = ({ item }) => {
    const isFollowing = item.follow_status;
    const avatarSource = item.profile_img ? { uri: item.profile_img } : blank;

    return (
      <View style={styles.card}>
        {/* Full Card Hero Image Touch Area */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => handleOpenProfile(item)}
          style={styles.imageContainer}
        >
          <Image source={avatarSource} style={styles.heroImage} />

          {/* Glassmorphism Badge */}
          <View style={styles.viewBadge}>
            <Text style={styles.viewBadgeText}>View Profile</Text>
            <Icon name="arrow-up-right" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Minimal Footer Info */}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handleOpenProfile(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.username} numberOfLines={1}>
              {item.username || "Anonymous"}
            </Text>
            <Text style={styles.handleText} numberOfLines={1}>
              @{item.username?.toLowerCase().replace(/\s+/g, "") || "creator"}
            </Text>
          </TouchableOpacity>

          {/* Action Pill Button */}
          <TouchableOpacity
            style={[
              styles.actionPill,
              isFollowing ? styles.followingPill : styles.followPill,
            ]}
            onPress={() => handleToggleFollow(item.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.actionPillText,
                isFollowing ? styles.followingPillText : styles.followPillText,
              ]}
            >
              {isFollowing ? "Following" : "Connect"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={PRIMARY_BLUE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTag}>FEATURED CREATORS</Text>
        <Text style={styles.headerTitle}>Curated for You</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color={PRIMARY_BLUE} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search creators by name or handle..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={(text) => filterUsers(text)}
            autoCorrect={false}
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => filterUsers("")}>
              <Icon name="x-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid Feed */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClassyUserCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_BLUE}
            colors={[PRIMARY_BLUE]}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? `No creators found matching "${searchQuery}"`
                : "No featured creators available."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF", // Soft light-blue background tint
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY_BLUE,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "400",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "400",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 8,
    gap: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: width * 0.9,
    backgroundColor: "#E0F2FE",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  viewBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2, 132, 199, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    gap: 4,
  },
  viewBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  username: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  handleText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  actionPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  followPill: {
    backgroundColor: PRIMARY_BLUE,
  },
  followingPill: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  actionPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  followPillText: {
    color: "#FFFFFF",
  },
  followingPillText: {
    color: PRIMARY_BLUE,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});