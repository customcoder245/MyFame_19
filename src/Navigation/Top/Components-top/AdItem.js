import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Linking,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import TrackAdClickAPI from "../../../Fetch_API/TrackAdClickAPI";

const { width, height } = Dimensions.get("window");

const AdItem = ({ item, userId }) => {
  const ad = item?.ad_data;
  const mediaList = ad?.media_details || [];
  const profileImg = item?.video_author_profile_img;
  const videoRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(0);
const extractSite = (domain) => {
  if (!domain) return "unknown";

  if (domain.includes("myfame")) return "myfame";
  if (domain.includes("rofhub")) return "rofhub";

  return "unknown";
};

const handleOpenDemoLink = async () => {
  const adId = ad?.id || item?.ad_id;
  const demoLink = ad?.website_link || "https://www.example.com";

  // Extract site from ad_creation_domain
  const domain = ad?.ad_creation_domain || item?.ad_creation_domain;
  const whichsite = extractSite(domain);
  
  // Determine which user ID to pass based on domain
  let userIdToPass = userId; // default fallback
  const adData = ad?.ad_data || item?.ad_data;
  
  if (domain?.startsWith('myfame')) {
    userIdToPass = adData?.myfame_user_id || userId;
  } else if (domain?.startsWith('rofhub_domain')) {
    userIdToPass = adData?.rofhub_user_id || userId;
  }

  try {
    await TrackAdClickAPI(adId, userIdToPass, whichsite);
    await Linking.openURL(demoLink);
  } catch (error) {
    console.error("Error handling ad click:", error);
  }
};

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);

      videoRefs.current.forEach((v, i) => {
        if (v) i === index ? v.playAsync() : v.pauseAsync();
      });
    }
  };

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };

  const renderMediaItem = ({ item, index }) => {
    const isVideo = item.mime_type?.includes("video");

    return (
      <View style={styles.mediaContainer}>
        {isVideo ? (
          <Video
            ref={(ref) => (videoRefs.current[index] = ref)}
            source={{ uri: item.url }}
            style={styles.media}
            resizeMode="cover"
            isLooping
            shouldPlay={index === currentIndex}
          />
        ) : (
          <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* TOP THUMBNAILS */}
{/* TOP THUMBNAILS */}
<View style={styles.thumbnailRow}>
  {mediaList.map((m, i) => {
    const isVideo = m.mime_type?.includes("video");

    return (
      <TouchableOpacity key={i} onPress={() => setCurrentIndex(i)}>
        {isVideo ? (
          <Video
            source={{ uri: m.url }}
            style={[
              styles.thumbnail,
              { borderColor: currentIndex === i ? "#fff" : "transparent" },
            ]}
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted
          />
        ) : (
          <Image
            source={{ uri: m.url }}
            style={[
              styles.thumbnail,
              { borderColor: currentIndex === i ? "#fff" : "transparent" },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  })}
</View>


      {/* FULLSCREEN BACKGROUND MEDIA */}
      <FlatList
        data={mediaList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMediaItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        style={{ position: "absolute" }}
      />

      {/* INFO SECTION */}
      <View style={styles.infoContainer}>
        <View style={styles.profileRow}>
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={styles.profileImg} />
          ) : (
            <Ionicons name="person-circle-outline" size={36} color="#bbb" />
          )}
        </View>
<Text style={{position:"absolute", right:10 , top:10 , color:"white"}}>Sponsored</Text>
        <Text style={styles.title}>{item.video_title}</Text>
        <Text style={styles.description}>{ad?.description}</Text>
        <Text style={styles.category}>Category: {ad?.category}</Text>
        <Text style={styles.contact}>Contact: {ad?.contact_info}</Text>
        <Text style={styles.price}>{ad?.price}</Text>
      </View>

      {/* VISIT BUTTON */}
      <TouchableOpacity
        style={styles.bottomTab}
        onPress={handleOpenDemoLink}
        activeOpacity={0.8}
      >
        <Ionicons name="link-outline" size={20} color="#fff" />
        <Text style={styles.bottomTabText}>Visit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#000",
  },

  /* FIXED FULLSCREEN — NO BLACK AREAS */
  mediaContainer: {
    width,
    height,
  },
  media: {
    width: "100%",
    height: "100%",
  },

  /* THUMBNAIL ROW */
  thumbnailRow: {
    position: "absolute",
    top: 40,
    left: 10,
    flexDirection: "row",
    zIndex: 10,
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 2,
  },

  infoContainer: {
    position: "absolute",
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profileImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
  username: { color: "#fff", fontWeight: "700", fontSize: 16 },
  title: { fontSize: 18, color: "#fff", fontWeight: "600", marginBottom: 4 },
  description: { fontSize: 14, color: "#ddd", marginBottom: 4 },
  category: { fontSize: 12, color: "#ccc", marginBottom: 2 },
  contact: { fontSize: 12, color: "#fff", marginBottom: 4 },
  price: { fontSize: 16, color: "#00FFB3", fontWeight: "700" },

  bottomTab: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#00A4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  bottomTabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AdItem;
