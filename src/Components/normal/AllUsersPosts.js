import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
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
  RefreshControl,
  Alert
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import {
  HeartStrokeIcon,
  Union,
  heart11,
  HeartIcon,
  Subtract,
  useraccount1,
} from "../../assets2/Icons/allIcons";
import {
  blank,
  Ellips1,
  Ellipse2,
  Ellipse5,
  post,
  User,
} from "../../assets2/Images/allImages";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AllPostsFetch from "../../Fetch_API/AllPostsFetch";
import { useDispatch, useSelector } from "react-redux";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { AuthContext } from "../../Context/AuthContext";
import UserFollowingPost from "../../Fetch_API/UserFollowingPost";
import {
  setCommentId,
  setPostId,
  setPostSpUserId,
  setVideoAuthorUserId,
} from "../../redux/action";
import { SET_POST_ID, SET_POST_SP_USER_ID } from "../../redux/constants";
import LikeVideoPosts from "../../Fetch_API/LikeVideoPosts";
import NoOfVideoLikesFetch from "../../Fetch_API/NoOfVideoLikesFetch";
import TotalLikesData from "../../Fetch_API/TotalLikesData";
import { setCommentText, setCommentVideoId } from "../../redux/action";
import PostComments from "../../Fetch_API/PostComments";
import SingleVideoComments from "../../Fetch_API/SingleVideoComments";
import { setCommentCurrentUserId } from "../../redux/action";
import { setCurrentUserCommentStatus } from "../../redux/action";
import CommentLike from "../../Fetch_API/CommentLike";
import PostReplyComment from "../../Fetch_API/PostReplyComment";
import VideoItem from "../../Navigation/Top/Components-top/VideoItem";
import AllUsersPostsFetch from "../../Fetch_API/AllUsersPostsFetch";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {  useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import AdItem from "../../Navigation/Top/Components-top/AdItem";
import TrackAdViewAPI from "../../Fetch_API/TrackAdViewAPI"; // adjust path
import SinglePostFetch from "../../Fetch_API/SinglePostFetch";
export default function AllUsersPosts(props) {
  const isFocused = useIsFocused();
  const [imageSources, setImageSources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([
    // {Video_author_name: "bibhuti9", post_id: 1334, profile_img: "https://myfame.com/wp-content/uploads/2024/07/flower-3115353_640-20.jpg", video_author_id: "51", video_comments: 0, video_likes: 0, video_links: [], video_location: "mohali", video_tag_people: [], video_title: "Testing 1232652652652362363498", video_url: "https://myfame.com/wp-content/uploads/2024/07/output_669a0a8530ea5.mp4"},
    // {Video_author_name: "bibhuti9", post_id: 1334, profile_img: "https://myfame.com/wp-content/uploads/2024/07/flower-3115353_640-20.jpg", video_author_id: "51", video_comments: 0, video_likes: 0, video_links: [], video_location: "mohali", video_tag_people: [], video_title: "Testing 1232652652652362363498", video_url: "https://myfame.com/wp-content/uploads/2024/07/output_669a0a8530ea5.mp4"}
  ]);
 let BottomTabHeight = 0;

try {
  BottomTabHeight = useBottomTabBarHeight();
} catch (e) {
  BottomTabHeight = 0;
}
  const ScreenHeight = Dimensions.get("window").height - BottomTabHeight;
  const WindowHeight = Dimensions.get("window").height;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const profileData = useSelector((state) => state.profile.profileData);
  const dispatch = useDispatch();
  const { userId } = useContext(AuthContext);
  const [inputText, setInputText] = useState("");
  const commentStatus = useSelector(
    (state) => state.currentUserCommentStatus.status
  );
  const [comment_current_id, setComment_current_id] = useState(null);
  const [isHeart, setIsHeart] = useState(commentStatus);
  const [isReplying, setIsReplying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [repliesVisibility, setRepliesVisibility] = useState({});
  const [pid, setPid] = useState(null)
  const { height: windowHeight } = Dimensions.get('window');
  const [refreshing, setRefreshing] = useState(false);
const postId = props.route?.params?.postId || null;
console.log("Loading Single Post:", postId);
 
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleReplies = (commentId) => {
    setRepliesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [commentId]: !prevVisibility[commentId],
    }));
  };

  const toggleImage = () => {
    setIsHeart(!isHeart);
  };

  const likeComments = async (item) => {
    if (item.current_user_comment_status)
      item.current_user_comment_status = false;
    else item.current_user_comment_status = true;
    try {
      const response = await CommentLike(); // Assuming SingleVideoComments needs postId as a parameter
      if (response && response.data) {
        // console.log("comment like successfully")
      } else {
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const cancelReply = () => {
    setIsReplying(false);
    dispatch(setCommentId(null));
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

   

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);



// Update your handleRefresh function to ensure API is called
const handleRefresh = useCallback(async () => {
  // console.log("🔄 Pull-to-refresh triggered");
  setRefreshing(true);
  
  // Force stop all videos before refresh
  setCurrentVideoIndex(null); // Clear current video
  
  try {
    if (profileData?.id) {
      // console.log("📱 Refreshing posts...");
      const data = await AllUsersPostsFetch(profileData.id);
      
      // console.log("✅ Refresh complete:", data.videos?.length || 0, "videos");
      
      // Update videos state
      setVideos(data.videos || []);
      setImageSources(Array(data.videos?.length || 0).fill(heart11));
      
      // Reset to first video after refresh with a small delay
      setTimeout(() => {
        if (data.videos && data.videos.length > 0) {
          setCurrentVideoIndex(data.videos[0].post_id);
          // console.log("🎬 Set currentVideoIndex to first video:", data.videos[0].post_id);
        }
      }, 500); // Delay to ensure components are mounted
    }
  } catch (error) {
    console.error("❌ Error refreshing:", error);
    Alert.alert("Refresh Failed", 
      "Failed to load new posts. Please check your connection and try again.",
      [{ text: "OK" }]
    );
  } finally {
    // Add a small delay before setting refreshing to false
    setTimeout(() => {
      setRefreshing(false);
      // console.log("🔄 Refresh complete, refreshing state set to false");
    }, 300);
  }
}, [profileData?.id]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     SingleVideoComments();
  //   }, [])
  // );

  const handleTextInputChange = (text) => {
    setInputText(text);
  };

  const renderCommentItem = ({ item }) => {
    const {
      comment_id,
      child_comments,
      profile_img,
      comment_author,
      comment_content,
      current_user_comment_status,
    } = item;

    return (
      <View style={{ margin: 10 }}>
        <View style={styles.srctxt_md2}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {profile_img ? (
              <Image
                source={{ uri: profile_img }}
                style={{ width: 40, height: 40, borderRadius: 30 }}
              />
            ) : (
              <Image
                source={blank}
                style={{ width: 40, height: 40, borderRadius: 30 }}
              />
            )}
            <View style={{ width: "73%" }}>
              <View style={styles.comnt_bx}>
                <View>
                  <Text style={{ fontSize: 13, color: "#86878B" }}>
                    {comment_author}
                  </Text>
                  <Text style={styles.modalText}>{comment_content}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setComment_current_id(comment_id);
                      setInputText("@" + comment_author + " ");
                      setIsReplying(true);
                      dispatch(setCommentId(comment_id));
                      toggleVisibility();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#86878B",
                        marginTop: "-3%",
                      }}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setReplies((pre) => ({
                        ...pre,
                        [comment_id]: child_comments,
                      }));
                      toggleReplies(comment_id);
                    }}
                  >
                    <Text style={styles.replyButton}>
                      {repliesVisibility[comment_id]
                        ? "Hide Replies"
                        : "View Replies"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignItems: "center",
              width: "10%",
              justifyContent: "center",
            }}
            onPress={async () => {
              dispatch(
                setCurrentUserCommentStatus(item.current_user_comment_status)
              );
              // console.log(item.current_user_comment_status);
              dispatch(setPostSpUserId(profileData.id));
              dispatch(setCommentId(item.comment_id));
              likeComments(item);
              toggleImage();
            }}
          >
            <AntDesign
              name={item.current_user_comment_status ? "heart" : "hearto"}
              size={18}
              color={item.current_user_comment_status ? "red" : "grey"}
            />
          </TouchableOpacity>
        </View>
        {repliesVisibility[comment_id] && (
          <View style={styles.scrollInnerContent}>
            <FlatList
              data={replies[comment_id]}
              renderItem={renderRepliesItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </View>
    );
  };

  const renderRepliesItem = ({ item }) => {
    const { profile_img, comment_author, comment_content, comment_id,parent_id } = item;

    return (
      <View style={{ margin: 5, paddingLeft: "10%" }}>
        <View style={styles.srctxt_md2}>
          {profile_img ? (
            <Image
              source={{ uri: profile_img }}
              style={{ width: 15, height: 15, borderRadius: 30 }}
            />
          ) : (
            <Image
              source={blank}
              style={{ width: 15, height: 15, borderRadius: 30 }}
            />
          )}
          <View style={{ width: "73%" }}>
            <View style={styles.comnt_bx}>
              <View>
                <Text style={{ fontSize: 13, color: "#86878B" }}>
                  {comment_author}
                </Text>
                <Text style={styles.modalText}>{comment_content}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setComment_current_id(parent_id);
                    setInputText("@" + comment_author + " ");
                    setIsReplying(true);
                    dispatch(setCommentId(comment_id));
                    toggleVisibility();
                  }}
                >
                  <Text
                    style={{ fontSize: 13, color: "#86878B", marginTop: "-3%" }}
                  >
                    Reply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  
  const handleSaveComment = async () => {
    if (inputText.trim() === "") {
      // Show an alert or simply return to prevent posting an empty comment
      Alert.alert("Comment Error", "Please enter a comment before posting.");
      return;
    }
  
    dispatch(setCommentText(inputText));
    dispatch(setPostSpUserId(profileData.id));
  
    if (isReplying) {
      const newReply = {
        child_comments: [],
        comment_author: profileData.username,
        comment_content: inputText,
        comment_date: "now",
        comment_id: Math.floor(100000 + Math.random() * 900000).toString(),
        commented_user_id: userId,
        profile_img: profileData.profile_img,
      };
  
      const videoIndex = videos.findIndex((item) => item.post_id === pid);
      // console.log("Video Index:", videoIndex);
  
      if (videoIndex !== -1) {
        const updatedVideos = [...videos];
        const commentIndex = updatedVideos[videoIndex].video_comments.findIndex(
          (comment) => comment.comment_id.toString() === comment_current_id.toString()
        );
  
        // console.log("Comment Current ID:", comment_current_id);
        // console.log("Comment Index:", commentIndex);
  
        if (commentIndex !== -1) {
          const updatedComments = [...updatedVideos[videoIndex].video_comments];
          const updatedChildComments = updatedComments[commentIndex].child_comments || [];
  
          updatedChildComments.push(newReply);
          updatedComments[commentIndex] = {
            ...updatedComments[commentIndex],
            child_comments: updatedChildComments,
          };
  
          updatedVideos[videoIndex] = {
            ...updatedVideos[videoIndex],
            video_comments: updatedComments,
          };
  
          setVideos(updatedVideos);
        } else {
          console.error("Error: Comment not found for comment_current_id:", comment_current_id);
        }
      } else {
        console.error("Error: Video not found for post_id:", pid);
      }
  
      setReplies((prevReplies) => ({
        ...prevReplies,
        [comment_current_id]: [...(prevReplies[comment_current_id] || []), newReply],
      }));
  
      setInputText("");
      setIsReplying(false);
      dispatch(setCommentId(null));
    } else {
      setComments([
        ...comments,
        {
          child_comments: [],
          comment_author: profileData.username,
          comment_content: inputText,
          comment_id: Math.floor(100000 + Math.random() * 900000).toString(),
          comment_date: "now",
          commented_user_id: userId,
          profile_img: profileData.profile_img,
        },
      ]);
  
      const index = videos.findIndex((item) => item.post_id === pid);
      videos[index].video_comments_count = videos[index].video_comments_count + 1;
      videos[index].video_comments.push({
        child_comments: [],
        comment_author: profileData.username,
        comment_content: inputText,
        comment_id: Math.floor(100000 + Math.random() * 900000).toString(),
        comment_date: "now",
        commented_user_id: userId,
        profile_img: profileData.profile_img,
      });
  
      setInputText("");
      await PostComments();
    }
  };

  const handleLikePress = async (item) => {

    // console.log("OLD item : ",item)
 
    if (item.like_status) {
      item.like_status = false;
      item.video_likes = item.video_likes - 1;

    }
    else {
      item.like_status = true;
      item.video_likes = item.video_likes + 1
    }  
    toggleImage()
    // console.log("NEW ITEM : ",item)

    try {
      await LikeVideoPosts(dispatch);
    } catch (error) {
      console.error("Error in handleLikePress:", error);
      Alert.alert(
        "Error",
        "An error occurred while liking the video. Please try again."
      );
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("PROFILE DATA : ", profileData);
  //     const fetchVideos = async () => {
  //       setLoading(true);
  //       try {
  //         if (profileData && profileData.id) {
  //           const data = await AllUsersPostsFetch(profileData.id);
  //           setVideos(data.videos);
  //           setImageSources(Array(data.videos.length).fill(heart11));
  //         } else {
  //           setVideos([]);
  //         }
  //       } catch (error) {
  //         setError(error.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchVideos();
  //   }, [profileData])
  // );




  // Add this state to track if data has been loaded:
const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

// Use this useEffect instead (runs once when profileData is available):
useEffect(() => {
  if (profileData && profileData.id && !hasLoadedInitialData) {
    const fetchInitialVideos = async () => {
      setLoading(true);

      try {
        let data;

        if (postId) {
            console.log("Calling SinglePostFetch...");

          console.log("Loading Single Post:", postId);
          data = await SinglePostFetch(profileData.id, postId);
        } else {
          console.log("Loading All Posts");
            console.log("Calling AllUsersPostsFetch...");

          data = await AllUsersPostsFetch(profileData.id);
        }

        console.log("API Response:", data);
console.log("API Response:", JSON.stringify(data, null, 2));
        setVideos(data.videos || []);
        setImageSources(Array(data.videos?.length || 0).fill(heart11));
        setHasLoadedInitialData(true);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialVideos();
  }
}, [profileData]);

// Optional: Add a manual refresh function if you want to allow refreshing
const refreshPosts = useCallback(async () => {
  if (!profileData?.id) return;
  
  setLoading(true);
  try {
    // console.log("🔄 Manual refresh started...");
    const data = await AllUsersPostsFetch(profileData.id);
    setVideos(data.videos || []);
    setImageSources(Array(data.videos?.length || 0).fill(heart11));
  } catch (error) {
    console.error("❌ Error refreshing videos:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, [profileData]);

  const extractSite = (domain) => {
  if (!domain) return "unknown";

  if (domain.includes("myfame")) return "myfame";
  if (domain.includes("rofhub")) return "rofhub";

  return "unknown";
};


const onViewableItemsChanged = useCallback(
  async ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      // console.log("🔍 Visible item received:", visibleItem?.post_id);
      // console.log("🔍 Checking item properties:");
      // console.log("- Item type:", visibleItem?.type);
      // console.log("- Has influencer_ad_data:", !!visibleItem?.influencer_ad_data);
      // console.log("- influencer_ad_data type:", visibleItem?.influencer_ad_data?.type);
      // console.log("- post_id:", visibleItem?.post_id);
      // console.log("- video_author_id:", visibleItem?.video_author_id);
      
      setCurrentVideoIndex(visibleItem.post_id);

      // Check for both types of ads
      const isDirectAd = visibleItem?.type === "ad";
      const hasInfluencerAd = visibleItem?.influencer_ad_data?.type === "ad";
      
      // console.log("📊 Ad Detection Results:");
      // console.log("- isDirectAd (type === 'ad'):", isDirectAd);
      // console.log("- hasInfluencerAd (influencer_ad_data?.type === 'ad'):", hasInfluencerAd);
      
      if (isDirectAd || hasInfluencerAd) {
        // console.log("🎯 AD DETECTED! Processing...");

        let adDataToTrack;
        let whichsite;
        let userIdToPass = userId;
        let adId;
        let postId;
        let throughInfluencer = 0; // Default to 0 for direct ads

        if (isDirectAd) {
          // console.log("🚀 Processing DIRECT AD (type === 'ad')");
          // For direct ad posts
          adDataToTrack = visibleItem;
          // console.log("📋 Direct ad which_site:", visibleItem.which_site);
          // console.log("📋 Direct ad ad_creation_domain:", visibleItem.ad_creation_domain);
          
          // Use which_site directly if available, otherwise extract from domain
          whichsite = visibleItem.which_site || extractSite(visibleItem.ad_creation_domain);
          // console.log("🌐 Final whichsite:", whichsite);
          
          adId = visibleItem.ad_id;
          postId = visibleItem.post_id;
          throughInfluencer = 0; // 0 for direct ads (no influencer)
          
          // console.log("📝 Direct Ad Details:");
          // console.log("- ad_id:", adId);
          // console.log("- post_id:", postId);
          // console.log("- through_influencer:", throughInfluencer, "(0 = direct ad)");
        } 
        
        if (hasInfluencerAd) {
          // console.log("🤝 Processing INFLUENCER AD (influencer_ad_data)");
          // For normal posts with influencer ad data
          adDataToTrack = visibleItem.influencer_ad_data;
          // console.log("📋 Influencer ad which_site:", adDataToTrack.which_site);
          // console.log("📋 Influencer ad ad_creation_domain:", adDataToTrack.ad_creation_domain);
          
          // Use which_site directly if available, otherwise extract from domain
          whichsite = adDataToTrack.which_site || extractSite(adDataToTrack.ad_creation_domain);
          // console.log("🌐 Final whichsite:", whichsite);
          
          adId = adDataToTrack.ad_id;
          postId = adDataToTrack.post_id || visibleItem.post_id;
          
          // Pass the influencer's user ID as through_influencer
          throughInfluencer = visibleItem.video_author_id || 0;
          
          // console.log("📝 Influencer Ad Details:");
          // console.log("- ad_id:", adId);
          // console.log("- post_id:", postId);
          // console.log("- video_author_id (influencer ID):", visibleItem.video_author_id);
          // console.log("- through_influencer (influencer user ID):", throughInfluencer);
        }

        // console.log("👤 User ID Processing:");
        // console.log("- Current userId:", userId);
        // console.log("- ad_creation_domain:", adDataToTrack?.ad_creation_domain);
        
        // Determine which user ID to pass based on whichsite
        if (whichsite === 'myfame' || whichsite === 'both_site') {
          userIdToPass = adDataToTrack?.ad_data?.myfame_user_id || userId;
          // console.log("🏷️ Using myfame_user_id:", adDataToTrack?.ad_data?.myfame_user_id);
        } else if (whichsite === 'rofhub') {
          userIdToPass = adDataToTrack?.ad_data?.rofhub_user_id || userId;
          // console.log("🏷️ Using rofhub_user_id:", adDataToTrack?.ad_data?.rofhub_user_id);
        }
        
        // console.log("✅ Final user_id to pass:", userIdToPass);

        // console.log("📤 Preparing API Call Parameters:");
        // console.log("- adId:", adId);
        // console.log("- userIdToPass:", userIdToPass);
        // console.log("- whichsite:", whichsite);
        // console.log("- postId:", postId);
        // console.log("- throughInfluencer (influencer user ID):", throughInfluencer);

        // The API expects "myfame" or "rofhub", not "both_site"
        // If whichsite is "both_site", we need to decide which one to use
        let apiWhichsite = whichsite;
        if (whichsite === 'both_site') {
          // For both_site, we should use the primary site based on domain
          if (adDataToTrack?.ad_creation_domain?.includes('myfame')) {
            apiWhichsite = 'myfame';
            // console.log("🔄 Converting both_site to myfame for API");
          } else if (adDataToTrack?.ad_creation_domain?.includes('rofhub')) {
            apiWhichsite = 'rofhub';
            // console.log("🔄 Converting both_site to rofhub for API");
          }
        }

        // console.log("📤 Final API Parameters:");
        // console.log("- adId:", adId);
        // console.log("- userIdToPass:", userIdToPass);
        // console.log("- apiWhichsite (for API):", apiWhichsite);
        // console.log("- postId:", postId);
        // console.log("- throughInfluencer:", throughInfluencer);

        // Check if this user has already viewed this ad (client-side check)
        const trackingKey = `ad_${adId}_user_${userId}_site_${apiWhichsite}`;
        const alreadyTracked = localStorage.getItem(trackingKey);
        
        if (alreadyTracked) {
          // console.log("⏭️ Ad already tracked for this user, skipping API call");
          return;
        }

        try {
          // console.log("📡 Calling TrackAdViewAPI...");
          const response = await TrackAdViewAPI(
            adId,
            userIdToPass,
            apiWhichsite, // Use apiWhichsite instead of whichsite
            postId,
            throughInfluencer
          );
          
          // console.log("✅ Ad view tracked successfully!");
          // console.log("📥 API Response:", response);
          
          // Check response status
          if (response.status === 200) {
            // console.log("✅ API call successful with status 200");
            // Store in localStorage to prevent future API calls
            localStorage.setItem(trackingKey, 'true');
          } else {
            // console.log("⚠️ API returned non-200 status:", response.status);
            // console.log("Message:", response.message);
          }
          
        } catch (error) {
          // console.log("❌ Failed to track ad view!");
          // console.log("🔴 Error:", error);
          // console.log("🔴 Error message:", error.message);
        }
      } else {
        // console.log("❌ No ad detected in this item");
      }
      
      // console.log("=".repeat(50)); // Separator for readability
    }
  },
  [userId]
);

// Updated extractSite function that maps to API expectations




const viewabilityConfig = {
  itemVisiblePercentThreshold: 70,
};


  if (loading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color="#00A4FF" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      
<FlatList
  data={videos}
  renderItem={({ item, index }) => (
    item?.type === "ad" ? (
      <AdItem item={item} userId ={userId} />
    ) : (
      <VideoItem
        currentVideoIndex={currentVideoIndex}
        item={item}
        index={index}
        imageSources={imageSources}
        handleLikePress={handleLikePress}
        profileData={profileData}
        setModalVisible={setModalVisible}
        setComments={setComments}
        setPid={setPid}
        isFocused={isFocused}
                isRefreshing={refreshing} // Pass refreshing state
        key={`video_${item.post_id}_${refreshing}`} // Add key that changes on refresh
      />
    )
  )}
  pagingEnabled
  disableIntervalMomentum
  snapToInterval={windowHeight}
  snapToAlignment="start"
  decelerationRate="fast"
  keyExtractor={(item, index) => index.toString()}
  initialNumToRender={1}
  windowSize={3}
  onEndReachedThreshold={0.5}
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
  removeClippedSubviews
  showsVerticalScrollIndicator={false}


    refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={['#00A4FF']} // iOS: colors of the spinner
      tintColor="#00A4FF"   // iOS: color of the spinner
      progressBackgroundColor="#ffffff" // iOS: background color of the spinner
      progressViewOffset={50} // Offset for Android
    />
  }
/>







      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Entypo name="cross" size={26} color={'black'} />
            </TouchableOpacity>

            <View style={styles.scrollInnerContent}>
              <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>

     
            {isVisible && (
              <View style={styles.popupContainer}>
              <View style={styles.replyContainer}>
              <Text style={styles.popupText}>
                You are replying to this comment{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  toggleVisibility();
                  cancelReply();
                  setInputText("");
                  setComment_current_id(null);
                }}
              >
                <Text style={styles.buttonText2}>X</Text>
              </TouchableOpacity>
              </View>
            </View>
            )}

            <View style={[styles.container2]}>
              {profileData && profileData.profile_img ? (
                <Image
                  source={{ uri: profileData.profile_img }}
                  resizeMode="cover"
                  style={styles.image}
                />
              ) : (
                <Image
                  source={blank}
                  style={{ width: 40, height: 40, borderRadius: 30 }}
                />
              )}

              <TextInput
                style={styles.textInput}
                placeholder="Add a comment..."
                placeholderTextColor="#9F9F9F"
                onChangeText={handleTextInputChange}
                value={inputText}
                autoFocus={true}
                multiline={true}
              />

              <View style={[styles.container3]}>
                <TouchableOpacity onPress={handleSaveComment}>
                  <Image source={post} style={{ width: 37, height: 37 }} />
                </TouchableOpacity>
              </View>
            </View>
         
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#000",
  // },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: "30%",
  },
  image1_txt_mn: {
    marginTop: 0,
    alignItems: "center",
    marginTop: 30,
  },
  image1_txt: {
    fontWeight: "500",
    color: "white",
  },
  image_hrt: {
    // Add any other styles for the image here
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  modalContent: {
    backgroundColor: "#F5F5F4",
    height:'50%',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    padding: 10,
    paddingBottom:30
    // borderRadius: 10,
    // alignItems: "center",
    // width: "100%",
    // position: "absolute",
    // top: "20%",
    // height: "100%",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // paddingBottom: "65%",
  },
  srctxt_md2: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "100%",
    alignItems: "center",
    gap: 10,
  },
  modalText: {
    fontSize: 13,
    marginBottom: "5%",
    color: "#302E2E",
    fontWeight: "400",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#302E2E",
  },
  buttonText2: {
    fontSize: 15,
    fontWeight: "500",
    color: "#302E2E",
  },
  closeButton: {
    marginTop: 10,
    color: "black",
    fontSize: 25,
    paddingRight: "4%",
    marginLeft: "90%",
  },
  backgroundImage2: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollInnerContent: {
    gap: 28,
    marginTop: "5%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  comnt_bx: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "73%",
  },
  container2: {
    flexDirection:'row',
    backgroundColor:'#F5F5F4',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    paddingHorizontal:20,
    columnGap:10
  },
  container3: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textInput: {
    width: "70%",
    height: 45,
    paddingRight: 40,
    alignItems: "center",
  },
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
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  modalWrapper: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor:'#f5f5f5',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  replyContainer:{
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    columnGap:10,
    backgroundColor: "#f5f5f5",
    paddingHorizontal:10,
    marginBottom:10

  },
  popupText: {
    textAlign: "center",
    fontSize: 13,
  },
  textContent: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
  },
});
