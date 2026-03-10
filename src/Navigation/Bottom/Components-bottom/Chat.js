import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  blank,
  Ellipse11,
  Ellipse11mn,
  Ellipse12,
  Ellipse12mn,
  Ellipse5mn,
  Group31,
  image1,
} from "../../../assets2/Images/allImages";
import { port2 } from "../../../assets2/Images/allImages";
import { no1 } from "../../../assets2/Icons/allIcons";
import { push } from "../../../../utils/navigation";
import { useFocusEffect } from "@react-navigation/native";
import AllPostsFetch from "../../../Fetch_API/AllPostsFetch";
import { AuthContext } from "../../../Context/AuthContext";

import UserStoriesFetch from "../../../Fetch_API/UserStoriesFetch";
import UserFollowingStoriesFetch from "../../../Fetch_API/UserFollowingStoriesFetch";
import { Stories3 } from "@components/storiesComponents";
import { WIDTH } from "@components/storiesComponents/constants";
import FetchAllUserData from "../../../Fetch_API/FetchAllUserData";
import UserData from "../../../Fetch_API/UsersData";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../Fetch_API/BaseURL";


export default function Chat({ navigation }) {
  // const deepCopyArray = JSON.parse(JSON.stringify(ALLUsers))
  
  const [allUsers, setAllUsers] = useState([]);
  const profileData = useSelector((state) => state.profile.profileData);


  const [stories, setStories] = useState({
    userStories: [],
    userFollowingStories: [],
  });
  const [visible, setVisible] = useState(false);
  const [userStoryModalVisible, setUserStoryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { userId } = useContext(AuthContext);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const storiesRef = useRef();
  const userStoriesRef = useRef();
  const [isLoading, setIsLoading] = useState(false)


  const convertTimestampToDate = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toISOString();
  };



  const handleModal = (index) => {
    setCurrentUserIndex(index);
    setVisible(!visible);
    setTimeout(() => {
      storiesRef.current.handleScrolltoOffset(index * WIDTH);
    }, 1);
  };

  function generateChatId(userId,userId2) {
    return `${Math.min(userId, userId2)}-${Math.max(userId, userId2)}`;
  }

  const getText = (item) => {
    if (item.image !== undefined && item.image !== "") return "Photo";
    if (item.video !== undefined && item.video !== "") return "Video";
    else if (item.file !== undefined && item?.file?.url !== "") return "Document";
    else return item.text;
  };

  

  const handleUserModal = (index) => {
    setCurrentUserIndex(index);
    setUserStoryModalVisible(!userStoryModalVisible);
    setTimeout(() => {
      userStoriesRef.current.handleScrolltoOffset(index * WIDTH);
    }, 1);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchCommentData = async () => {
        try {

          const response = await UserStoriesFetch(userId);
          const followingStories = await UserFollowingStoriesFetch(userId);

          setStories({
            ...stories,
            userFollowingStories: followingStories.data || [],
            userStories: response.data !== undefined ? [response.data] : [],
          });

          // console.log("ALL Users are  :", response.data);
        } catch (error) {
          console.error("Error fetching AllPosts:", error);
        }
      };
      fetchCommentData();
    }, []) // Add any dependencies needed
  );
  // useFocusEffect(
  //   useCallback(() => {
  //     setFilteredData(deepCopyArray)
  //     setAllUsers(deepCopyArray)
  //   }, [userId]) // Add any dependencies needed
  // );


  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribes = [];
  
      
      
  
      // otherUserIds.forEach((otherUserId) => {
      //   const chatId = generateChatId(otherUserId);
      //   const unsubscribe = firestore()
      //     .collection("ChatsRoom")
      //     .doc(chatId)
      //     .collection("Messages")
      //     .orderBy("createdAt", "desc")
      //     .limit(1)
      //     .onSnapshot((querySnapshot) => {
      //       if (!querySnapshot.empty) {
      //         const latestMessage = querySnapshot.docs[0].data();
      //         if (otherUserId === latestMessage.sendTo) {
      //           const filterdObjectIndex = filteredData.findIndex(item => item.id === otherUserId);
      //           filteredData[filterdObjectIndex].text = getText(latestMessage);
      //           filteredData[filterdObjectIndex].createdAt = latestMessage.createdAt;
  
      //           const allUsersfilterdObjectIndex = allUsers.findIndex(item => item.id === otherUserId);
      //           allUsers[allUsersfilterdObjectIndex].text = getText(latestMessage);
      //           allUsers[allUsersfilterdObjectIndex].createdAt = latestMessage.createdAt;
  
      //           setFilteredData(prev => prev.sort((a, b) => {
      //             const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
      //             const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
      //             return dateB - dateA;
      //           }));
  
      //           setAllUsers(prev => prev.sort((a, b) => {
      //             const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
      //             const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
      //             return dateB - dateA;
      //           }));
      //         }
      //       }
            
      //     });
  
      //   unsubscribes.push(unsubscribe);
      // });
      
  
  //     return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  //   }, [userId,]) 
  // );

  const UserDatas = async (id) => {
 
  
    
    
    try {
      const response = await fetch(
        `${BASE_URL}/allusers/v1/allUsersData/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: id 
          }), 
        }
      );
      
      const responseData = await response.json();
      
      if (response.ok) {
        // Dispatch the action to store all users in Redux
        return responseData; // Return data if needed
      } else {
        console.error("Failed to fetch users data:", responseData);
        return { error: responseData.message || "Failed to fetch users data" };
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      return { error: "An error occurred. Please try again later." };
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribes = [];

      // (async()=>{
      //   const uid = await AsyncStorage.getItem('userId')
      //   const data = await UserDatas(uid)
      //   console.log(data)
      //   const otherUserIds = data.map(user => user.id)
      //   otherUserIds.forEach((otherUserId) => {
      //     const chatId = generateChatId(uid,otherUserId);
      //     const unsubscribe = firestore()
      //       .collection("ChatsRoom")
      //       .doc(chatId)
      //       .collection("Messages")
      //       .orderBy("createdAt", "desc")
      //       .limit(1)
      //       .onSnapshot((querySnapshot) => {
      //         console.log("QuerySnapShot : ",querySnapshot.empty)
      //         if (!querySnapshot.empty) {
      //           const latestMessage = querySnapshot.docs[0].data();
      //           if (otherUserId === latestMessage.sendTo) {
      //             const fData = [...data]
      //             const AData = [...data]
      //             const filterdObjectIndex = fData.findIndex(item => item.id === otherUserId);
      //             fData[filterdObjectIndex].text = getText(latestMessage);
      //             fData[filterdObjectIndex].createdAt = latestMessage.createdAt;
    
      //             const allUsersfilterdObjectIndex = AData.findIndex(item => item.id === otherUserId);
      //             AData[allUsersfilterdObjectIndex].text = getText(latestMessage);
      //             AData[allUsersfilterdObjectIndex].createdAt = latestMessage.createdAt;

      //             const sortedFilteredData = fData.sort((a, b) => {
      //               const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
      //               const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
      //               return dateB - dateA;
      //             });
                
      //             // Sort AData by createdAt in descending order
      //             const sortedAllUsersData = AData.sort((a, b) => {
      //               const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
      //               const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
      //               return dateB - dateA;
      //             });

    
      //             setFilteredData(sortedFilteredData);
    
      //             setAllUsers(sortedAllUsersData)
      //           }
      //         }
              
      //       });
    
      //     unsubscribes.push(unsubscribe);
      //   });
        
      // })();


      (async () => {
        const uid = await AsyncStorage.getItem('userId');
        const data = await UserDatas(uid);
        console.log(data);
        const otherUserIds = data.map(user => user.id);
        
        // Array to track whether a message was found for each chatId
        const messageFoundPromises = otherUserIds.map((otherUserId) => new Promise((resolve) => {
          const chatId = generateChatId(uid, otherUserId);
          
          const unsubscribe = firestore()
            .collection("ChatsRoom")
            .doc(chatId)
            .collection("Messages")
            .orderBy("createdAt", "desc")
            .limit(1)
            .onSnapshot((querySnapshot) => {
              console.log("QuerySnapShot:", querySnapshot.empty);
              
              if (!querySnapshot.empty) {
                const latestMessage = querySnapshot.docs[0].data();
                
                if (otherUserId === latestMessage.sendTo) {
                  const fData = [...data];
                  const AData = [...data];
                  
                  const filteredObjectIndex = fData.findIndex(item => item.id === otherUserId);
                  fData[filteredObjectIndex].text = getText(latestMessage);
                  fData[filteredObjectIndex].createdAt = latestMessage.createdAt;
      
                  const allUsersFilteredObjectIndex = AData.findIndex(item => item.id === otherUserId);
                  AData[allUsersFilteredObjectIndex].text = getText(latestMessage);
                  AData[allUsersFilteredObjectIndex].createdAt = latestMessage.createdAt;
      
                  const sortedFilteredData = fData.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
                    const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
                    return dateB - dateA;
                  });
      
                  const sortedAllUsersData = AData.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000) : new Date(0);
                    const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000) : new Date(0);
                    return dateB - dateA;
                  });
      
                  setFilteredData(sortedFilteredData);
                  setAllUsers(sortedAllUsersData);
      
                  resolve(true); // Indicate that a message was found
                }
              }
      
              resolve(false); // No messages found for this chatId
            });
            
          unsubscribes.push(unsubscribe);
        }));
      
        // Wait for all onSnapshot listeners to resolve
        const results = await Promise.all(messageFoundPromises);
      
        // If no chatId had messages, clear the arrays
        if (!results.includes(true)) {
          setFilteredData(data);
          setAllUsers(data);
        }
      })();
      
      
  
   
  
      return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    }, [])
  );
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filtered = allUsers.filter((item) => {
      return item.username.toLowerCase().includes(formattedQuery);
    });
    setFilteredData(filtered);
  };

  return (
   
    <View style={styles.container}>
       <SafeAreaView>
      <ScrollView>
        <View style={styles.frstchtrw}>
          {/* <Image style={styles.plsbx} source={Group31} /> */}
          <Text style={styles.plsbxtxt}>Chats</Text>
        </View>

        <Modal
          animationType="slide"
          visible={userStoryModalVisible}
          onRequestClose={() => setUserStoryModalVisible(!visible)}
        >
          <Stories3
            currentUserIndex={currentUserIndex}
            ref={userStoriesRef}
            visible={userStoryModalVisible}
            setVisible={setUserStoryModalVisible}
            stories={stories.userStories}
          />
        </Modal>

        <Modal
          animationType="slide"
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
          <Stories3
            currentUserIndex={currentUserIndex}
            ref={storiesRef}
            visible={visible}
            setVisible={setVisible}
            stories={stories.userFollowingStories}
          />
        </Modal>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingTop: 20,
          }}
        >
          <View>
            {stories.userStories.length !== 0 ? (
              stories.userStories.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleUserModal(index)}
                  style={{ alignItems: "center" }}
                >
                     
                  <ImageBackground
                    source={item.user_image ? { uri: item.user_image } : blank}
                    style={styles.background}
                    imageStyle={{
                      borderRadius: 70,
                      borderWidth: 5,
                      borderColor: "rgba(0, 164, 255, 0.58)",
                    }}
                  ></ImageBackground>
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    {item.user_name}
                  </Text>
                </Pressable>
              ))
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("TermsOfServiceFetch")}
                style={{ alignItems: "center", marginTop: 12 }}
              >
                
                <ImageBackground
                  source={profileData && profileData.profile_img?{uri: profileData.profile_img}: blank}
                  style={styles.background}
                  imageStyle={{ borderRadius: 70 }}
                >
                  <Text style={styles.plsbxtxt2}>+</Text>
                </ImageBackground>
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Add Story
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.scrollableRow}
            showsHorizontalScrollIndicator={false}
          >
            {stories.userFollowingStories.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleModal(index)}
                style={{ alignItems: "center" }}
              >
             
                <ImageBackground
                
                  source={item.user_image ? { uri: item.user_image } : blank}
                  style={styles.background}
                  imageStyle={{
                    borderRadius: 70,
                    borderWidth: 5,
                    borderColor: "rgba(0, 164, 255, 0.58)",
                  }}
                ></ImageBackground>
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  {item.user_name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchmn}>
          <TextInput
            style={{
              height: 45,
              marginBottom: 10,
              paddingHorizontal: 10,
              width: "90%",
              borderRadius: 18,
              backgroundColor: "#F0F0F0",
              paddingLeft: "11%",
            }}
            placeholder="Search chats......"
            clearButtonMode="always"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Image
            source={no1}
            style={{
              width: 18,
              height: 18,
              position: "absolute",
              top: "25%",
              left: "8%",
            }}
          />
        </View>

        <Text style={styles.plsbxtxt3}>Messages</Text>
        {
          console.log("item : ",filteredData)
        }

        { isLoading?<ActivityIndicator size={'small'} /> : filteredData.map((item) => (
          <Pressable
            onPress={() => navigation.navigate("UserChat", { item })}
            key={item.id}
            style={styles.alinawalflkry}
          >
            <Image
              source={item.profile_img ? { uri: item.profile_img } : blank}
              style={{ width: 50, height: 50, borderRadius: 300 }}
            />

            <View style={styles.alinamain}>
              <View style={styles.alinawalflkry2}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {item.username}
                </Text>
                <Text style={{ fontSize: 13 }}>{item.text}</Text>
              </View>
              {/* <View style={{ justifyContent: "center" }}>
                <Text>9h ago</Text>
              </View> */}
            </View>
          </Pressable>
        ))}
      </ScrollView>
      </SafeAreaView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "5%",
  },
  frstchtrw: {
    // flexDirection: "row",
    alignItems: "center",
    // paddingLeft: 10,
    // paddingTop: 10,
    // // gap: "100%",
    // gap: 100,
    // paddingLeft: "10%",
  },
  plsbx: {
    width: 30,
    height: 30,
  },
  plsbxtxt: {
    fontWeight: "bold",
    fontSize: 16,
  },
  plsbxtxt3: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "7%",
    marginTop: "5%",
  },
  background: {
    width: 100,
    height: 100,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  plsbxtxt2: {
    color: "#00A4FF",
    fontSize: 28,
  },
  scrollableRow: {
    alignItems: "center",
    gap: 18,
    paddingLeft: 20,
  },
  searchmn: {
    borderColor: "black",
    alignItems: "center",
    marginTop: "10%",
  },
  serchdiv: {
    borderColor: "black",
    width: "95%",
    alignItems: "center",
  },
  alinawalflkry: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    marginVertical: 15,
  },
  alinawalflkry2: {
    justifyContent: "center",
    rowGap: 5,
  },
  alinamain: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 45,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "90%",
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    paddingLeft: "11%",
  },
});
