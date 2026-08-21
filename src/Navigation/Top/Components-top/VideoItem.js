import Video from "react-native-video";
import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  memo,
} from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
  TextInput,
  Platform,
  Keyboard,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Share,
  Button,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  HeartStrokeIcon,
  Union,
  heart11,
  HeartIcon,
  Subtract,
  useraccount1,
} from "../../../assets2/Icons/allIcons";
import {
  blank,
  Ellips1,
  Ellipse2,
  Ellipse5,
  post,
  User,
} from "../../../assets2/Images/allImages";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AllPostsFetch from "../../../Fetch_API/AllPostsFetch";
import { useDispatch, useSelector } from "react-redux";
import fetchProfileData from "../../../Fetch_API/fetchProfileData";
import { AuthContext } from "../../../Context/AuthContext";
import UserFollowingPost from "../../../Fetch_API/UserFollowingPost";
import {
  setCommentId,
  setPostId,
  setPostSpUserId,
  setVideoAuthorUserId,
} from "../../../redux/action";
import { SET_POST_ID, SET_POST_SP_USER_ID } from "../../../redux/constants";
import LikeVideoPosts from "../../../Fetch_API/LikeVideoPosts";
import NoOfVideoLikesFetch from "../../../Fetch_API/NoOfVideoLikesFetch";
import TotalLikesData from "../../../Fetch_API/TotalLikesData";
import { setCommentText, setCommentVideoId } from "../../../redux/action";
import PostComments from "../../../Fetch_API/PostComments";
import SingleVideoComments from "../../../Fetch_API/SingleVideoComments";
import { setCommentCurrentUserId } from "../../../redux/action";
import { setCurrentUserCommentStatus } from "../../../redux/action";
import CommentLike from "../../../Fetch_API/CommentLike";
import PostReplyComment from "../../../Fetch_API/PostReplyComment";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Blockeduser from "../../../Fetch_API/Blockeduser";
import RestrictedVideo from "../../../Fetch_API/restrictVideo";
import RestrictContent from "../../../Fetch_API/restrictContent";
import reportContent from "../../../Fetch_API/restrictContent";
import restrictContent from "../../../Fetch_API/restrictContent";
import TrackAdClickAPI from "../../../Fetch_API/TrackAdClickAPI";
import SaveWatchHistoryAPI from "../../../Fetch_API/SaveWatchHistoryAPI";
const VideoItem = memo(
  ({
    currentVideoIndex,
    item,
    index,
    imageSources,
    handleLikePress,
    profileData,
    setModalVisible,
    setComments,
    setPid,
    handleOpenBottomSheet,
    isFocused,
  }) => {
    const { userId } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
    const [state, setState] = useState(false);
    const [modalVisible, setModalVisible2] = useState(false);

    // ── Replay states ──────────────────────────────────────────────
    const [showReplay, setShowReplay] = useState(false);
    const [replayLoading, setReplayLoading] = useState(false); // small loader on replay tap
    const playCountRef = useRef(0);
    const mainVideoRef = useRef(null);
    const isReplayRef = useRef(false);
    const videoEndedRef = useRef(false); // tracks if video has naturally ended
    const replayAnim = useRef(new Animated.Value(0)).current;
    // ──────────────────────────────────────────────────────────────

    // Ad related states
    const [showAd, setShowAd] = useState(false);
    const [adDuration, setAdDuration] = useState(0);
    const [currentAdTime, setCurrentAdTime] = useState(0);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [adTimer, setAdTimer] = useState(null);
    const [adData, setAdData] = useState(null);
    const [isAdVideo, setIsAdVideo] = useState(false);

    const hasAd = item?.influencer_ad_data && Object.keys(item.influencer_ad_data).length > 0;
    const ad = item?.ad_data;
    const mediaList = ad?.media_details || [];
    const profileImg = item?.video_author_profile_img;
    const videoRefs = useRef([]);

    const extractSite = (domain) => {
      if (!domain) return "unknown";
      if (domain.includes("myfame")) return "myfame";
      if (domain.includes("rofhub")) return "rofhub";
      return "unknown";
    };
const watchHistorySavedRef = useRef(false);
    const handleOpenDemoLink = async () => {
      const adId = ad?.id || item?.ad_id;
      const demoLink = ad?.website_link || "https://www.example.com";
      const domain = ad?.ad_creation_domain || item?.ad_creation_domain;
      const whichsite = extractSite(domain);
      const through_influencer = item.video_author_id;
      let userIdToPass = userId;
      const adDataLocal = ad?.ad_data || item?.ad_data;

      if (domain?.startsWith('myfame')) {
        userIdToPass = adDataLocal?.myfame_user_id || userId;
      } else if (domain?.startsWith('rofhub_domain')) {
        userIdToPass = adDataLocal?.rofhub_user_id || userId;
      }

      try {
        await TrackAdClickAPI(adId, userIdToPass, whichsite, through_influencer);
        await Linking.openURL(demoLink);
      } catch (error) {
        console.error("Error handling ad click:", error);
      }
    };

    // ── Replay animation helpers ───────────────────────────────────
    const showReplayOverlay = () => {
      replayAnim.setValue(0);
      setShowReplay(true);
      Animated.spring(replayAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 6,
      }).start();
    };

    const hideReplayOverlay = (cb) => {
      Animated.timing(replayAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setShowReplay(false);
        if (cb) cb();
      });
    };
    // ──────────────────────────────────────────────────────────────

    const handleLoadStart = () => {
      // never show big grey loader on replay seek
      if (isReplayRef.current) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
    };

    const handleLoad = () => {
      isReplayRef.current = false;
      setIsLoading(false);
      startRotation();


      // Save watch history once per video
if (
  !watchHistorySavedRef.current &&
  isFocused &&
  currentVideoIndex === item.post_id
) {
  watchHistorySavedRef.current = true;

  SaveWatchHistoryAPI(userId, item.post_id)
    .then((res) => {
      console.log("✅ Watch history saved");
      console.log("Post ID:", item.post_id);
      console.log("User ID:", userId);
      console.log("Response:", res);
    })
    .catch((err) => {
      console.log("❌ Watch history failed");
      console.log(err);
    });
}

      if (hasAd && isFocused && currentVideoIndex === item.post_id) {
        showAdBeforeVideo();
      }
    };

    // called by Video when playback naturally reaches the end
const handleVideoEnd = () => {
  videoEndedRef.current = true;

  playCountRef.current += 1;

  // After 2 plays show replay button
  if (playCountRef.current >= 2) {
    setTimeout(() => {
      showReplayOverlay();
    }, 100);

    return;
  }

  // instant replay
  isReplayRef.current = true;

  setState(false);

  if (mainVideoRef.current) {
    mainVideoRef.current.seek(0);
  }
};

    // called when user readies to replay
    const handleReplay = () => {
      videoEndedRef.current = false;
      setReplayLoading(true); // show small spinner inside button

      hideReplayOverlay(() => {
        playCountRef.current = 0;
        setState(false);
        isReplayRef.current = true;

        if (mainVideoRef.current) {
          mainVideoRef.current.seek(0);
        }

        // hide the small loader after a brief moment — seek is near-instant on cached video
        setTimeout(() => {
          setReplayLoading(false);
        }, 400);
      });
    };

    // Reset when user scrolls to a different video
    useEffect(() => {
      playCountRef.current = 0;
      videoEndedRef.current = false;
      isReplayRef.current = false;
      replayAnim.setValue(0);
      setShowReplay(false);
      setReplayLoading(false);
        watchHistorySavedRef.current = false;

    }, [currentVideoIndex]);
    // ──────────────────────────────────────────────────────────────

    const showAdBeforeVideo = () => {
      const adItem = item.influencer_ad_data;
      setAdData(adItem);

      const mediaType = adItem?.ad_data?.media_details?.[0]?.type || 'image';
      setIsAdVideo(mediaType === 'video');

      const durations = [10, 12, 15, 17];
      const randomDuration = durations[Math.floor(Math.random() * durations.length)];
      setAdDuration(randomDuration);

      setShowAd(true);
      setCurrentAdTime(0);
      setShowCloseButton(false);

      const closeButtonTime = Math.min(10, randomDuration - 3);

      const timer = setInterval(() => {
        setCurrentAdTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= closeButtonTime && !showCloseButton) {
            setShowCloseButton(true);
          }
          if (newTime >= randomDuration) {
            clearInterval(timer);
            setShowAd(false);
            setAdTimer(null);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      setAdTimer(timer);
    };

    const skipAd = () => {
      if (adTimer) {
        clearInterval(adTimer);
        setAdTimer(null);
      }
      setShowAd(false);
      setCurrentAdTime(0);
      setShowCloseButton(false);
    };

    const rotateValue = useRef(new Animated.Value(0)).current;
    const adProgressAnim = useRef(new Animated.Value(0)).current;

    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    const userblock = async () => {
      try {
        await Blockeduser(userId, item.video_author_id);
        setModalVisible2(false);
      } catch (error) {
        // console.log("error blocking user");
      }
    };

    const restrictVideo = async () => {
      try {
        await RestrictedVideo(userId, item.post_id);
        setModalVisible2(false);
      } catch (error) {
        // console.log("error blocking user");
      }
    };

    const reportContent = async () => {
      try {
        await restrictContent(userId, item.post_id);
        setModalVisible2(false);
      } catch (error) {
        // console.log("error blocking user");
      }
    };

    const handleLinkPress = (link) => {
      Linking.openURL(link).catch((err) => console.error("An error occurred", err));
    };

    useEffect(() => {
      return () => {
        if (adTimer) clearInterval(adTimer);
      };
    }, [adTimer]);

    useEffect(() => {
      if (showAd) {
        Animated.timing(adProgressAnim, {
          toValue: 1,
          duration: adDuration * 1000,
          useNativeDriver: false,
        }).start();
      } else {
        adProgressAnim.setValue(0);
      }
    }, [showAd, adDuration]);

    const progressWidth = adProgressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    const rotateInterpolate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const rotateStyle = {
      transform: [{ rotate: rotateInterpolate }],
    };

    const videoLinks = item.video_links;

    // Whether video is actively playing (used for paused prop)
    // Key change: we do NOT add showReplay to paused — the video
    // has already ended naturally so it's stopped anyway.
    // We only pause for ads, manual tap, or wrong index.
    const isPaused =
      showAd ||
      currentVideoIndex !== item.post_id ||
      !isFocused ||
      state;

    return (
<Pressable
  onPress={() => {
    if (showReplay) return;
    setState(!state);
  }}
  style={styles.videoContainer}
  onLayout={(e) => {
    const { width, height } = e.nativeEvent.layout;
    setVideoSize({ width, height });
  }}
>
        {/* Main Video */}
        <Video
          ref={mainVideoRef}
          resizeMode="stretch"
          style={styles.video}
          source={{ uri: item.video_url }}
          paused={isPaused}
          repeat={false}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onEnd={handleVideoEnd}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          onScrollToIndexFailed={() => alert("no such index")}
          onScrollEndDrag={() => (scrollEnded.current = true)}
        />



{/* ── Text overlays ── */}
{videoSize.width > 0 &&
  item?.texts?.map((textItem, idx) => (
    <Text
      key={`text_${idx}`}
      pointerEvents="none"
      style={{
        position: "absolute",
        left: parseFloat(textItem.x) * videoSize.width,
        top: parseFloat(textItem.y) * videoSize.height,
        transform: [{ scale: parseFloat(textItem.scale) || 1 }],
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        maxWidth: videoSize.width * 0.7,
        zIndex: 999,
      }}
    >
      {textItem.text}
    </Text>
  ))}

  
{videoSize.width > 0 &&
  item?.stickers?.map((sticker, index) => (
    <Image
      key={`${sticker.id || index}`}
      source={{ uri: sticker.asset_url }}
      pointerEvents="none"
      resizeMode="contain"
      style={{
        position: "absolute",

        left:
          parseFloat(sticker.x) *
          videoSize.width,

        top:
          parseFloat(sticker.y) *
          videoSize.height,

        width:
          parseFloat(sticker.width) *
          videoSize.width,

        height:
          parseFloat(sticker.height) *
          videoSize.height,
      }}
    />
))}

        {/* ── Instagram-style Replay Overlay ── */}
        {showReplay && !showAd && (
          <Animated.View
            style={[
              styles.replayOverlay,
              {
                opacity: replayAnim,
                transform: [
                  {
                    scale: replayAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.88, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.replayButton}
              onPress={handleReplay}
              activeOpacity={0.8}
            >
              {/* Ring with icon OR small loader */}
              <View style={styles.replayRing}>
                {replayLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialCommunityIcons name="replay" size={38} color="#fff" />
                )}
              </View>
              <Text style={styles.replayText}>
                {replayLoading ? "Loading..." : "Watch againnnnn"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Ad Overlay */}
        {showAd && adData && (
          <View style={styles.adOverlay}>
            <View style={styles.adHeader}>
              {showCloseButton && (
                <TouchableOpacity style={styles.adCloseButton} onPress={skipAd}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={styles.adLabel}>Ad</Text>
              <View style={styles.adTimerContainer}>
                <View style={styles.adTimerBackground}>
                  <Animated.View style={[styles.adTimerProgress, { width: progressWidth }]} />
                </View>
                <Text style={styles.adTimerText}>{adDuration - currentAdTime}s</Text>
              </View>
            </View>

            <View style={styles.adContent}>
              {isAdVideo ? (
                <Video
                  source={{ uri: adData.ad_data?.featured_image || adData.video_url }}
                  style={styles.adMedia}
                  resizeMode="cover"
                  paused={false}
                  repeat={true}
                />
              ) : (
                <Image
                  source={{ uri: adData.ad_data?.featured_image || adData.thumbnail_url }}
                  style={styles.adMedia}
                  resizeMode="cover"
                />
              )}

              <View style={styles.adInfoOverlay}>
                <View style={styles.adInfoContent}>
                  <Text style={styles.adTitle} numberOfLines={2}>
                    {adData.video_title || adData.ad_data?.description || "Advertisement"}
                  </Text>

                  {adData.ad_data?.description && (
                    <Text style={styles.adDescription} numberOfLines={3}>
                      {adData.ad_data.description}
                    </Text>
                  )}

                  <View style={styles.adDetails}>
                    {adData.ad_data?.price && (
                      <View style={styles.adDetailItem}>
                        <MaterialIcons name="attach-money" size={16} color="#FFD700" />
                        <Text style={styles.adDetailText}>{adData.ad_data.price}</Text>
                      </View>
                    )}
                    {adData.ad_data?.category && (
                      <View style={styles.adDetailItem}>
                        <MaterialIcons name="category" size={16} color="#00BBF5" />
                        <Text style={styles.adDetailText}>{adData.ad_data.category}</Text>
                      </View>
                    )}
                    {adData.ad_data?.days_remaining !== undefined && (
                      <View style={styles.adDetailItem}>
                        <MaterialIcons name="timer" size={16} color="#4CAF50" />
                        <Text style={styles.adDetailText}>{adData.ad_data.days_remaining} days left</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.adStats}>
                    <View style={styles.adStat}>
                      <Ionicons name="eye-outline" size={14} color="#ccc" />
                      <Text style={styles.adStatText}>{adData.ad_data?.total_views || 0} views</Text>
                    </View>
                    <View style={styles.adStat}>
                      <Ionicons name="business-outline" size={14} color="#ccc" />
                      <Text style={styles.adStatText}>{adData.ad_data?.rofhub_user_email || "Sponsored"}</Text>
                    </View>
                  </View>

                  {adData.ad_data?.["ad-url"] && (
                    <TouchableOpacity style={styles.adActionButton} onPress={handleOpenDemoLink}>
                      <Text style={styles.adActionButtonText}>Visit Website</Text>
                      <Ionicons name="open-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OtherUserProfileScreen", {
                authorId: item.video_author_id,
                item: item,
              });
              dispatch(setVideoAuthorUserId(item.video_author_id));
            }}
          >
            {item.video_author_profile_img ? (
              <Image source={{ uri: item.video_author_profile_img }} style={styles.profileImage} />
            ) : (
              <Image source={blank} style={styles.profileImage} />
            )}
          </TouchableOpacity>

          <View style={styles.image1_txt_mn}>
            <TouchableOpacity
              onPress={() => {
                const postId = item.post_id;
                const postSpUserId = profileData.id;
                dispatch({ type: SET_POST_ID, payload: postId });
                dispatch({ type: SET_POST_SP_USER_ID, payload: postSpUserId });
                handleLikePress(item, postId, index);
              }}
            >
              {item.like_status ? (
                <Icon name="heart" size={32} color="red" />
              ) : (
                <Icon name="heart-o" size={32} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("LikedUsersScreen", { videoid: item.post_id });
              }}
            >
              <Text style={styles.image1_txt}>{item.video_likes}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              const commentCurrentUserId = profileData.id;
              const postId = item.post_id;
              setPid(postId);
              dispatch(setCommentVideoId(postId));
              dispatch(setCommentCurrentUserId(commentCurrentUserId));
              setComments(item.video_comments);
              setModalVisible(true);
            }}
          >
            <View style={styles.image1_txt_mn}>
              <SimpleLineIcons name="bubble" size={30.6} color="white" />
              <Text style={styles.image1_txt}>{item.video_comments_count}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.image1_txt_mn}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const result = await Share.share({
                    message: `Hope you will like this post from MyFame: ${item.video_url}`,
                    url: item.video_url,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      // console.log('Shared with activity type:', result.activityType);
                    } else {
                      // console.log('Shared successfully!');
                    }
                  } else if (result.action === Share.dismissedAction) {
                    // console.log('Sharing dismissed');
                  }
                } catch (error) {
                  Alert.alert('Error', error.message);
                }
              }}
            >
              <MaterialCommunityIcons name="share-outline" size={33} color="white" />
            </TouchableOpacity>
            <Text style={styles.image1_txt}>Share</Text>
          </View>

          <TouchableOpacity style={{ marginTop: 25 }} onPress={() => setModalVisible2(true)}>
            <Feather name="more-horizontal" size={24} color="white" />
          </TouchableOpacity>

          <View style={{ marginTop: 25 }}>
            <Animated.View style={[styles.backgroundImage2, rotateStyle]}>
              <ImageBackground source={Ellips1} style={styles.backgroundImage2}>
                <Image source={Ellipse2} style={styles.image_bck_img} />
              </ImageBackground>
            </Animated.View>
          </View>
        </View>

        <View style={styles.bottomLeftTextContainer}>
          {item.Video_author_name ? (
            <Text style={styles.bottomLeftText}>@{item.Video_author_name}</Text>
          ) : (
            <Text style={styles.bottomLeftText}>@{item.video_username}</Text>
          )}

          {item.video_title ? (
            <Text style={styles.bottomdescription}>{item.video_title}</Text>
          ) : null}

          {videoLinks.length > 0 ? (
            <FlatList
              data={videoLinks}
              keyExtractor={(link, idx) => idx.toString()}
              renderItem={({ item: linkItem }) => (
                <TouchableOpacity style={styles.linkContainer} onPress={() => handleLinkPress(linkItem)}>
                  <Text style={styles.linkText}>{linkItem}</Text>
                </TouchableOpacity>
              )}
              numColumns={2}
              contentContainerStyle={styles.linksContainer}
            />
          ) : null}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible2(false)}
          >
            <Pressable
              style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}
              onPress={() => setModalVisible2(false)}
            />
            <View
              style={{
                backgroundColor: "white",
                paddingBottom: 80,
                paddingHorizontal: 20,
                marginTop: "auto",
                paddingTop: 20,
                rowGap: 15,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}
                onPress={userblock}
              >
                <MaterialIcons name="block" size={28} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>Block users</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", columnGap: 10, marginLeft: 3 }}
                onPress={restrictVideo}
              >
                <Octicons name="stop" size={24} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>Restrict this video to me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", columnGap: 10, marginLeft: 3 }}
                onPress={reportContent}
              >
                <Octicons name="alert" size={24} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>Report content</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  videoContainer: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  // ── Instagram-style Replay Overlay ─────────────────────────────
  replayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  replayButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // ───────────────────────────────────────────────────────────────

  // Ad Overlay Styles
  adOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 50,
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  adLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 4,
  },
  adTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  adTimerBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginRight: 10,
  },
  adTimerProgress: {
    height: '100%',
    backgroundColor: '#00BBF5',
  },
  adTimerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
  },
  adCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  adContent: {
    flex: 1,
    position: 'relative',
  },
  adMedia: {
    width: '100%',
    height: '100%',
  },
  adInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    paddingBottom: 70,
  },
  adInfoContent: {
    maxWidth: '100%',
  },
  adTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  adDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 10,
  },
  adDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  adDetailText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  adStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  adStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adStatText: {
    color: '#ccc',
    fontSize: 12,
  },
  adActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BBF5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  adActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fullScreenLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: "30%",
    zIndex: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  backgroundImage2: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  image1_txt_mn: {
    marginTop: 0,
    alignItems: "center",
    marginTop: 25,
  },
  image1_txt: {
    fontWeight: "500",
    color: "white",
  },
  bottomLeftTextContainer: {
    position: "absolute",
    padding: 5,
    borderRadius: 5,
    width: 400,
    bottom: "6%",
    left: 30,
  },
  bottomLeftText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.9,
  },
  bottomdescription: {
    marginTop: "1.5%",
    color: "#D3D3D3",
    fontSize: 15,
    fontWeight: "530",
  },
  linksContainer: {
    padding: 3,
    justifyContent: "flex-start",
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  linkContainer: {
    borderRadius: 15,
    margin: 0,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    borderRadius: 5,
    paddingHorizontal: 2,
    fontStyle: 'italic',
    fontSize: 13,
  },
});

export default VideoItem;