// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';
// import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
// import { AuthContext } from '../../Context/AuthContext';
// import { useFocusEffect } from '@react-navigation/native';
// import fetchProfileData from '../../Fetch_API/fetchProfileData';
// import { useDispatch, useSelector } from 'react-redux';
// import UserFollowingPost from '../../Fetch_API/UserFollowingPost';

// export default function UserFollowingPostsData() {
//   const [status, setStatus] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [videos, setVideos] = useState([]);
//   const BottomTabHeight = useBottomTabBarHeight();
//   const ScreenHeight = Dimensions.get('window').height - BottomTabHeight;
//   const videoRefs = useRef([]);
//   const WindowHeight = Dimensions.get('window').height;
//   const [currentVideoIndex, setCurrentVideoIndex] = useState();
//   const { userId } = useContext(AuthContext);
//   const dispatch = useDispatch();
//   const profileData = useSelector((state) => state.profile.profileData);

//   useFocusEffect(
//     React.useCallback(() => {
//       if (userId) {
//         dispatch(fetchProfileData(userId));
//       }
//     }, [userId])
//   );

//   useEffect(() => {
//     const fetchVideos = async () => {
//       setLoading(true);
//       try {
//         if (profileData && profileData.id) {
//           const data = await UserFollowingPost(profileData.id); // Pass userId to UserFollowingPostsFetch
//           setVideos(data.videos); // Access the 'videos' key from the response data
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, [profileData]);

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const index = viewableItems[0].index;
//       setCurrentVideoIndex(index);
//       videoRefs.current.forEach((ref, idx) => {
//         if (ref) {
//           if (idx === index) {
//             ref.playAsync();
//           } else {
//             ref.pauseAsync();
//           }
//         }
//       });
//     }
//   });

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//   };

//   const renderVideoItem = ({ item, index }) => (
//     <View style={styles.videoContainer}>
//       <Video
//         ref={(ref) => (videoRefs.current[index] = ref)}
//         style={[styles.video]}
//         source={{
//           uri: item.video_url,
//         }}
//         useNativeControls={false}
//         resizeMode={ResizeMode.COVER}
//         isLooping
//         onPlaybackStatusUpdate={(status) => setStatus(status)}
//       />
//     </View>
//   );

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   if (error) {
//     return <Text>Error: {error}</Text>;
//   }

//   return (
//     <FlatList
//       data={videos}
//       renderItem={renderVideoItem}
//       pagingEnabled
//       keyExtractor={(item, index) => index.toString()}
//       contentContainerStyle={styles.container}
//       onViewableItemsChanged={onViewableItemsChanged.current}
//       viewabilityConfig={viewabilityConfig}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {},
//   videoContainer: {
//     height: Dimensions.get('window').height,
//     width: Dimensions.get('window').width,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
// });



// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { useSelector } from 'react-redux';

// export default function AllUsersData() {

//   const commentText = useSelector((state) => state.comment.commentText);
//   const commentVideoId = useSelector(state => state.commentVideoId.videoId);

//   return (
//     <View>
//       <Text>Comment Text: {commentText}</Text>
//       <Text>Stored Post ID from CommentScreen: {commentVideoId}</Text>

//       </View>
//   )
// }

// const styles = StyleSheet.create({})



// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import Share from 'react-native-share';

// export default function AllUsersData() {
//   const myCustomShare = async () => {
//     const shareOptions = {
//       message: 'This is a test message'
//     };

//     try {
//       const shareResponse = await Share.open(shareOptions);
//       console.log('Shared:', shareResponse);
//     } catch (error) {
//       console.log('Error sharing:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={myCustomShare}>
//         <Text>Share Message</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });

// import React, { useState } from 'react';
// import { View, Button, Text, ActivityIndicator } from 'react-native';
// import SingleVideoComments from '../../Fetch_API/SingleVideoComments';

// const NewScreen = () => {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFetchComments = async () => {
//     setLoading(true);
//     setError(null);

//     const result = await SingleVideoComments();

//     setLoading(false);
//     if (result.error) {
//       setError(result.error);
//     } else {
//       setComments(result);
//     }
//   };

//   return (
//     <View>
//       <Button title="Fetch Comments" onPress={handleFetchComments} />
//       {loading && <ActivityIndicator size="large" color="#0000ff" />}
//       {error && <Text style={{ color: 'red' }}>{error}</Text>}
//       {comments.length > 0 && (
//         <View>
//           {comments.map((comment, index) => (
//             <Text key={index}>{comment.text}</Text>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// export default NewScreen;








import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { heart11, HeartStrokeIcon } from '../../assets2/Icons/allIcons';

const ImageToggle = () => {
  const [boolean, setBoolean] = useState(true); // Initial boolean value set to true

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setBoolean(!boolean)}>
        {boolean ? (
          <Image style={styles.image} source={heart11} />
        ) : (
          <Image style={styles.image} source={HeartStrokeIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default ImageToggle;









