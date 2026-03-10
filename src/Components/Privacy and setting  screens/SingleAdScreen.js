import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
  FlatList,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

const SingleAdScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const ad = route.params?.ad || route.params?.ad_data || null;

  const [loading, setLoading] = useState(!ad);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    if (ad) setLoading(false);
  }, []);

  const mediaData = (() => {
    if (!ad) return [];
    const urls = Array.isArray(ad.media_urls) ? ad.media_urls : [];
    const featured =
      ad.featured_image && !urls.includes(ad.featured_image)
        ? [ad.featured_image]
        : [];
    return [...featured, ...urls].map((url) => ({
      url,
      type: /\.(mp4|mov|avi|webm|mkv)$/i.test(url) ? "video" : "image",
    }));
  })();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const renderMediaItem = ({ item }) => (
    <View style={styles.mediaItem}>
      {item.type === "video" ? (
        <Video source={{ uri: item.url }} style={styles.videoPlayer} controls />
      ) : (
        <Image source={{ uri: item.url }} style={styles.imagePlayer} />
      )}
    </View>
  );

  // Smooth active index change using viewability config
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setActiveIndex(index);

      // Scroll thumbnail list to center
      thumbRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // 0.5 centers the active thumbnail
      });
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Media Carousel */}
        <FlatList
          ref={scrollRef}
          horizontal
          pagingEnabled
          data={mediaData}
          renderItem={renderMediaItem}
          keyExtractor={(_, idx) => idx.toString()}
          showsHorizontalScrollIndicator={false}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
        />

        {/* Thumbnail Slider */}
        <FlatList
          ref={thumbRef}
          data={mediaData}
          horizontal
          keyExtractor={(_, idx) => idx.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailList}
          contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                scrollRef.current.scrollToOffset({
                  offset: index * screenWidth,
                  animated: true,
                });
                setActiveIndex(index);
              }}
              style={[
                styles.thumbnailWrapper,
                activeIndex === index && styles.activeThumbnailWrapper,
              ]}
            >
              {item.type === "video" ? (
                <View style={styles.videoThumbnail}>
                  <Image source={{ uri: item.url }} style={styles.thumbnailImage} />
                  <Icon
                    name="play-circle-outline"
                    size={20}
                    color="#FFF"
                    style={styles.playIcon}
                  />
                </View>
              ) : (
                <Image source={{ uri: item.url }} style={styles.thumbnailImage} />
              )}
            </TouchableOpacity>
          )}
        />

        {/* Rest of your content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{ad.title}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{ad.price}</Text>
            </View>
          </View>

          {/* Category & Status Chips */}
          <View style={styles.metaRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.chipText}>{ad.category}</Text>
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusText}>{ad.status}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{ad.description}</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { label: "Ad ID", value: ad.ad_id },
              { label: "Approval", value: ad.approval_status },
              { label: "Posted On", value: ad.created_at },
              { label: "Days Left", value: ad.days_remaining },
            ].map((stat, idx) => (
              <View key={idx} style={styles.statItem}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          {/* Contact Card */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Seller Contact</Text>
            <Text style={styles.contactValue}>{ad.contact_info}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Linking.openURL(`mailto:${ad.contact_info}`)}
        >
          <Icon name="chatbubble-ellipses-outline" size={20} color="#FFF" />
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default SingleAdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaItem: {
    width: screenWidth,
    height: 320,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  imagePlayer: { width: "100%", height: "100%", resizeMode: "cover" },
  videoPlayer: { width: "100%", height: "100%" },
  content: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#1E293B", flex: 1 },
  priceBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  priceText: { color: "#0284C7", fontWeight: "700", fontSize: 16 },
  metaRow: { flexDirection: "row", marginTop: 12 },
  categoryChip: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: { color: "#0284C7", fontSize: 13, fontWeight: "600" },
  statusChip: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#16A34A", fontSize: 13, fontWeight: "600" },
  descriptionBox: {
    marginTop: 22,
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  descriptionText: { fontSize: 16, color: "#374151", lineHeight: 24 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: { fontSize: 12, color: "#9CA3AF" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginTop: 4 },
  contactCard: {
    marginTop: 24,
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  contactTitle: { fontSize: 14, color: "#9CA3AF" },
  contactValue: { fontSize: 16, fontWeight: "600", marginTop: 4, color: "#1E293B" },
  actionButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  contactButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 24,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  contactButtonText: { color: "#FFF", marginLeft: 8, fontWeight: "600", fontSize: 16 },

  // Thumbnail styles
  thumbnailList: { height: 70 },
  thumbnailWrapper: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnailWrapper: {
    borderColor: "#3B82F6",
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 10,
  },
  videoThumbnail: {
    position: "relative",
  },
  playIcon: {
    position: "absolute",
    top: 20,
    left: 20,
  },
});
