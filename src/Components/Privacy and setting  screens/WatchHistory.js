import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../../Context/AuthContext";
import GetWatchHistoryAPI from "../../Fetch_API/GetWatchHistoryAPI";

// Luxury Minimalist Palette
const BG_COLOR = "#FAF9F6";       // Warm Off-White / Cream Canvas
const CARD_BG = "#FFFFFF";        // Crisp White Card Surface
const BORDER_COLOR = "#E5E7EB";   // Subtle Slate Border
const ACCENT_PRIMARY = "#312E81"; // Deep Midnight Indigo
const ACCENT_MUTED = "#6366F1";   // Refined Accent
const TEXT_MAIN = "#0F172A";      // Deep Charcoal
const TEXT_MUTED = "#64748B";     // Soft Slate

function timeAgo(dateString) {
  if (!dateString) return "";
  const then = new Date(dateString.replace(" ", "T"));
  const now = new Date();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function formatCount(n) {
  const num = Number(n) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

const EditorialHistoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.card}
    >
      {/* Media Canvas Column */}
      <View style={styles.mediaColumn}>
        <Image
          source={{
            uri: item.thumbnail_url || "https://via.placeholder.com/300x400",
          }}
          style={styles.thumbnail}
        />
        <View style={styles.playBadge}>
          <Ionicons name="play" size={10} color="#FFFFFF" />
        </View>
      </View>

      {/* Details Column */}
      <View style={styles.detailsColumn}>
        {/* Top Meta: Creator & Time */}
        <View style={styles.metaHeader}>
          <View style={styles.authorBadge}>
            {item.video_author_profile ? (
              <Image
                source={{ uri: item.video_author_profile }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={8} color={TEXT_MUTED} />
              </View>
            )}
            <Text numberOfLines={1} style={styles.authorName}>
              {item.video_author || "Creator"}
            </Text>
          </View>
          <Text style={styles.timeText}>{timeAgo(item.watched_at)}</Text>
        </View>

        {/* Video Title */}
        <Text numberOfLines={2} style={styles.titleText}>
          {item.video_description || "Untitled Publication"}
        </Text>

        {/* Bottom Engagement Pills & CTA */}
        <View style={styles.cardFooter}>
          <View style={styles.statsRow}>
            <View style={styles.statTag}>
              <Ionicons name="heart-outline" size={11} color={TEXT_MUTED} />
              <Text style={styles.statTagText}>{formatCount(item.likes)}</Text>
            </View>
            <View style={styles.statTag}>
              <Ionicons name="chatbubble-outline" size={10} color={TEXT_MUTED} />
              <Text style={styles.statTagText}>{formatCount(item.comments)}</Text>
            </View>
          </View>

 
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ClassyWatchHistory({ navigation }) {
  const { userId } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async (isMounted = true) => {
    try {
      const data = await GetWatchHistoryAPI(userId);
      if (isMounted) {
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      if (isMounted) setHistory([]);
    } finally {
      if (isMounted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      fetchHistory(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory(true);
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={ACCENT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_COLOR} />

      {/* Screen Title Block */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>ARCHIVE</Text>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Watch History</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{history.length}</Text>
          </View>
        </View>
      </View>

      {/* Main List */}
      <FlatList
        data={history}
        keyExtractor={(item, index) =>
          item.post_id ? item.post_id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <EditorialHistoryCard
            item={item}
            onPress={() =>
              navigation.navigate("AllUsersPosts", { postId: item.post_id })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT_PRIMARY}
            colors={[ACCENT_PRIMARY]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyCircle}>
              <Ionicons name="bookmark-outline" size={26} color={ACCENT_PRIMARY} />
            </View>
            <Text style={styles.emptyTitle}>Archive Empty</Text>
            <Text style={styles.emptySub}>
              Your viewing log is completely clear. Watched media will be curated here.
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
    backgroundColor: BG_COLOR,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG_COLOR,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: ACCENT_MUTED,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: ACCENT_PRIMARY,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  mediaColumn: {
    position: "relative",
    width: 80,
    height: 108,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsColumn: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  metaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  avatarPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_MAIN,
    maxWidth: 110,
  },
  timeText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: "400",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
    lineHeight: 19,
    marginVertical: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statTagText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  viewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: ACCENT_PRIMARY,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 36,
  },
  emptyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_MAIN,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 20,
  },
});