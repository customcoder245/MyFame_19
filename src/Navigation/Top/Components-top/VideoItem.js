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
    const [state, setState] = useState(false);
    const [modalVisible, setModalVisible2] = useState(false);
    
    // Ad related states
    const [showAd, setShowAd] = useState(false);
    const [adDuration, setAdDuration] = useState(0);
    const [currentAdTime, setCurrentAdTime] = useState(0);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [adTimer, setAdTimer] = useState(null);
    const [adData, setAdData] = useState(null);
    const [isAdVideo, setIsAdVideo] = useState(false);
    
    // Check if this item has ad data
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



      const handleOpenDemoLink = async () => {
        const adId = ad?.id || item?.ad_id;
        const demoLink = ad?.website_link || "https://www.example.com";
      
        // Extract site from ad_creation_domain
        const domain = ad?.ad_creation_domain || item?.ad_creation_domain;
        const whichsite = extractSite(domain);
        const through_influencer = item.video_author_id
        // Determine which user ID to pass based on domain
        let userIdToPass = userId; // default fallback
        const adData = ad?.ad_data || item?.ad_data;
        
        if (domain?.startsWith('myfame')) {
          userIdToPass = adData?.myfame_user_id || userId;
        } else if (domain?.startsWith('rofhub_domain')) {
          userIdToPass = adData?.rofhub_user_id || userId;
        }
      
        try {
          await TrackAdClickAPI(adId, userIdToPass, whichsite , through_influencer);
          await Linking.openURL(demoLink);
        } catch (error) {
          console.error("Error handling ad click:", error);
        }
      };
    // Handles the video load start
    const handleLoadStart = () => {
      console.log("Loading started:", index);
      setIsLoading(true);
    };

    // Handles the video load completion
    const handleLoad = () => {
      console.log("Loaded video at index:", index);
      setIsLoading(false); // Hide loader
      startRotation();

      // ✅ Check if this post has an ad and show it
      if (hasAd && isFocused && currentVideoIndex === item.post_id) {
        console.log("📢 Found ad data, showing ad before video");
        showAdBeforeVideo();
      }
    };

    const showAdBeforeVideo = () => {
      const ad = item.influencer_ad_data;
      setAdData(ad);
      
      // Check if ad is video or image
      const mediaType = ad?.ad_data?.media_details?.[0]?.type || 'image';
      setIsAdVideo(mediaType === 'video');
      
      // Randomly select ad duration between 10-17 seconds
      const durations = [10, 12, 15, 17];
      const randomDuration = durations[Math.floor(Math.random() * durations.length)];
      setAdDuration(randomDuration);
      
      // Show the ad
      setShowAd(true);
      setCurrentAdTime(0);
      setShowCloseButton(false);
      
      // Start timer to show close button after 10 seconds (or earlier for shorter ads)
      const closeButtonTime = Math.min(10, randomDuration - 3); // Show close button 3 seconds before end or at 10s
      
      const timer = setInterval(() => {
        setCurrentAdTime((prevTime) => {
          const newTime = prevTime + 1;
          
          // Show close button after specified time
          if (newTime >= closeButtonTime && !showCloseButton) {
            setShowCloseButton(true);
          }
          
          // End ad after duration
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

    const userblock = async (link)=> {
      try {
        await Blockeduser(userId, item.video_author_id);
        setModalVisible2(false)
      } catch (error) {
        console.log("error blocking user");
      }
    };

    const restrictVideo = async (link)=> {
      try {
        await RestrictedVideo(userId, item.post_id);
        setModalVisible2(false)
      } catch (error) {
        console.log("error blocking user");
      }
    };

    const reportContent = async (link)=> {
      try {
        await restrictContent (userId, item.post_id);
        setModalVisible2(false)
      } catch (error) {
        console.log("error blocking user");
      }
    };

    // Function to handle link press
    const handleLinkPress = (link) => {
      Linking.openURL(link).catch((err) => console.error("An error occurred", err));
    };

    // Clean up timer on unmount
    useEffect(() => {
      return () => {
        if (adTimer) {
          clearInterval(adTimer);
        }
      };
    }, [adTimer]);

    // Animate progress bar
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

    return (
      <Pressable onPress={() => setState(!state)} style={styles.videoContainer}>
        {/* Main Video */}
        <Video
          resizeMode="stretch"
          style={styles.video}
          source={{ uri: item.video_url }}
          paused={showAd || currentVideoIndex !== item.post_id || !isFocused || state}
          repeat={true}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          onScrollToIndexFailed={() => alert("no such index")}
          onScrollEndDrag={() => (scrollEnded.current = true)}
        />

        {/* Ad Overlay */}
        {showAd && adData && (
          <View style={styles.adOverlay}>
            {/* Ad Header with Close Button */}
            <View style={styles.adHeader}>

                            {/* Close Button - Only show after specified time */}
              {showCloseButton && (
                <TouchableOpacity 
                  style={styles.adCloseButton}
                  onPress={skipAd}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={styles.adLabel}>Ad</Text>
              
              {/* Ad Timer/Progress Bar */}
              <View style={styles.adTimerContainer}>
                <View style={styles.adTimerBackground}>
                  <Animated.View 
                    style={[
                      styles.adTimerProgress, 
                      { width: progressWidth }
                    ]} 
                  />
                </View>
                <Text style={styles.adTimerText}>
                  {adDuration - currentAdTime}s
                </Text>
              </View>
              

            </View>
            
            {/* Ad Content - Video or Image */}
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
              
              {/* Ad Info Overlay */}
              <View style={styles.adInfoOverlay}>
                <View style={styles.adInfoContent}>
                  {/* Ad Title */}
                  <Text style={styles.adTitle} numberOfLines={2}>
                    {adData.video_title || adData.ad_data?.description || "Advertisement"}
                  </Text>
                  
                  {/* Ad Description */}
                  {adData.ad_data?.description && (
                    <Text style={styles.adDescription} numberOfLines={3}>
                      {adData.ad_data.description}
                    </Text>
                  )}
                  
                  {/* Ad Price/Category */}
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
                        <Text style={styles.adDetailText}>
                          {adData.ad_data.days_remaining} days left
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Ad Stats */}
                  <View style={styles.adStats}>
                    <View style={styles.adStat}>
                      <Ionicons name="eye-outline" size={14} color="#ccc" />
                      <Text style={styles.adStatText}>
                        {adData.ad_data?.total_views || 0} views
                      </Text>
                    </View>
                    
                    <View style={styles.adStat}>
                      <Ionicons name="business-outline" size={14} color="#ccc" />
                      <Text style={styles.adStatText}>
                        {adData.ad_data?.rofhub_user_email || "Sponsored"}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Call to Action Button */}
                  {adData.ad_data?.["ad-url"] && (
                    <TouchableOpacity 
                      style={styles.adActionButton}
     onPress={handleOpenDemoLink}                    >
                      <Text style={styles.adActionButtonText}>Visit Website</Text>
                      <Ionicons name="open-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            
            {/* Skip Ad Button (shown at bottom) */}
            {/* <View style={styles.adSkipContainer}>
              <Text style={styles.adSkipText}>
                Ad ends in {adDuration - currentAdTime} seconds
              </Text>
              {showCloseButton && (
                <TouchableOpacity 
                  style={styles.adSkipButton}
                  onPress={skipAd}
                >
                  <Text style={styles.adSkipButtonText}>Skip Ad</Text>
                </TouchableOpacity>
              )}
            </View> */}
          </View>
        )}

        {isLoading && (
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <View style={styles.overlay}>
          {/* Icons and other components */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OtherUserProfileScreen", {
                authorId: item.video_author_id,
                item : item
              });
              dispatch(setVideoAuthorUserId(item.video_author_id));
            }}
          >
            {item.video_author_profile_img ? (
              <Image
                source={{ uri: item.video_author_profile_img }}
                style={styles.profileImage}
              />
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
                navigation.navigate("LikedUsersScreen" ,{ videoid: item.post_id });
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
              console.log("postId : ", item);
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
                      console.log('Shared with activity type:', result.activityType);
                    } else {
                      console.log('Shared successfully!');
                    }
                  } else if (result.action === Share.dismissedAction) {
                    console.log('Sharing dismissed');
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

          <TouchableOpacity
            style={{ marginTop: 25 }}
            onPress={() => setModalVisible2(true)}
          >
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
            <Text style={styles.bottomLeftText}>
              @{item.Video_author_name}
            </Text>
          ) : (
            <Text style={styles.bottomLeftText}>@{item.video_username}</Text>
          )}
          
          {item.video_title ? (
            <Text style={styles.bottomdescription}>{item.video_title}</Text>
          ) : null}

          {videoLinks.length > 0 ? (
            <FlatList
              data={videoLinks}
              keyExtractor={(link, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.linkContainer}
                  onPress={() => handleLinkPress(item)}
                >
                  <Text style={styles.linkText}>{item}</Text>
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
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
                onPress={userblock}
              >
                <MaterialIcons name="block" size={28} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                  Block users
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                  marginLeft: 3,
                }}
                onPress={restrictVideo}
              >
                <Octicons name="stop" size={24} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                  Restrict this video to me 
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                  marginLeft: 3,
                }}
                onPress={reportContent}
              >
                <Octicons name="alert" size={24} color="red" />
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                  Report content
                </Text>
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
  adSkipContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  adSkipText: {
    color: '#ccc',
    fontSize: 14,
  },
  adSkipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adSkipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Existing Styles
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
    bottom:"6%",
    left:30,
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
    marginTop:12
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    borderRadius: 5,
    paddingHorizontal: 2,
    fontStyle: 'italic',
    fontSize:13
  },
});

export default VideoItem;