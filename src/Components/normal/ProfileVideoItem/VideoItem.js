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
  Alert,
  Pressable,
  Linking,
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
import restrictContent from "../../../Fetch_API/restrictContent";
import SaveWatchHistoryAPI from "../../../Fetch_API/SaveWatchHistoryAPI";
const VideoItem2 = memo(({   

  currentVideoIndex,
  item,
  index,
  handleLikePress,
  profileData,
  setComments,
  setPid,
  setModalVisible,
  toggleImage,
isFocused }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisibleState] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [state, setState] = useState(false);
  const [modalVisible, setModalVisible2] = useState(false);
  const { userId } = useContext(AuthContext);
 
  // Handles the video load start
  const handleLoadStart = () => {
    // console.log("Loading started : ", index);
    setIsLoading(true); // Show pagination
  };


  const [videoSize, setVideoSize] = useState({
  width: 0,
  height: 0,
});
const watchHistorySavedRef = useRef(false);
  const userblock = async (link) => {
    try {
      await Blockeduser(userId, item.video_author_id);
      setModalVisible2(false)
    } catch (error) {
      // console.log("error blocking user");
    }
  
  };
  const restrictVideo = async (link) => {
    try {
      await RestrictedVideo(userId, item.post_id);
      setModalVisible2(false)
    } catch (error) {
      console.log("error blocking user");
    }
  };
  
  const reportContent = async (link) => {
    try {
      await restrictContent(userId, item.post_id);
      setModalVisible2(false)
    } catch (error) {
      // console.log("error blocking user");
    }
  };
 
  // Handles the video load completion
const handleLoad = () => {
  setIsLoading(false);
  startRotation();

  if (
    userId &&
    !watchHistorySavedRef.current &&
    isFocused &&
    index === currentVideoIndex
  ) {
    watchHistorySavedRef.current = true;

    SaveWatchHistoryAPI(userId, item.post_id)
      .then((response) => {
        console.log("✅ Watch History Saved");
        console.log("User ID:", userId);
        console.log("Post ID:", item.post_id);
        console.log(response);
      })
      .catch((error) => {
        console.log("❌ Watch History Error");
        console.log(error);
      });
  }
};

  useEffect(() => {
  watchHistorySavedRef.current = false;
}, [currentVideoIndex]);


  useEffect(() => {
  console.log(
    "POST ID:",
    item.post_id,
    "STICKERS:",
    item.stickers
  );
}, []);

  const rotateValue = useRef(new Animated.Value(0)).current; // Reference to rotation value

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 4000, // Adjust this for speed
        easing: Easing.linear, // Smooth linear rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  // Interpolating the rotation value into a degree
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const showCustomAlert = (message) => {
    setModalMessage(message);
    setModalVisibleState(true);
  };

  const handleCloseModal = () => {
    setModalVisibleState(false);
  };

  const videoLinks = item.video_links;

  // Function to handle link press
const handleLinkPress = (link) => {
Linking.openURL(link).catch((err) => console.error("An error occurred", err));
};

// console.log("index : ",index,currentVideoIndex !== index|| !isFocused || state)

  return (
<View
  style={styles.videoContainer}
  onLayout={(e) => {
    const { width, height } = e.nativeEvent.layout;
    setVideoSize({ width, height });
  }}
>
    <Video
      resizeMode="stretch"
      style={styles.video}
      source={{ uri: item.video_url }}
      paused={index !== currentVideoIndex || !isFocused}
      repeat={true}
      onLoadStart={()=>handleLoadStart(index)}
      onLoad={()=>handleLoad(index)}
      onError={()=>handleError(index)}
      poster={item.thumbnail_url}
      posterResizeMode = 'cover'
      playInBackground={false}
    />
    {/* {isLoading && (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )} */}




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

        zIndex: 999,
      }}
    />
))}

<View style={styles.overlay}>
<TouchableOpacity
        onPress={() => {

          dispatch(setVideoAuthorUserId(item.video_author_id));
          navigation.push("OtherUserProfileScreen",{authorId:item.video_author_id, item:item});
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
            handleLikePress(item);
            toggleImage()
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
navigation.navigate("LikedUsersScreen" ,{ videoid: item.post_id }); // Pass videoid when navigating
}} 
>
<Text style={styles.image1_txt}>{item.video_likes}</Text>
</TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          const commentCurrentUserId = profileData.id;
          const postId = item.post_id;
          setPid(postId)
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
            message: `Hope you will like this post from MyFame: ${item.video_url}`, // Dynamic message with the video URL
            url: item.video_url, // Add the URL to make it shareable
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
          
          
          <TouchableOpacity
            style={{ marginTop: 25 }}
            onPress={() => setModalVisible2(true)}
          >
            <Feather name="more-horizontal" size={24} color="white" />
          </TouchableOpacity> 

      <View style={{ marginTop: 25 }}>
            <View></View>
            <Animated.View style={[styles.backgroundImage2, rotateStyle]}>
              <ImageBackground source={Ellips1} style={styles.backgroundImage2}>
                <Image source={Ellipse2} style={styles.image_bck_img} />
              </ImageBackground>
            </Animated.View>
          </View>

                      {/* Add this View for bottom-left corner text */}

    </View>
    <View style={styles.bottomLeftTextContainer}>
        {item.Video_author_name ? (
          <Text style={styles.bottomLeftText}>
            @{item.Video_author_name}
          </Text>
        ) : (
          <Text style={styles.bottomLeftText}>@{item.video_username || item.video_author}</Text>
        )}

{item.video_title ? (<Text style={styles.bottomdescription}>{item.video_title}</Text>):(null)}



{videoLinks.length > 0 ? (
    <FlatList
      data={videoLinks}
      keyExtractor={(link, index) => index.toString()} // Use index as key
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => handleLinkPress(item)} // Call the handler with the link
        >
          <Text style={styles.linkText}>{item}</Text>
        </TouchableOpacity>
      )}
      numColumns={2} // Set the number of columns for the grid layout
      contentContainerStyle={styles.linksContainer} // Adjust container style if needed
    />
  ) : (
    null // Message for empty array
  )}
      </View>
  

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
  );
});

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
  paginationContainer: {
    position: "absolute",
    top: "50%",
    left: "60%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    padding: 10,
    borderRadius: 5,
  },
  paginationText: {
    color: "white",
    fontSize: 16,
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  image_2: {
    // Add any other styles for the image here
  },
  backgroundImage2: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  image_bck_img: {
    // Add any other styles for the image here
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay background
  },
  modalContent: {
    width: 300,
    padding: 20,
    minHeight: 200,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#00A3FF",
    borderRadius: 5,
    marginTop: "5%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  bottomLeftTextContainer: {
    position: "absolute",
    padding: 5,
    borderRadius: 5,
    width: 400,
    bottom: "8%",
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
  loadingBackground: {
    backgroundColor: "#DCDCDC", // Change to red while loading
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linksContainer: {
    padding: 3,
    justifyContent: "flex-start",
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5', // Light background for the entire container
  },

  linkContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light, semi-transparent background
    borderRadius: 15, // More rounded corners
    margin: 0, // Slightly increased margin
    padding: 5, // Adequate padding for better spacing
    shadowColor: '#000',
    shadowOpacity: 0.15, // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    // shadowRadius: 6, // Soft shadow
    // elevation: 3, // Elevation for Android shadow
    // borderWidth: 1, // Optional border for a defined look
    // borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle border color
    alignItems: 'center', // Center the text
    marginTop:12
  },

  linkText: {
    color: '#1E90FF',  // Standard hyperlink blue
    fontWeight: 'bold',  // Make the link bold
    textDecorationLine: 'underline',  // Add underline
    borderRadius: 5,  // Rounded edges
    paddingHorizontal: 2,  // Add some padding inside the link
    fontStyle: 'italic',  // Italicize the link
    fontSize:13
  },

  noLinksText: {
    fontSize: 18, // Font size for "no links" text
    color: '#555', // Subtle grey color
    textAlign: 'center',
    marginTop: 20, // Margin for spacing
  },
});

export default VideoItem2;
