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
    // Handles the video load start
    const handleLoadStart = () => {
      console.log("Loading started : ", index);
      setIsLoading(true); // Show pagination
    };

    // Handles the video load completion
    const handleLoad = () => {
      console.log("Loaded : ", index);
      setIsLoading(false); // Hide pagination
      startRotation();
    };
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

    // useEffect(() => {
    //   startRotation(); // Start the rotation animation when component mounts
    // }, []);

    // Interpolating the rotation value into a degree
    const rotateInterpolate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const rotateStyle = {
      transform: [{ rotate: rotateInterpolate }],
    };

    const videoLinks = item.video_links;

      // Function to handle link press
  const handleLinkPress = (link) => {
    Linking.openURL(link).catch((err) => console.error("An error occurred", err));
  };

    return (
      <Pressable onPress={() => setState(!state)} style={styles.videoContainer}>
        <Video
          resizeMode="stretch"
          style={styles.video}
          source={{ uri: item.video_url }}
          paused={currentVideoIndex !== item.post_id || !isFocused || state}
          repeat={true}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          onScrollToIndexFailed={() => alert("no such index")}
          onScrollEndDrag={() => (scrollEnded.current = true)}
        />

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
              setPid(postId);
              dispatch(setCommentVideoId(postId));
              dispatch(setCommentCurrentUserId(commentCurrentUserId));
              setComments(item.video_comments);
              setModalVisible(true);
              console.log("postId : ", item);
              // handleOpenBottomSheet()
            }}
          >
            <View style={styles.image1_txt_mn}>
              {/* <Icon name="comment" size={35} color="white" /> */}
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
              <Text style={styles.bottomLeftText}>@{item.video_username}</Text>
            )}
          
          {item.video_title ? ( // Conditionally render the title only if it exists
    <Text style={styles.bottomdescription}>{item.video_title}</Text>
  ) : null}

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
        null
      )}
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
    zIndex: 30, // Ensure icons and other components appear above the loader
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
    bottom:"12%",
    left:30
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

export default VideoItem;
