// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View, Image, Modal, FlatList, Text, TextInput, Pressable,
//   TouchableOpacity, SafeAreaView, StyleSheet, PanResponder, Animated
// } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const STICKER_ICONS = [
//   'crown', 'star-face', 'dog', 'cat', 'rocket', 'flower', 'pizza', 'emoticon-happy',
//   'heart', 'unicorn', 'robot', 'alien', 'ice-cream', 'cake', 'trophy', 'music-note',
//   'soccer', 'car', 'gift', 'fire'
// ];
// const GIPHY_API_KEY = 'EPdX6UpLFicbOflUDV0WVTCBJ1TSgLAx';

// export default function StickerEditorScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const cameraRef = useRef(null);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedIcon, setSelectedIcon] = useState(null);
//   const [selectedGifUrl, setSelectedGifUrl] = useState(null);

//   const [giphyModalVisible, setGiphyModalVisible] = useState(false);
//   const [gifList, setGifList] = useState([]);

//   const scale = useRef(new Animated.Value(1)).current;
//   const position = useRef(new Animated.ValueXY({ x: 100, y: 100 })).current;
//   const lastScale = useRef(1);

//   const [textModalVisible, setTextModalVisible] = useState(false);
//   const [inputText, setInputText] = useState('');
//   const [addedText, setAddedText] = useState(null);
//   const [textColor, setTextColor] = useState('#ffffff');
//   const textPosition = useRef(new Animated.ValueXY({ x: 100, y: 200 })).current;
// const gifScale = useRef(new Animated.Value(1)).current;
// const gifPosition = useRef(new Animated.ValueXY({ x: 150, y: 150 })).current;
// const gifLastScale = useRef(1);

//   const panResponder = useRef( PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderGrant: () => {
//       position.setOffset({ x: position.x._value, y: position.y._value });
//       position.setValue({ x: 0, y: 0 });
//     },
//     onPanResponderMove: (e, gestureState) => {
//       if (gestureState.numberActiveTouches === 2) {
//         const touches = e.nativeEvent.touches;
//         const dx = touches[0].pageX - touches[1].pageX;
//         const dy = touches[0].pageY - touches[1].pageY;
//         const dist = Math.sqrt(dx*dx + dy*dy);
//         if (lastScale.currentDistance) {
//           const sc = dist / lastScale.currentDistance;
//           scale.setValue(lastScale.current * sc);
//         } else {
//           lastScale.currentDistance = dist;
//         }
//       } else {
//         Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false })(e, gestureState);
//       }
//     },
//     onPanResponderRelease: () => {
//       position.flattenOffset();
//       lastScale.current = scale._value;
//       lastScale.currentDistance = null;
//     },
//   })).current;



//   const gifPanResponder = useRef(
//   PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderGrant: () => {
//       gifPosition.setOffset({ x: gifPosition.x._value, y: gifPosition.y._value });
//       gifPosition.setValue({ x: 0, y: 0 });
//     },
//     onPanResponderMove: (e, gestureState) => {
//       if (gestureState.numberActiveTouches === 2) {
//         const touches = e.nativeEvent.touches;
//         const dx = touches[0].pageX - touches[1].pageX;
//         const dy = touches[0].pageY - touches[1].pageY;
//         const dist = Math.sqrt(dx * dx + dy * dy);
//         if (gifLastScale.currentDistance) {
//           const sc = dist / gifLastScale.currentDistance;
//           gifScale.setValue(gifLastScale.current * sc);
//         } else {
//           gifLastScale.currentDistance = dist;
//         }
//       } else {
//         Animated.event([null, { dx: gifPosition.x, dy: gifPosition.y }], { useNativeDriver: false })(e, gestureState);
//       }
//     },
//     onPanResponderRelease: () => {
//       gifPosition.flattenOffset();
//       gifLastScale.current = gifScale._value;
//       gifLastScale.currentDistance = null;
//     },
//   })
// ).current;


//   const textPanResponder = useRef( PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderGrant: () => {
//       textPosition.setOffset({ x: textPosition.x._value, y: textPosition.y._value });
//       textPosition.setValue({ x: 0, y: 0 });
//     },
//     onPanResponderMove: Animated.event([null, { dx: textPosition.x, dy: textPosition.y }], { useNativeDriver: false }),
//     onPanResponderRelease: () => textPosition.flattenOffset(),
//   })).current;

//   const handleAddSticker = (iconName) => {
//     setSelectedIcon(iconName);
//     // setSelectedGifUrl(null);
//     setModalVisible(false);
//     scale.setValue(1);
//     position.setValue({ x: 100, y: 100 });
//   };

//   const fetchTrendingStickers = async () => {
//     try {
//       const resp = await fetch(
//         `https://api.giphy.com/v1/stickers/trending?api_key=${GIPHY_API_KEY}&limit=200`
//       );
//       const json = await resp.json();
//       setGifList(json.data || []);
//     } catch (err) {
//       console.error('Giphy fetch error:', err);
//       setGifList([]);
//     }
//   };

// const handleSelectGif = (url) => {
//   setSelectedGifUrl(url);
//   setGiphyModalVisible(false);
//   gifScale.setValue(1);
//   gifPosition.setValue({ x: 150, y: 150 });
// };


//   const handleCapture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       setCapturedPhoto(photo.uri);
//     }
//   };

//   if (!permission?.granted) {
//     return (
//       <View style={styles.centered}>
//         <Text>Camera permission required</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.button}>
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!capturedPhoto) {
//     return (
//       <CameraView style={styles.camera} ref={cameraRef}>
//         <View style={styles.captureContainer}>
//           <TouchableOpacity onPress={handleCapture} style={styles.shutterOuter}>
//             <View style={styles.shutterInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.imageSection}>
//         <TouchableOpacity style={styles.backButton} onPress={() => {
//           setCapturedPhoto(null);
//           setSelectedIcon(null);
//           setSelectedGifUrl(null);
//           setAddedText(null)
//         }}>
//           <Icon name="arrow-left" size={28} color="#fff" />
//         </TouchableOpacity>
//         <Image source={{ uri: capturedPhoto }} style={styles.image} />

//         {/* Render Draggable Text */}
//         {addedText && (
//           <Animated.View style={[styles.sticker, { transform: textPosition.getTranslateTransform() }]} {...textPanResponder.panHandlers}>
//             <Text style={{ fontSize: 28, fontWeight: 'bold', color: textColor }}>{addedText}</Text>
//           </Animated.View>
//         )}

//         {/* Render Icon Sticker */}
//         {selectedIcon && (
//           <Animated.View style={[styles.sticker, { transform: [...position.getTranslateTransform(), { scale }] }]} {...panResponder.panHandlers}>
//             <Icon name={selectedIcon} size={60} color="#ffcc00" />
//           </Animated.View>
//         )}

//         {/* Render Giphy GIF Sticker */}
// {selectedGifUrl && (
//   <Animated.View style={[styles.sticker, { transform: [...gifPosition.getTranslateTransform(), { scale: gifScale }] }]} {...gifPanResponder.panHandlers}>
//     <Image source={{ uri: selectedGifUrl }} style={{ width: 100, height: 100 }} resizeMode="contain" />
//   </Animated.View>
// )}

//       </View>

//       {/* Action Row */}
//       <View style={styles.actionRow}>
//         <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
//           <Icon name="emoticon-outline" size={24} color="#fff" /><Text style={styles.iconButtonText}>Sticker</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton} onPress={() => setTextModalVisible(true)}>
//           <Icon name="format-text" size={24} color="#fff" /><Text style={styles.iconButtonText}>Text</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton} onPress={() => {
//           fetchTrendingStickers();
//           setGiphyModalVisible(true);
//         }}>
//           <Icon name="gif-box" size={24} color="#fff" /><Text style={styles.iconButtonText}>GIPHY</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Sticker Picker Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Choose Icon Sticker</Text>
//           <FlatList data={STICKER_ICONS} horizontal keyExtractor={item=>item}
//             renderItem={({item}) => (
//               <Pressable onPress={()=>handleAddSticker(item)} style={styles.iconWrapper}>
//                 <Icon name={item} size={50} color="#333" />
//               </Pressable>
//             )}
//           />
//           <TouchableOpacity onPress={()=>setModalVisible(false)} style={styles.closeModal}>
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* Text Input Modal */}
//       <Modal visible={textModalVisible} animationType="slide" transparent>
//         <View style={styles.textModalContainer}>
//           <View style={styles.textModalContent}>
//             <Text style={styles.modalTitle}>Add Text</Text>
//             <TextInput style={[styles.textInput, { color: textColor }]} placeholder="Type here..." placeholderTextColor="#999"
//               onChangeText={setInputText} value={inputText}
//             />
//             <View style={styles.colorPickerRow}>
//               {['#fff','#000','#ff4757','#1e90ff','#2ed573','#ffa502','#a29bfe','#e84393'].map(c=>(
//                 <TouchableOpacity key={c} style={[styles.colorCircle,{backgroundColor:c,borderColor:textColor===c?'#fff':'transparent'}]} onPress={()=>setTextColor(c)} />
//               ))}
//             </View>
//             <View style={styles.textModalButtons}>
//               <TouchableOpacity style={styles.cancelButton} onPress={()=>setTextModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.confirmButton} onPress={()=>{ setAddedText(inputText); setTextModalVisible(false); position.setValue({x:80,y:80}); }}>
//                 <Text style={styles.buttonText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* GIPHY Modal */}
//       <Modal visible={giphyModalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Choose a GIPHY Sticker</Text>
//           <FlatList data={gifList} keyExtractor={item=>item.id} numColumns={4}
//             renderItem={({item}) => (
//               <Pressable onPress={()=>handleSelectGif(item.images.fixed_width.url)} style={styles.gifWrapper}>
//                 <Image source={{ uri: item.images.fixed_width_small.url }} style={styles.gifOption} />
//               </Pressable>
//             )}
//           />
//           <TouchableOpacity onPress={()=>setGiphyModalVisible(false)} style={styles.closeModal}>
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, backgroundColor:'#fff' },
//   camera: { flex:1 },
//   captureContainer: { flex:1, justifyContent:'flex-end', alignItems:'center', backgroundColor:'transparent' },
//   shutterOuter: { width: 80, height:80, borderRadius:40, borderWidth:6, borderColor:'#fff', alignItems:'center', justifyContent:'center' },
//   shutterInner: { width:60, height:60, borderRadius:30, backgroundColor:'#fff' },
//   imageSection: { flex:0.85, backgroundColor:'#ddd', position:'relative' },
//   image: { width:'100%', height:'100%', resizeMode:'cover' },
//   sticker: { position:'absolute', zIndex:10 },
//   actionRow: { flexDirection:'row', justifyContent:'space-around', padding:14, backgroundColor:'#1e1e1e', borderTopLeftRadius:16, borderTopRightRadius:16 , },
//   iconButton: { flexDirection:'row', alignItems:'center', backgroundColor:'#333', paddingVertical:10, paddingHorizontal:20, borderRadius:10 },
//   iconButtonText: { color:'#fff', fontSize:16, fontWeight:'600', marginLeft:8 },
//   modalContainer: { position:'absolute', bottom:0, width:'100%', height:300, backgroundColor:'#f2f2f2', padding:16, borderTopLeftRadius:16, borderTopRightRadius:16 },
//   modalTitle: { fontSize:18, fontWeight:'bold', marginBottom:12 },
//   iconWrapper: { marginHorizontal:8 },
//   gifWrapper: { flex:1, margin:4 },
//   gifOption: { width:'100%', aspectRatio:1, borderRadius:8 },
//   closeModal: { marginTop:16, alignSelf:'center', backgroundColor:'#333', padding:12, borderRadius:6 },
//   backButton: { position:'absolute', top:40, left:16, zIndex:20, backgroundColor:'rgba(0,0,0,0.6)', borderRadius:20, padding:6 },
//   centered: { flex:1, justifyContent:'center', alignItems:'center' },
//   button: { backgroundColor:'#007bff', padding:14, borderRadius:8, alignItems:'center' },
//   buttonText: { color:'#fff', fontWeight:'bold', fontSize:16 },
//   textModalContainer: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'flex-end' },
//   textModalContent: { backgroundColor:'#222', borderTopLeftRadius:20, borderTopRightRadius:20, padding:20, paddingBottom:40 },
//   textInput: { height:50, borderWidth:1, borderColor:'#555', borderRadius:10, paddingHorizontal:12, marginBottom:16, fontSize:18, backgroundColor:'#333' },
//   colorPickerRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:20 },
//   colorCircle: { width:30, height:30, borderRadius:15, borderWidth:2, marginHorizontal:4 },
//   textModalButtons: { flexDirection:'row', justifyContent:'space-between' },
//   cancelButton: { backgroundColor:'#555', flex:1, marginRight:10, paddingVertical:12, borderRadius:10, alignItems:'center' },
//   confirmButton: { backgroundColor:'#007bff', flex:1, marginLeft:10, paddingVertical:12, borderRadius:10, alignItems:'center' },
// });











import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import {
  verify1,
  Vector3,
  Vector4,
  Vector5,
  instagram1,
  instagram2,
  Vector14,
  useraccount1,
} from "../../assets2/Icons/allIcons";
import PostTopNav from "./PostTopNav";
import Editprofile from "./EditProfile";
import { updateProfile } from "../../redux/action";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  propic,
  Group12,
  qrcode1,
  User,
  blank,
  editpro,
} from "../../assets2/Images/allImages";
import TotalLikesData from "../../Fetch_API/TotalLikesData";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import MyFollowerData from "../../Fetch_API/MyFollowerData";
import { useFocusEffect } from "@react-navigation/native";
import { Entypo, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import useAppState from "../../StackScreens/useAppState";
import getRandomAd from "../../Fetch_API/getRandomAd";


export default function ProfileScreen(props , navigation) {
  const { logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
const [adModalVisible, setAdModalVisible] = useState(false);
const [adData, setAdData] = useState(null);

  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  const [userData, setUserData] = useState(null);
  const followingCount = useSelector(
    (state) => state.followingCount.followingCount
  );
  const followersCount = useSelector(
    (state) => state.followersCount.followersCount
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const totalLikes = useSelector((state) => state.totalLikesData.totalLikes);
  const instagramLink = useSelector(
    (state) => state.instagramLink.instagramLink
  );
  const [profileModal, setProfileModal] = useState(false);

  const openModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setProfileModal(false);
  };

  // useEffect(() => {
  //   const MyFollowerData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await MyFollowerData(); // Replace with your actual API fetch function
      
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   MyFollowerData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
        
      }
    }, [userId])
  );

  useEffect(() => {
    dispatch(
      updateProfile({
        username: "NewUsername",
        about: "Updated bio",
        profile_img: "new-image-url",
      })
    );
  }, [dispatch]);



useEffect(() => {
  const fetchAd = async () => {
    try {
      const ad = await getRandomAd();
      console.log("Fetched ad:", ad);

      // If the API returns nested data, adjust accordingly:
      const adContent = ad?.data?.data || ad?.data || ad;

      if (adContent?.featured_image) {
        setAdData(adContent);
        setAdModalVisible(true);
      } else {
        console.log("No ad content available");
      }
    } catch (error) {
      console.error("Ad fetch error:", error);
      setAdData(null);
      setAdModalVisible(false);
    }
  };

  fetchAd();
}, []);





  
  // const { appStateVisible, userStatus, backgroundColor } = useAppState();

  const apiResponse = useSelector((state) => state.api.responseData);    

  if (apiResponse) {
    // Here you would check the account type.
    // If account_type is "private", display a specific text.
    // If it's "public", display null.
    if (apiResponse.account_type === "private") {
      displayText = "This is a private account.";
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.touchableImage}
        // onPress={() => props.navigation.navigate("Friends")}
        onPress={() => props.navigation.navigate("UsersList")}
      >
            <MaterialCommunityIcons name="account-plus-outline" size={26} color="#000" />

      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button_tridots}
        onPress={() => setModalVisible(true)}
      >
         <MaterialCommunityIcons name="dots-vertical" size={26} color="#000" />
      </TouchableOpacity>

      <View style={styles.image_pro_pen}>
        <TouchableOpacity  onPress={openModal}>
        {profileData && profileData.profile_img ? (
          <Image
            source={{ uri: profileData.profile_img }}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <Image source={blank}    style={styles.image} />
        )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Editprofile")}
          style={{marginTop:"-1%"}}
        >
          <Image source={Group12} style={styles.image2} />
        </TouchableOpacity>
      </View>

      <View style={styles.jhnkrmn}>
        <Text style={styles.jhnkr}>
          @{profileData ? profileData.username : " "}
        </Text>
        {/* {/ <Image source={verify1} style={styles.image3} /> /} */}
      </View>

      {/* 
      <View style={styles.vdmnn}>
        <Text>45 Videos</Text>
      </View> */}

      <View style={styles.all_data_prst}>
        <View style={styles.data_mn_23}>
          <Text style={styles.data_num}>
            {profileData ? profileData.total_posts : " "}
          </Text>
          <Text style={styles.data_txt}>Posts</Text>
        </View>
        <TouchableOpacity style={styles.data_mn_23}
         onPress={() => props.navigation.navigate("FollowersList")}
        >
          <Text style={styles.data_num}>
            {profileData ? profileData.followers_count : " "}
          </Text>
          <Text style={styles.data_txt}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.data_mn_23}
         onPress={() => props.navigation.navigate("FollowingList")}
        >
          <Text style={styles.data_num}>
            {profileData ? profileData.following_count : " "}
          </Text>
          <Text style={styles.data_txt}>Following</Text>
        </TouchableOpacity>
        <View style={styles.data_mn_23}>
          <Text style={styles.data_num}>
            {profileData ? profileData.total_like_counts : " "}
          </Text>
          <Text style={styles.data_txt}>Likes</Text>
        </View>
      </View>

      <View style={styles.sven1_Seven2_mn_al}>
      <TouchableOpacity
  onPress={() => props.navigation.navigate("Editprofile")}
  style={{
    width: 120,
    height: 46,
    backgroundColor: "#00A4FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    // Add shadow properties
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 0, height: 6 }, // Stronger bottom shadow
    shadowOpacity: 0.6, // Higher opacity for a darker shadow
    shadowRadius: 8, // Increase blur for a smoother shadow
    elevation: 8, // Higher elevation for Android
  }}
>
  <Text style={{ color: "white" }}>Edit Profile</Text>
</TouchableOpacity>


        {/* <>
  {profileData && profileData.instagram && profileData.instagram.includes("instagram") ? (
    <TouchableOpacity
      // style={styles.image_72_cstm}
      // onPress={() => {
      //   Linking.openURL(profileData.instagram);
      // }}
    >
      <Image source={instagram2} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      // style={styles.image_72_cstm}
      // onPress={() => {
      //   Alert.alert("Invalid Link", "The provided link is not valid for your Instagram profile.");
      // }}
    >
      <Image source={instagram2} />
    </TouchableOpacity>
  )}
</> */}


{/* <TouchableOpacity
  style={{
    width:55,
    height: 46,
    backgroundColor: "#DEDEDE",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    // Add shadow properties
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 0, height: 6 }, // Stronger bottom shadow
    shadowOpacity: 0.6, // Higher opacity for a darker shadow
    shadowRadius: 8, // Increase blur for a smoother shadow
    elevation: 8, // Higher elevation for Android
  }}
>
<MaterialCommunityIcons  name="bookmark-outline" size={27} color="black" />
</TouchableOpacity> */}
      </View>

      <Text style={styles.text}>
        {profileData ? profileData.about : "Loading..."}
      </Text>

      {/* {/ <Text style={styles.alknwnsng}>Also known as singer</Text> /} */}

      {/* {/ Render Following component /} */}
      
      <PostTopNav />

      <Modal
  animationType="fade"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <Pressable
    style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better contrast
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => setModalVisible(false)}
  />
  <View
    style={{
      width: '100%', // Responsive width
      maxWidth: 400,
      backgroundColor: 'white',
      paddingVertical: 20,
      paddingHorizontal: 22,
      elevation: 8, // Soft shadow for depth
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      alignSelf: 'center',
    }}
  >
    <View style={{ alignItems: 'flex-start' }}>
      {/* Close Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 15,
          backgroundColor: 'transparent',
          padding: 1  ,
          borderColor:"black",
          borderWidth:0.6,
          
        }}
        onPress={() => setModalVisible(false)}
      >
        <MaterialCommunityIcons name="close" size={26} color={"#000"} />
      </TouchableOpacity>

      {/* Creator Tools */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CreatorTools");
          setModalVisible(false);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
        <MaterialCommunityIcons name="account-outline" size={26} color="#000" style={{marginRight:10}}/>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>Creator Tools</Text>
        </View>
      </TouchableOpacity>

      {/* My QR Code */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("QR Screen");
          setModalVisible(false);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
        <MaterialCommunityIcons name="qrcode" size={26} color="#000" style={{marginRight: 10}} />
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>My QR Code</Text>
        </View>
      </TouchableOpacity>

      {/* Privacy and Settings */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("PrivacyPolicy");
          setModalVisible(false);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
        <MaterialCommunityIcons name="cog-outline" size={26} color="black" style={{marginRight:10}}/>
     
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '600' }}>Privacy and Settings</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <Modal
        transparent={true}
        visible={profileModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
        {profileData && profileData.profile_img ? (
          <Image
            source={{ uri: profileData.profile_img }}
            resizeMode="cover"
            style={{    height: "40%",
              width: "80%",
              borderRadius: 200,}}
          />
        ) : (
          <Image source={blank}            
          style={{    height: "40%",
            width: "80%",
            borderRadius: 200,}}/>
        )}
        </TouchableOpacity>
      </Modal>





{adModalVisible && adData && (
  <Modal
    animationType="fade"
    transparent={true}
    visible={adModalVisible}
    onRequestClose={() => setAdModalVisible(false)}
  >
    <View style={styles.adOverlay}>
      <View style={styles.adCard}>
        <TouchableOpacity
          style={styles.adClose}
          onPress={() => setAdModalVisible(false)}
        >
          <Text style={styles.adCloseText}>×</Text>
        </TouchableOpacity>

        {adData.featured_image && (
          <Image
            source={{ uri: adData.featured_image }}
            style={styles.adImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.adContent}>
          <Text style={styles.adTitle}>{adData.title || "Sponsored Ad"}</Text>
          <Text style={styles.adDesc}>
            {adData.description || "Check out this amazing product!"}
          </Text>

          <View style={styles.adMetaContainer}>
            <Text style={styles.adMetaText}>
              {adData.category ? adData.category : "General"}
            </Text>
            {adData.price ? (
              <Text style={[styles.adMetaText, { fontWeight: "600" }]}>
                {adData.price}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.adButton}
            onPress={() => {
              if (adData.link) {
                Linking.openURL(adData.link);
              }
              setAdModalVisible(false);
            }}
          >
            <Text style={styles.adButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}




    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: "15%",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 90,
  },
  imagemodal:{
    height: 120,
    width: 120,
    borderRadius: 90,
  }
  ,
  image2: {
    height: 25,
    width: 25,
    position: "absolute",
    top: "80%",
    right: "3%",
    borderRadius: 30,
    marginTop:"-15%"
  },
  jhnkr: {
    fontSize: 15.23,
    fontWeight: "500",
  },
  image3: {
    height: 25,
    width: 25,
    position: "absolute",
    right: "-7%",
  },
  jhnkrmn: {
    justifyContent: "center",
    marginTop: "4%",
  },
  image4: {
    height: 18,
    width: 24,
  },
  vdmnn: {
    backgroundColor: "#D8D8D8",
    width: "23%",
    alignItems: "center",
    borderRadius: 11,
    justifyContent: "center",
    height: "5%",
    marginTop: "4%",
  },
  data_num: {
    fontSize: 17.23,
    fontWeight: "bold",
    textAlign: "center",
  },
  data_txt: {
    fontSize: 13,
    color: "#6D6969",
    marginTop: 7,
    fontWeight:"700"
  },
  all_data_prst: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  data_mn_23: {
    marginHorizontal: 16, // Adjust this value to decrease spacing
    alignItems: 'center', // Optional: Center align the text
  },
  image_pro_pen: {
    // marginTop: "-7%",
  },
  image_71_cstm: {	
    height: 46,
    width: 120,
    backgroundColor: "#00A4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  image_71_cstm_tsxt: {
    color: "white",
    fontSize: 15,
  },
  image_72_cstm: {
    height: 46,
    width: 55,
    backgroundColor: "#DEDEDE",
    alignItems: "center",
    justifyContent: "center",
  },
  sven1_Seven2_mn_al: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  alknwnsng: {
    color: "#ABABAB",
    fontSize: 15,
    padding: 13,
  },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  modalContent: {
    backgroundColor: "white",
    // paddingHorizontal: 60,
    borderRadius: 10,
    rowGap: 25,
    width: "100%",
    paddingTop:"13%",
    paddingBottom:"8%",
    paddingRight:"20%",
    paddingLeft:"15%"
  },
  modalText: {
    fontSize: 18,
    color: "#302E2E",
    fontWeight: "500",
  },
  closeButton: {
    alignSelf: "center",
    // marginTop: 30,
    position:"absolute",
    top:15,
    right:15,
    borderWidth:0.8
  },
  srctxt_mdl: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 25,
  },

  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#302E2E",
  },
  button_tridots: {
    position: "absolute",
    right: "1%",
    top: "5%",
  },
  tridot: {
    fontSize: 40,
  },
  touchableImage: {
    position: "absolute",
    left: "5%",
    top: "5.3%",
    width: "10%",
  },
  text: {
    fontSize: 13,
    marginVertical: 10,
    fontWeight: "400",
    width: "85%",
    textAlign: "center",
    color: "#ABABAB",
  },
  overLay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    ...StyleSheet.absoluteFillObject,
  },
  openButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.7)",
},

  modalContainerprofile: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },

  closeButtonprofile: {
    padding: 10,
    backgroundColor: 'lightcoral',
    borderRadius: 5,
  },
adOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingHorizontal: 20,
},

adCard: {
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#fff",
  borderRadius: 20,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 12,
  position: "relative",
},

adClose: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
  backgroundColor: "rgba(0,0,0,0.4)",
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
},

adCloseText: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "bold",
  marginTop: -1,
},

adImage: {
  width: "100%",
  height: 180,
},

adContent: {
  padding: 18,
  alignItems: "center",
},

adTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#222",
  textAlign: "center",
  marginBottom: 6,
},

adDesc: {
  fontSize: 14,
  color: "#555",
  textAlign: "center",
  lineHeight: 20,
  marginBottom: 10,
},

adMetaContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  marginBottom: 15,
},

adMetaText: {
  fontSize: 13,
  color: "#888",
  backgroundColor: "#F2F3F5",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
},

adButton: {
  backgroundColor: "#00A4FF",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 25,
  alignItems: "center",
  justifyContent: "center",
  width: "80%",
  shadowColor: "#00A4FF",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 10,
  elevation: 8,
},

adButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 15,
},



});	
