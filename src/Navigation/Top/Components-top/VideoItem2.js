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

const VideoItem2 = memo(({ currentVideoIndex, item, index, isFocused }) => {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisibleState] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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


  return (
    <Pressable onPress={() => setState(!state)} style={styles.videoContainer}>
      <View
        style={[styles.videoBackground, isLoading && styles.loadingBackground]}
      ></View>
      <Video
        resizeMode="stretch"
        style={styles.video}
        source={{ uri: item.video_url }}
        paused={currentVideoIndex !== item.post_id || !isFocused || state}
        repeat={true}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
      />

      {isLoading && (
        <View style={styles.paginationContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => showCustomAlert("Log In first")}>
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
          <TouchableOpacity onPress={() => showCustomAlert("Log In first")}>
          <Icon name="heart-o" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => showCustomAlert("Log In first")}>
            <Text style={styles.image1_txt}>{item.video_likes}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => showCustomAlert("Log In first")}>
          <View style={styles.image1_txt_mn}>
            <SimpleLineIcons name="bubble" size={30.6} color="white" />

            <Text style={styles.image1_txt}>{item.video_comments_count}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.image1_txt_mn}>
          <TouchableOpacity
            onPress={() => showCustomAlert("Log In first")}
          >
            <MaterialCommunityIcons name="share-outline" size={34} color="white" />
          </TouchableOpacity>
          <Text style={styles.image1_txt}>Share</Text>
        </View>


        <TouchableOpacity
              style={{ marginTop: 25 }}
              onPress={() => setModalVisible2(true)}
            >
              <Feather name="more-horizontal" size={24} color="white" />
            </TouchableOpacity>  


        <View>
          <View>
            <Text></Text>
            <Text></Text>
          </View>
          <Animated.View style={[styles.backgroundImage2, rotateStyle]}>
            <ImageBackground source={Ellips1} style={styles.backgroundImage2}>
              <Image source={Ellipse2} style={styles.image_bck_img} />
            </ImageBackground>
          </Animated.View>
        </View>

        {/* Add this View for bottom-left corner text */}
      </View>

      {/* Custom Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cross Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{modalMessage}</Text>
            <Text style={styles.description}>
              Sign in now so that you can enjoy our app.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate(
                  "BottomNavigator",
                  { screen: "Me" },
                  handleCloseModal()
                )
              }
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomLeftTextContainer}>
            {item.Video_author_name ? (
              <Text style={styles.bottomLeftText}>
                @{item.Video_author_name}
              </Text>
            ) : (
              <Text style={styles.bottomLeftText}>@{item.video_username}</Text>
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
       null
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
          
    </Pressable>
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
    bottom: "15%",
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
