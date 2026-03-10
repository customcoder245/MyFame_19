import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  // View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import UserData from "../../Fetch_API/UsersData";
import { useSelector, useDispatch } from "react-redux";
import { setFollowerId, setVideoAuthorUserId } from "../../redux/action";
import MyFollowerData from "../../Fetch_API/MyFollowerData";
import {
  blank,
  Following,
  Group80,
  Unfollow,
} from "../../assets2/Images/allImages";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import MyfollowerData2 from "../../Fetch_API/MyfollowerData2";
const { width } = Dimensions.get("window");

const SwipeableUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleState, setToggleState] = useState({});
  const profileData = useSelector((state) => state.profile.profileData);
  const dispatch = useDispatch();
  const [fetchDataOnToggle, setFetchDataOnToggle] = useState(false);
  const { userId } = useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId])
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await UserData();
      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
        console.log("this is data", data);
        const initialToggleState = data.reduce((acc, user) => {
          acc[user.id] = user.follow_status;
          return acc;
        }, {});
        setToggleState(initialToggleState);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleSwipeLeft = (cardIndex) => {
    const user = users[cardIndex];
    // console.log('Swiped left: ', user.username);
    // Alert.alert('Swiped Left', `You swiped left on ${user.username}`);
    // Add your custom functionality here
    {
      profileData && profileData.following_post_count >= 1
        ? console.log("homescreen")
        : console.log("swipe");
    }
  };

  const handleSwipeRight = (cardIndex) => {
    // const user = users[cardIndex];
    // // console.log('Swiped right: ', user.username);
    // // Alert.alert('Swiped Right', `You swiped right on ${user.username}`);
    // // handleToggle(user.id);
    // const userId = profileData.id; // Current user ID
    // const followerId = user.id; // ID of the user being followed
    // MyfollowerData2(userId , followerId)
    // dispatch(fetchProfileData(profileData.id))
  };

  const handleToggle = (userId) => {
    const USERID = profileData.id; // Current user ID
    const followerId = userId; // ID of the user being followed
    MyfollowerData2(USERID, followerId);

    dispatch(fetchProfileData(profileData.id));

    setToggleState((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, follow_status: !toggleState[userId] }
          : user
      )
    );
    // dispatch(setFollowerId(userId));
    // setFetchDataOnToggle(true);
  };

  const handleDataFetched = () => {
    setFetchDataOnToggle(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00E2FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        disableTopSwipe={true}
        disableBottomSwipe={true}
        renderCard={(user) => (
          <View style={styles.cardContainer}>
            {user.profile_img ? (
              <ImageBackground
                source={{ uri: user.profile_img }} // Profile image as background
                style={styles.cardBackground}
                // imageStyle={styles.cardImage}
              >
                <TouchableOpacity onPress={() => handleToggle(user.id)}>
                  <Image
                    source={toggleState[user.id] ? Unfollow : Group80} // Toggle based on local state
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("OtherUserProfileScreen", {
                      item: user,
                    });
                    dispatch(setVideoAuthorUserId(user.id));
                  }}
                  style={styles.overlay}
                >
                  <Text style={styles.name}>
                    {user.username || "Tester Username"}
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            ) : (
              <ImageBackground
                source={blank} // Profile image as background
                style={styles.cardBackground}
                // imageStyle={styles.cardImage}
              >
                <TouchableOpacity onPress={() => handleToggle(user.id)}>
                  <Image
                    source={toggleState[user.id] ? Unfollow : Group80} // Toggle based on local state
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("OtherUserProfileScreen", {
                      item: user,
                    });
                    dispatch(setVideoAuthorUserId(user.id));
                  }}
                  style={styles.overlay}
                >
                  <Text style={styles.name}>
                    {user.username || "Tester Username"}
                  </Text>
                  
                </TouchableOpacity>
              </ImageBackground>
            )}
          </View>
        )}
        keyExtractor={(user) => user.id.toString()}
        onSwipedLeft={handleSwipeLeft}
        onSwipedRight={handleSwipeRight}
        stackSize={3}
        cardIndex={0}
        backgroundColor="transparent"
        stackSeparation={15}
        overlayLabels={{
          left: {
            wrapper: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginRight: 20,
            },
          },
          right: {
            wrapper: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft: 20,
            },
          },
        }}
        animateCardOpacity
        swipeBackCard
      />
      {/* {fetchDataOnToggle && <MyFollowerData onFetched={handleDataFetched} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    height: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: width * 0.9,
    height: width * 1.2, // Dynamic height based on screen width
    borderRadius: 20,
    overflow: "hidden", // Ensures the background image follows the border radius
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Adds shadow effect for Android
  },
  cardBackground: {
    flex: 1,
    justifyContent: "flex-end", // Ensures text is at the bottom
    alignItems: "center",
    width: "100%",
  },
  cardImage: {
    resizeMode: "cover", // Ensures the image covers the entire card
    opacity: 0.8, // Slight transparency to make overlay text more visible
  },
  overlay: {
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay to make text readable
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#bdbdeb",
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SwipeableUserList;
