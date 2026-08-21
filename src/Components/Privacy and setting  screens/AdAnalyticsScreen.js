import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ProgressBar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../Fetch_API/BaseURL";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AdAnalyticsScreen = ({ route }) => {
  const { ad_id, user_id } = route.params;
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState("total");
  const [availableSites, setAvailableSites] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const dropdownContentHeight = availableSites.length * 48;

  const fetchAdAnalytics = async () => {
    try {
      const response = await fetch(`${BASE_URL}/ads/v1/getAdAnalytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_id, user_id, include_detailed: true }),
      });

      const data = await response.json();

      if (data?.status === 200 && data?.data) {
        setAnalytics(data.data);

        const sites = [];
        if (data.data.site_based) {
          if (data.data.site_based.myfame) sites.push("myfame");
          if (data.data.site_based.rofhub) sites.push("rofhub");
          if (sites.length === 2) sites.push("both");
        }
        setAvailableSites(sites);

        if (data.data.site_based?.myfame) {
          setSelectedSite("myfame");
        } else if (data.data.site_based?.rofhub) {
          setSelectedSite("rofhub");
        } else {
          setSelectedSite("total");
        }
      } else {
        Alert.alert("Error", "Unable to fetch analytics data.");
        // console.log("Unexpected analytics response:", data);
      }
    } catch (error) {
      // console.log("Error fetching ad analytics:", error);
      Alert.alert("Network Error", "Failed to load ad analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdAnalytics();
  }, [ad_id, user_id]);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setDropdownVisible(false);
      });
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    toggleDropdown();
  };

  const getSiteLabel = () => {
    switch(selectedSite) {
      case "myfame": return "MyFame";
      case "rofhub": return "RofHub";
      case "total": return "Both Apps";
      default: return "Select App";
    }
  };

  const getSiteIcon = () => {
    switch(selectedSite) {
      case "myfame": return "phone-portrait-outline";
      case "rofhub": return "tablet-portrait-outline";
      case "total": return "apps-outline";
      default: return "ellipsis-horizontal-outline";
    }
  };

  // Animation values
  const dropdownScaleY = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00A4FF" />
        <Text style={{ marginTop: 10, color: "#003366" }}>Loading analytics...</Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: "#555" }}>No analytics data available.</Text>
      </View>
    );
  }

  let metrics = analytics.performance_metrics;
  if (selectedSite === "myfame" && analytics.site_based?.myfame) {
    metrics = analytics.site_based.myfame;
  } else if (selectedSite === "rofhub" && analytics.site_based?.rofhub) {
    metrics = analytics.site_based.rofhub;
  }

  const { views, clicks, engagement, costs } = metrics || {};
  const ctr = clicks?.click_through_rate
    ? parseFloat(clicks.click_through_rate.replace("%", ""))
    : 0;
  const cpc = costs?.cost_per_click || 0;
  const cpm = costs?.cost_per_1000_views || 0;
  const totalSpend = (costs?.spent_by_cpc || 0) + (costs?.spent_by_cpm || 0);
  const engagementRate = engagement?.engagement_rate || "0%";

  return (
    <LinearGradient
      colors={["#e6f7ff", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={true}
      >
        {/* Header with App Selector */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Icon name="stats-chart-outline" size={32} color="#0077b6" />
              <View style={styles.headerTextContainer}>
                <Text style={styles.header}>{analytics.title || "Ad Analytics Overview"}</Text>
                <Text style={styles.subHeader}>
                  Status: {analytics.approval_status} • Active {analytics.days_active} days
                </Text>
              </View>
            </View>
            
            {availableSites.length > 0 && (
              <View style={styles.selectorContainer}>
                <TouchableOpacity
                  style={[
                    styles.appSelectorButton,
                    dropdownVisible && styles.appSelectorButtonActive
                  ]}
                  onPress={toggleDropdown}
                  activeOpacity={0.7}
                >
                  <Icon name={getSiteIcon()} size={20} color="#0077b6" />
                  <Text style={styles.appSelectorText}>{getSiteLabel()}</Text>
                  <Icon 
                    name={dropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
                    size={16} 
                    color="#0077b6" 
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Rest of your content */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="eye-outline" size={26} color="#00A4FF" />
            <Text style={styles.statValue}>{views?.total_views || 0}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="flash-outline" size={26} color="#00A4FF" />
            <Text style={styles.statValue}>{clicks?.total_clicks || 0}</Text>
            <Text style={styles.statLabel}>Clicks</Text>
            <Text style={styles.statLabel}>Avg/User: {clicks?.average_clicks_per_user || 0}</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="people-outline" size={26} color="#00A4FF" />
            <Text style={styles.statValue}>{views?.unique_viewers || 0}</Text>
            <Text style={styles.statLabel}>Unique Viewers</Text>
          </View>
        </View>

        <View style={styles.spendCard}>
          <MaterialCommunityIcons name="cash-multiple" size={30} color="#0077b6" />
          <View>
            <Text style={styles.spendTitle}>Total Spend</Text>
            <Text style={styles.spendValue}>${totalSpend.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Click-Through Rate (CTR)</Text>
          <ProgressBar progress={ctr / 100} color="#00A4FF" style={styles.progressBar} />
          <Text style={styles.progressText}>{ctr.toFixed(2)}%</Text>
        </View>

        <Text style={styles.sectionTitle}>Detailed Metrics</Text>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Cost Per Click (CPC)</Text>
          <Text style={styles.metricValue}>${cpc.toFixed(2)}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Cost Per 1000 Impressions (CPM)</Text>
          <Text style={styles.metricValue}>${cpm.toFixed(2)}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Engagement Rate</Text>
          <Text style={styles.metricValue}>{engagementRate}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Performance Summary</Text>
          <Text style={styles.summaryText}>
            Your ad reached{" "}
            <Text style={styles.highlight}>{views?.unique_viewers || 0}</Text>{" "}
            unique users with a total of{" "}
            <Text style={styles.highlight}>{views?.total_views || 0}</Text>{" "}
            views. The average CTR is{" "}
            <Text style={styles.highlight}>{ctr.toFixed(2)}%</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* DROPDOWN AS SEPARATE ABSOLUTE VIEW - Not in ScrollView */}
      {dropdownVisible && (
        <Animated.View 
          style={[
            styles.dropdownOverlayContainer,
            {
              opacity: dropdownOpacity,
              transform: [
                { scaleY: dropdownScaleY }
              ],
              height: dropdownContentHeight,
              top: 80, // Adjust this based on your header height
              right: 20, // Same as the button position
            }
          ]}
        >
          <View style={styles.dropdownContent}>
            {availableSites.includes("myfame") && (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedSite === "myfame" && styles.dropdownItemSelected
                ]}
                onPress={() => handleSiteSelect("myfame")}
                activeOpacity={0.7}
              >
                <Icon name="phone-portrait-outline" size={18} color={selectedSite === "myfame" ? "#0077b6" : "#666"} />
                <View style={styles.dropdownItemTextContainer}>
                  <Text style={[
                    styles.dropdownItemText,
                    selectedSite === "myfame" && styles.dropdownItemTextSelected
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    MyFame
                  </Text>
                </View>
                {selectedSite === "myfame" && (
                  <Icon name="checkmark" size={18} color="#0077b6" />
                )}
              </TouchableOpacity>
            )}
            
            {availableSites.includes("rofhub") && (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedSite === "rofhub" && styles.dropdownItemSelected
                ]}
                onPress={() => handleSiteSelect("rofhub")}
                activeOpacity={0.7}
              >
                <Icon name="tablet-portrait-outline" size={18} color={selectedSite === "rofhub" ? "#0077b6" : "#666"} />
                <View style={styles.dropdownItemTextContainer}>
                  <Text style={[
                    styles.dropdownItemText,
                    selectedSite === "rofhub" && styles.dropdownItemTextSelected
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    RofHub
                  </Text>
                </View>
                {selectedSite === "rofhub" && (
                  <Icon name="checkmark" size={18} color="#0077b6" />
                )}
              </TouchableOpacity>
            )}
            
            {availableSites.includes("both") && (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedSite === "total" && styles.dropdownItemSelected,
                  styles.dropdownItemLast
                ]}
                onPress={() => handleSiteSelect("total")}
                activeOpacity={0.7}
              >
                <Icon name="apps-outline" size={18} color={selectedSite === "total" ? "#0077b6" : "#666"} />
                <View style={styles.dropdownItemTextContainer}>
                  <Text style={[
                    styles.dropdownItemText,
                    selectedSite === "total" && styles.dropdownItemTextSelected
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    Both Apps
                  </Text>
                </View>
                {selectedSite === "total" && (
                  <Icon name="checkmark" size={18} color="#0077b6" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scroll: { 
    padding: 20, 
    paddingBottom: 40, 
    flexGrow: 1 
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  headerContainer: { 
    marginBottom: 25 
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  header: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#003366", 
    marginTop: 2,
    lineHeight: 24,
  },
  subHeader: { 
    fontSize: 12, 
    color: "#555", 
    marginTop: 4,
    lineHeight: 16,
  },
  selectorContainer: {
    alignSelf: "flex-start",
    minWidth: 140,
  },
  appSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 182, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0, 119, 182, 0.15)",
    justifyContent: "space-between",
    minHeight: 44,
  },
  appSelectorButtonActive: {
    backgroundColor: "rgba(0, 119, 182, 0.15)",
    borderColor: "rgba(0, 119, 182, 0.3)",
  },
  appSelectorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0077b6",
    marginHorizontal: 8,
    flexShrink: 1,
    minWidth: 60,
    textAlign: 'center',
  },
  dropdownOverlayContainer: {
    position: "absolute",
    width: 140,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0, 119, 182, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    transformOrigin: "top",
    zIndex: 1000,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    backgroundColor: "white",
    height: 48,
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(0, 119, 182, 0.05)",
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    minHeight: 20,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  dropdownItemTextSelected: {
    color: "#0077b6",
    fontWeight: "600",
  },
  statsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 25 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: "rgba(255,255,255,0.95)", 
    marginHorizontal: 6, 
    borderRadius: 18, 
    paddingVertical: 18, 
    alignItems: "center" 
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#003366", 
    marginVertical: 5 
  },
  statLabel: { 
    fontSize: 13, 
    color: "#666", 
    fontWeight: "600" 
  },
  spendCard: { 
    backgroundColor: "#f0fbff", 
    borderRadius: 18, 
    padding: 18, 
    flexDirection: "row", 
    alignItems: "center", 
    columnGap: 15, 
    marginBottom: 25 
  },
  spendTitle: { 
    fontSize: 14, 
    color: "#555", 
    fontWeight: "600" 
  },
  spendValue: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#003366", 
    marginTop: 3 
  },
  progressContainer: { 
    backgroundColor: "rgba(255,255,255,0.95)", 
    borderRadius: 18, 
    padding: 18, 
    marginBottom: 30 
  },
  progressTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#003366", 
    marginBottom: 10 
  },
  progressBar: { 
    height: 10, 
    borderRadius: 10 
  },
  progressText: { 
    fontSize: 13, 
    color: "#0077b6", 
    marginTop: 6, 
    fontWeight: "600", 
    textAlign: "right" 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#003366", 
    marginBottom: 15 
  },
  metricCard: { 
    backgroundColor: "rgba(255,255,255,0.95)", 
    borderRadius: 16, 
    padding: 15, 
    marginBottom: 12 
  },
  metricLabel: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#004080" 
  },
  metricValue: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#0077b6", 
    marginTop: 5 
  },
  summaryCard: { 
    backgroundColor: "#f8fcff", 
    borderRadius: 18, 
    padding: 18, 
    marginTop: 25 
  },
  summaryTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#003366", 
    marginBottom: 10 
  },
  summaryText: { 
    fontSize: 14, 
    color: "#444", 
    lineHeight: 22 
  },
  highlight: { 
    color: "#0077b6", 
    fontWeight: "700" 
  },
});

export default AdAnalyticsScreen;