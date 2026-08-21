import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Alert,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { AuthContext } from "../../Context/AuthContext";
import GetSearchHistoryAPI from "../../Fetch_API/GetSearchHistoryAPI";

// Classy Editorial Palette
const BG_COLOR = "#FAF9F6";       // Warm Off-White Canvas
const CARD_BG = "#FFFFFF";        // Pure White Surface
const BORDER_COLOR = "#E5E7EB";   // Subtle Slate Border
const ACCENT_PRIMARY = "#312E81"; // Deep Midnight Indigo
const ACCENT_MUTED = "#6366F1";   // Refined Accent Highlight
const ACCENT_SOFT = "#EEF2FF";    // Light Indigo Tint
const TEXT_MAIN = "#0F172A";      // Deep Charcoal
const TEXT_MUTED = "#64748B";     // Soft Slate Grey

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
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const SearchCard = ({ item, onPress, onRemove }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 3,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="search-outline" size={16} color={ACCENT_PRIMARY} />
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.searchText}>
            {item.search_term}
          </Text>
          {item.search_date ? (
            <Text style={styles.date}>{timeAgo(item.search_date)}</Text>
          ) : null}
        </View>

        {/* Search Suggestion Arrow Prompt */}
        <Ionicons name="arrow-back-outline" size={15} color={TEXT_MUTED} style={styles.arrowIcon} />

        {/* Remove Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-outline" size={16} color={TEXT_MUTED} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SearchHistory = ({ navigation }) => {
  const { userId } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSearchHistory = async () => {
    try {
      const data = await GetSearchHistoryAPI(userId);
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSearchHistory();
    }
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSearchHistory();
  }, [userId]);

  const handleRemove = (item, index) => {
    setHistory((prev) => prev.filter((h, i) => (h.id ?? i) !== (item.id ?? index)));
    // TODO: Call API to remove individual item
  };

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert("Clear Search Log", "Are you sure you want to remove all search queries?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          setHistory([]);
          // TODO: Call API to clear all history
        },
      },
    ]);
  };

  const handleSearchAgain = (term) => {
    if (navigation) {
      navigation.navigate("Search", { query: term });
    }
  };

  const renderItem = ({ item, index }) => (
    <SearchCard
      item={item}
      onPress={() => handleSearchAgain(item.search_term)}
      onRemove={() => handleRemove(item, index)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={ACCENT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_COLOR} />

      {/* Screen Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.headerSubtitle}>SEARCH ARCHIVE</Text>
          <View style={styles.headerTitleRow}>
            <Text style={styles.topBarTitle}>Recent Queries</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{history.length}</Text>
            </View>
          </View>
        </View>

 
      </View>

      <FlatList
        data={history}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT_PRIMARY}
            colors={[ACCENT_PRIMARY]}
          />
        }
        contentContainerStyle={[
          styles.listContainer,
          history.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
              <Ionicons name="search-outline" size={26} color={ACCENT_PRIMARY} />
            </View>
            <Text style={styles.emptyTitle}>Log Empty</Text>
            <Text style={styles.emptySubtitle}>
              Your search history is clear. Future search queries will be archived here.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG_COLOR,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
    gap: 8,
  },
  topBarTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: ACCENT_SOFT,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: ACCENT_PRIMARY,
  },
  clearBtn: {
    paddingBottom: 4,
  },
  clearAllText: {
    color: ACCENT_PRIMARY,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: ACCENT_SOFT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  searchText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
    lineHeight: 18,
  },
  date: {
    marginTop: 2,
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "400",
  },
  arrowIcon: {
    transform: [{ rotate: "135deg" }],
    marginRight: 12,
    opacity: 0.5,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 36,
  },
  emptyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT_SOFT,
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
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 19,
  },
});