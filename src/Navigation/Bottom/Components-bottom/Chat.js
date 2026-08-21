import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";

import { AuthContext } from "../../../Context/AuthContext";
import UserStoriesFetch from "../../../Fetch_API/UserStoriesFetch";
import UserFollowingStoriesFetch from "../../../Fetch_API/UserFollowingStoriesFetch";
import { Stories3 } from "@components/storiesComponents";
import { WIDTH } from "@components/storiesComponents/constants";
import { BASE_URL } from "../../../Fetch_API/BaseURL";

import { blank } from "../../../assets2/Images/allImages";

// Classy Accent Palette
const PRIMARY_BLUE = "#0284C7"; // Rich Azure
const SOFT_BLUE_BG = "#F0F7FF"; // Ice Blue Tint
const CARD_BORDER = "#E2E8F0"; // Subtle Slate

function generateChatId(userId1, userId2) {
  return `${Math.min(userId1, userId2)}-${Math.max(userId1, userId2)}`;
}

function getMessagePreview(item) {
  if (!item) return "";
  if (item.image && item.image !== "") return "📷 Photo";
  if (item.video && item.video !== "") return "📹 Video";
  if (item.file && item.file.url !== "") return "📄 Document";
  return item.text || "";
}

export default function Chat({ navigation }) {
  const { userId } = useContext(AuthContext);
  const profileData = useSelector((state) => state.profile.profileData);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [stories, setStories] = useState({
    userStories: [],
    userFollowingStories: [],
  });

  const [visible, setVisible] = useState(false);
  const [userStoryModalVisible, setUserStoryModalVisible] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const storiesRef = useRef(null);
  const userStoriesRef = useRef(null);

  // Fetch Stories
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchStoriesData = async () => {
        try {
          const [userResponse, followingResponse] = await Promise.all([
            UserStoriesFetch(userId),
            UserFollowingStoriesFetch(userId),
          ]);

          if (isMounted) {
            setStories({
              userStories: userResponse?.data ? [userResponse.data] : [],
              userFollowingStories: followingResponse?.data || [],
            });
          }
        } catch (error) {
          console.error("Error fetching stories:", error);
        }
      };

      fetchStoriesData();
      return () => {
        isMounted = false;
      };
    }, [userId])
  );

  // Fetch Users & Realtime Listeners
  useFocusEffect(
    useCallback(() => {
      let unsubscribes = [];
      let isMounted = true;

      const fetchUsersAndSubscribe = async () => {
        setIsLoading(true);
        try {
          const uid = await AsyncStorage.getItem("userId");
          const currentUid = uid || userId;

          const response = await fetch(`${BASE_URL}/allusers/v1/allUsersData/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid: currentUid }),
          });

          const usersData = await response.json();

          if (!response.ok || !Array.isArray(usersData)) {
            setIsLoading(false);
            return;
          }

          if (!isMounted) return;

          setAllUsers(usersData);
          setFilteredData(usersData);

          usersData.forEach((otherUser) => {
            const chatId = generateChatId(currentUid, otherUser.id);

            const unsubscribe = firestore()
              .collection("ChatsRoom")
              .doc(chatId)
              .collection("Messages")
              .orderBy("createdAt", "desc")
              .limit(1)
              .onSnapshot(
                (querySnapshot) => {
                  if (!querySnapshot || querySnapshot.empty) return;

                  const latestMessage = querySnapshot.docs[0].data();
                  const messageText = getMessagePreview(latestMessage);
                  const messageCreatedAt = latestMessage.createdAt;

                  const updateUserData = (prevList) => {
                    const updated = prevList.map((user) => {
                      if (user.id === otherUser.id) {
                        return {
                          ...user,
                          text: messageText,
                          createdAt: messageCreatedAt,
                        };
                      }
                      return user;
                    });

                    return updated.sort((a, b) => {
                      const dateA = a.createdAt
                        ? new Date(
                            a.createdAt.seconds * 1000 +
                              a.createdAt.nanoseconds / 1000000
                          )
                        : new Date(0);
                      const dateB = b.createdAt
                        ? new Date(
                            b.createdAt.seconds * 1000 +
                              b.createdAt.nanoseconds / 1000000
                          )
                        : new Date(0);
                      return dateB - dateA;
                    });
                  };

                  setAllUsers((prev) => updateUserData(prev));
                  setFilteredData((prev) => updateUserData(prev));
                },
                (error) => console.error(`Firestore snapshot error for chat ${chatId}:`, error)
              );

            unsubscribes.push(unsubscribe);
          });
        } catch (error) {
          console.error("Error setting up chat listeners:", error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchUsersAndSubscribe();

      return () => {
        isMounted = false;
        unsubscribes.forEach((unsub) => unsub && unsub());
      };
    }, [userId])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase().trim();

    if (!formattedQuery) {
      setFilteredData(allUsers);
      return;
    }

    const filtered = allUsers.filter((item) =>
      item.username?.toLowerCase().includes(formattedQuery)
    );
    setFilteredData(filtered);
  };

  const handleModal = (index) => {
    setCurrentUserIndex(index);
    setVisible(true);
    setTimeout(() => {
      storiesRef.current?.handleScrolltoOffset(index * WIDTH);
    }, 10);
  };

  const handleUserModal = (index) => {
    setCurrentUserIndex(index);
    setUserStoryModalVisible(true);
    setTimeout(() => {
      userStoriesRef.current?.handleScrolltoOffset(index * WIDTH);
    }, 10);
  };

  const renderChatItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("UserChat", { item })}
      style={({ pressed }) => [
        styles.chatCard,
        pressed && styles.chatCardPressed,
      ]}
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={item.profile_img ? { uri: item.profile_img } : blank}
          style={styles.avatar}
        />
        <View style={styles.onlineStatusDot} />
      </View>

      <View style={styles.chatInfoContainer}>
        <View style={styles.chatHeaderRow}>
          <Text style={styles.usernameText} numberOfLines={1}>
            {item.username || "Anonymous"}
          </Text>
        </View>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.text || "Tap to start conversation..."}
        </Text>
      </View>

      <Icon name="chevron-right" size={18} color="#94A3B8" style={styles.arrowIcon} />
    </Pressable>
  );

  const renderHeader = () => (
    <>
      {/* Editorial Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTag}>INBOX</Text>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Stories Carousel */}
      <View style={styles.storiesContainer}>
        {/* User Story Block */}
        <View style={styles.userStoryWrapper}>
          {stories.userStories.length > 0 ? (
            stories.userStories.map((item, index) => (
              <Pressable
                key={item.id || index.toString()}
                onPress={() => handleUserModal(index)}
                style={styles.storyPill}
              >
                <View style={styles.storyGradientRing}>
                  <ImageBackground
                    source={item.user_image ? { uri: item.user_image } : blank}
                    style={styles.storyAvatar}
                    imageStyle={{ borderRadius: 30 }}
                  />
                </View>
                <Text style={styles.storyName} numberOfLines={1}>
                  Your Story
                </Text>
              </Pressable>
            ))
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("TermsOfServiceFetch")}
              style={styles.storyPill}
              activeOpacity={0.85}
            >
              <View style={styles.addStoryRing}>
                <ImageBackground
                  source={
                    profileData?.profile_img
                      ? { uri: profileData.profile_img }
                      : blank
                  }
                  style={styles.storyAvatar}
                  imageStyle={{ borderRadius: 30 }}
                >
                  <View style={styles.plusBadge}>
                    <Icon name="plus" size={12} color="#FFFFFF" />
                  </View>
                </ImageBackground>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                Add Story
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider Bar */}
        <View style={styles.storyDivider} />

        {/* Following Stories */}
        <FlatList
          horizontal
          data={stories.userFollowingStories}
          keyExtractor={(item, index) => item.id || index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollableStories}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleModal(index)}
              style={styles.storyPill}
            >
              <View style={styles.storyGradientRing}>
                <ImageBackground
                  source={item.user_image ? { uri: item.user_image } : blank}
                  style={styles.storyAvatar}
                  imageStyle={{ borderRadius: 30 }}
                />
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {item.user_name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Classy Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color={PRIMARY_BLUE} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#94A3B8"
            clearButtonMode="while-editing"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>RECENT CHATS</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={SOFT_BLUE_BG} />

      {/* Story Modals */}
      <Modal
        animationType="slide"
        visible={userStoryModalVisible}
        onRequestClose={() => setUserStoryModalVisible(false)}
      >
        <Stories3
          currentUserIndex={currentUserIndex}
          ref={userStoriesRef}
          visible={userStoryModalVisible}
          setVisible={setUserStoryModalVisible}
          stories={stories.userStories}
        />
      </Modal>

      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Stories3
          currentUserIndex={currentUserIndex}
          ref={storiesRef}
          visible={visible}
          setVisible={setVisible}
          stories={stories.userFollowingStories}
        />
      </Modal>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent messages found.</Text>
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
    backgroundColor: SOFT_BLUE_BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    paddingBottom: 30,
  },
  headerRow: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY_BLUE,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "400",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  storiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  userStoryWrapper: {
    marginRight: 10,
  },
  storyPill: {
    alignItems: "center",
    width: 68,
  },
  storyGradientRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  addStoryRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  storyAvatar: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  plusBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: PRIMARY_BLUE,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  storyName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#475569",
    marginTop: 6,
    textAlign: "center",
  },
  storyDivider: {
    width: 1,
    height: 45,
    backgroundColor: "#CBD5E1",
    marginRight: 10,
  },
  scrollableStories: {
    gap: 12,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY_BLUE,
    letterSpacing: 1.2,
    marginLeft: 24,
    marginTop: 18,
    marginBottom: 10,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1.5,
  },
  chatCardPressed: {
    backgroundColor: "#F8FAFC",
    transform: [{ scale: 0.99 }],
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
  },
  onlineStatusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#10B981", // Subtle emerald green online indicator
    position: "absolute",
    bottom: 1,
    right: 1,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatInfoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  chatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  usernameText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "400",
  },
  arrowIcon: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
  },
});