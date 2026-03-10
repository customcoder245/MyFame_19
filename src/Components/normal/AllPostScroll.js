import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Text,
  Image,
  TextInput,
  Alert,
  Dimensions
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { HEIGHT } from "@components/storiesComponents/constants";
import VideoItem from "./ProfileVideoItem/VideoItem";
import { useDispatch, useSelector } from "react-redux";
import LikeVideoPosts from "../../Fetch_API/LikeVideoPosts";
import { setCommentId, setCommentText, setCurrentUserCommentStatus, setPostSpUserId } from "../../redux/action";
import PostReplyComment from "../../Fetch_API/PostReplyComment";
import PostComments from "../../Fetch_API/PostComments";
import { blank, post } from "../../assets2/Images/allImages";
import CommentLike from "../../Fetch_API/CommentLike";
import { AuthContext } from "../../Context/AuthContext";
import { HeartIcon, HeartStrokeIcon } from "../../assets2/Icons/allIcons";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function AllPostScroll() {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  console.log("isfocused " , isFocused)
  const profileData = useSelector((state) => state.profile.profileData);
  const route = useRoute();
  const flatlistRef = useRef();
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(route.params.index);
  const [isVisible, setIsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [repliesVisibility, setRepliesVisibility] = useState({});
  const [pid, setPid] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isHeart, setIsHeart] = useState(false)
  const [comment_current_id, setComment_current_id] = useState(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const cancelReply = () => {
    setIsReplying(false);
    dispatch(setCommentId(null));
  };

  const toggleImage = () => {
    setIsHeart(!isHeart);
  };

  const toggleReplies = (commentId) => {
    setRepliesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [commentId]: !prevVisibility[commentId],
    }));
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
      console.error(error);
    }
  };


  const handleLikePress = async (item) => {

    console.log("OLD item : ",item)
 
    if (item.like_status) {
      item.like_status = false;
      item.video_likes = item.video_likes - 1;

    }
    else {
      item.like_status = true;
      item.video_likes = item.video_likes + 1
    }  
    toggleImage()
    console.log("NEW ITEM : ",item)

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

  const getItemLayout = (data, index) => ({
    length: HEIGHT,
    offset: HEIGHT * index,
    index,
  });

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  };

  const handleTextInputChange = (text) => {
    setInputText(text);
  };

  const handleSaveComment = async () => {
    if (inputText.trim() === "") {
      // Show an alert or simply return to prevent posting an empty comment
      // Alert.alert("Comment Error", "Please enter a comment before posting.");
      return;
    }
  
    dispatch(setCommentText(inputText));
    dispatch(setPostSpUserId(profileData.id));
  
    if (isReplying) {
      setReplies((pre) => ({
        ...pre,
        [comment_current_id]: [
          ...(pre[comment_current_id] || []),
          {
            child_comments: [],
            comment_author: profileData.username,
            comment_content: inputText,
            comment_date: "now",
            comment_id: Math.floor(100000 + Math.random() * 900000).toString(),
            commented_user_id: userId,
            profile_img: profileData.profile_img,
          },
        ],
      }));
  
      const index = route.params.allPosts.findIndex((item) => item.post_id === pid);
      const child_comment_index = route.params.allPosts[index].video_comments.findIndex(
        (item) => item.comment_id === comment_current_id
      );
  
      route.params.allPosts[index].video_comments[child_comment_index].child_comments.push({
        child_comments: [],
        comment_author: profileData.username,
        comment_content: inputText,
        comment_date: "now",
        comment_id: Math.floor(100000 + Math.random() * 900000).toString(),
        commented_user_id: userId,
        profile_img: profileData.profile_img,
      });
  
      setInputText("");
      const responseData = await PostReplyComment();
      setIsReplying(false);
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
  
      const index = route.params.allPosts.findIndex((item) => item.post_id === pid);
      route.params.allPosts[index].video_comments_count += 1;
      route.params.allPosts[index].video_comments.push({
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

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={route.params.allPosts || []}
        renderItem={({item,index}) => (
          <VideoItem
            item={item}
            index={index}
            isLoading={isLoading}
            currentVideoIndex={currentVideoIndex}
            setIsLoading={setIsLoading}
            handleLikePress={handleLikePress}
            profileData={profileData}
            setComments={setComments}
            setPid={setPid}
            setModalVisible={setModalVisible}
            toggleImage={toggleImage}
            isFocused={isFocused}
            navigation={navigation}
            
          />
        )}
        pagingEnabled
        snapToInterval={Dimensions.get('window').height}
        decelerationRate={0.9}
        disableIntervalMomentum={true}
        initialScrollIndex={route.params.index}
        getItemLayout={getItemLayout}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={onViewableItemsChanged}
        windowSize={2}
        initialNumToRender={1}
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
            ><Entypo name="cross" size={26} color='black' />
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
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  userProfile: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },

  username: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  textInput: {
    width: "70%",
    height: 45,
    paddingRight: 40,
    alignItems: "center",
  },
  userImf: {
    position: "absolute",
    top: 20, // Adjust as needed
    left: 20, // Adjust as needed
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1, // Ensure this is on top of the video
    gap: 200,
  },
  userImf2: {
    position: "absolute",
    top: 20, // Adjust as needed
    left: 20, // Adjust as needed
    zIndex: 1, // Ensure this is on top of the video,
    gap: 80,
  },
  loaderContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  closeButton: {
    marginTop: 10,
    color: "black",
    fontSize: 25,
    paddingRight: "4%",
    marginLeft: "90%",
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
});
