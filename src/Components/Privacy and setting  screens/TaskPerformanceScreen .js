import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../Context/AuthContext";
import fetchAnalyticsAds from "../../Fetch_API/fetchAnalyticsAds"; // ✅ Changed to new function
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("window");

// Loader component
const Loader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#00BBF5" />
  </View>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: { color: "#10B981", bgColor: "#D1FAE5", icon: "checkmark-circle", label: "Approved" },
    pending: { color: "#F59E0B", bgColor: "#FEF3C7", icon: "time-outline", label: "Pending" },
    default: { color: "#6B7280", bgColor: "#F3F4F6", icon: "help-circle-outline", label: "Processing" }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
      <Icon name={config.icon} size={14} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

// Single ad card
const AdCard = ({ ad, navigation, userId, index }) => {
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return price.includes("₹") || price.includes("$") ? price : `₹${price}`;
  };

  return (
    <View style={styles.cardContainer}>
      {/* Card Header with gradient */}
      <LinearGradient
        colors={["#F0F9FF", "#E0F2FE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        {/* Title takes full width */}
        <View style={styles.titleSection}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {ad.title}
          </Text>
        </View>
      </LinearGradient>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {ad.created_at ? new Date(ad.created_at).toLocaleDateString() : "N/A"}
            </Text>
          </View>
          
          <View style={styles.priceSection}>
            <Text style={styles.cardPrice}>{formatPrice(ad.price)}</Text>
          </View>
          
          <View style={styles.statusSection}>
            <StatusBadge status={ad.approval_status} />
          </View>
        </View>

        {/* Analytics Button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AdAnalyticsScreen", {
              ad_id: ad.ad_id,
              user_id: userId,
            })
          }
          style={styles.analyticsButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00BBF5", "#0088CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyticsButtonGradient}
          >
            <Icon name="stats-chart-outline" size={20} color="#fff" />
            <Text style={styles.analyticsButtonText}>View Analytics</Text>
            <Icon name="chevron-forward-outline" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Screen
const TaskPerformanceScreen = ({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAds = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // ✅ Use the new fetchAnalyticsAds function
      const response = await dispatch(fetchAnalyticsAds(userId));

      if (response && Array.isArray(response)) {
        setActiveAds(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setActiveAds(response.data);
      } else {
        // console.log("Unknown response format from fetchAnalyticsAds:", response);
        setActiveAds([]);
      }
    } catch (err) {
      // console.log("Error fetching analytics ads:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAds();
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#00BBF5"]}
              tintColor="#00BBF5"
            />
          }
        >
          {activeAds.length > 0 ? (
            <View style={styles.adsContainer}>
              {activeAds.map((ad, index) => (
                <AdCard
                  key={ad.ad_id}
                  ad={ad}
                  navigation={navigation}
                  userId={userId}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="megaphone-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Approved Campaigns</Text>
              <Text style={styles.emptyDescription}>
                You don't have any approved advertising campaigns at the moment.
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Icon name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
  },
  adsContainer: {
    gap: 16,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  titleSection: {
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 24,
    width: "100%",
  },
  cardBody: {
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#64748B",
  },
  priceSection: {
    alignItems: "center",
    flex: 1,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#00BBF5",
  },
  statusSection: {
    alignItems: "flex-end",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  analyticsButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  analyticsButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  analyticsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BBF5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskPerformanceScreen;