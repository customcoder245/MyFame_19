import { ActivityIndicator, Alert, Image, ImageBackground, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { blank, Ellips1, Ellipse2 } from '../../../assets2/Images/allImages';
import { heart11, HeartIcon, Subtract, toggle, Union } from '../../../assets2/Icons/allIcons';
import { HEIGHT, WIDTH } from '@components/storiesComponents/constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setCommentCurrentUserId, setCommentVideoId, setVideoAuthorUserId } from '../../../redux/action';
import { SET_POST_ID, SET_POST_SP_USER_ID } from '../../../redux/constants';

const LikedVideoItemProfile = ({
    isLoading,
    setIsLoading,
    currentVideoIndex,
    item,
    index,
    handleLikePress,
    profileData,
    setComments,
    setPid,
    setModalVisible,
    toggleImage

}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleLoadStart = (index) => {
        console.log("LOADING STARTS FOR : ",index)
        setIsLoading(true);
      };
    
      const handleLoad = (index) => {
        console.log("Loading completes for : ",index)
        setIsLoading(false);
      };
    const handleError = (index) =>{
      console.log("Loading error for : ",index)
      setIsLoading(false)
    }
  return (
    <View style={styles.videoContainer}>
        <Video
          resizeMode="cover"
          style={styles.video}
          source={{ uri: item.video_url }}
          paused={index !== currentVideoIndex}
          repeat={true}
          onLoadStart={()=>handleLoadStart(index)}
          onLoad={()=>handleLoad(index)}
          onError={()=>handleError(index)}
          poster={item.thumbnail_url}
          posterResizeMode = 'cover'
        />
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

<View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => {
                dispatch(setVideoAuthorUserId(item.video_author_id));
                setTimeout(()=>{
                    navigation.navigate("OtherUserProfileScreen");
                },10)
            }}
          >
            {item.profile_img ? (
              <Image
                source={{ uri: item.profile_img }}
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
              <Image
                source={item.like_status ? HeartIcon : heart11}
                style={styles.image_hrt}
              />
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={() => {
              //   navigation.navigate("Likes");
              //   console.log(item.video_likes);
              // }}
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
              <Image source={Subtract} style={styles.image_2} />
              <Text style={styles.image1_txt}>{item.video_comments_count}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.image1_txt_mn}>
            <TouchableOpacity
              onPress={() => {
                try {
                  const result = Share.share({
                    message: "Hope you will like this video.",
                    url: item.video_url,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                    } else {
                    }
                  } else if (result.action === Share.dismissedAction) {
                  }
                } catch (error) {
                  Alert.alert(error.message);
                }
              }}
            >
              <Image source={Union} style={styles.image_2} />
            </TouchableOpacity>
            <Text style={styles.image1_txt}>Share</Text>
          </View>

          <View>
            <View>
              <Text></Text>
              <Text></Text>
            </View>
            <ImageBackground source={Ellips1} style={styles.backgroundImage2}>
              <Image source={Ellipse2} style={styles.image_bck_img} />
            </ImageBackground>
          </View>
        </View>
      </View>
  )
}

export default VideoItem

const styles = StyleSheet.create({
    videoContainer: {
        height: HEIGHT,
        width: WIDTH,
        alignItems: "center",
        justifyContent: "center",
      },
    
      loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position:'absolute'
      },
    
    
    
      video: {
        width: "100%",
        height: "100%",
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
})