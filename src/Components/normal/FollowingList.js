import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import userdata from "../../Fetch_API/UsersData";
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
import { TextInput } from "react-native-gesture-handler";
import { no1 } from "../../assets2/Icons/allIcons";
import { BASE_URL } from "../../Fetch_API/BaseURL";
import store from "../../redux/store";
// import ShowHideAccount from "../../Fetch_API/ShowHideAccount";

const FollowingList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [toggleState, setToggleState] = useState({}); // State to store toggle status for each user
  const profileData = useSelector((state) => state.profile.profileData);
  const dispatch = useDispatch();
  const [fetchDataOnToggle, setFetchDataOnToggle] = useState(false); // State to control fetching data for MyFollowerData
  const { userId } = useContext(AuthContext);
  const navigation = useNavigation();
  const state = store.getState();
  const authorUserId =state.videoAuthorUserId.authorUserId;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [ApiData, setApipData] = useState(null);
  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(formattedQuery) ||
        (user.name && user.name.toLowerCase().includes(formattedQuery))
      );
    });
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // const data = await userdata();
      const response = await fetch(
        `${BASE_URL}/getmyfollowing/v1/getmyFollowingData/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: profileData.id
          }), 
        }
      );
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users
        const initialToggleState = data.reduce((acc, user) => {
          acc[user.id] = user.follow_status; // Assuming follow_status is a boolean
          return acc;
        }, {});

        // console.log("initialToggleState : ",data)
        setToggleState(initialToggleState);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId])
  );
  const apiResponse = useSelector((state) => state.api.responseData);
  const handleToggle = (userId) => {
    // Toggle the state for the specific user
    setToggleState((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Toggle the state
    }));

    // If you need to fetch data or perform any action on toggle
    dispatch(setFollowerId(userId)); // Set followerId in Redux state
    setFetchDataOnToggle(true); // Set flag to fetch data for MyFollowerData
  };

  const handleDataFetched = () => {
    setFetchDataOnToggle(false); // Reset flag after data is fetched
  };
 
  const ShowHideAccount = async (userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/checkAccountTypeFollower/v1/checkAccountTypeFollower/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_user_id: userId,
            follower_id: authorUserId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setApipData(data);

        return data;
      } else {
        console.error('Failed to switch account', data);
        return { error: data.message || 'Failed to fetch user data' };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { error: 'An error occurred. Please try again later.' };
    }
  };

  // Function to handle button press
  const handlePress = async () => {
    const response = await ShowHideAccount(userId); // Call the function here
    if (response && !response.error) {
      // console.log('API response:', response);
    }
  };
 
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
       {/* <ActivityIndicator size="large" color="#00E2FF" /> */}
       <Text>No Following</Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Find your friend...."
          clearButtonMode="always"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(query) => handleSearch(query)}
        />
        <Image source={no1} style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={styles.alinawalflkry}
          onPress={() => {
            navigation.navigate("OtherUserProfileScreen", {
              authorId: item.video_author_id,
              userDatas: ApiData ,
              item,
            });
            dispatch(setVideoAuthorUserId(item.id));
            ShowHideAccount(profileData.id);
          }}
        >
            {item.profile_img ? (
              <Image
                source={{ uri: item.profile_img }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            ) : (
              <Image
                source={blank}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            )}
            <View style={styles.alinamain}>
              <View style={styles.alinawalflkry2}>
                {item.username ? (
                  <Text style={styles.username}>{item.username}</Text>
                ) : (
                  <Text style={styles.username}>Tester Username</Text>
                )}
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleToggle(item.id)}>
                  <Image
                    source={toggleState[item.id] ? Unfollow : Group80} // Toggle based on local state
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {fetchDataOnToggle && <MyFollowerData onFetched={handleDataFetched} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  alinawalflkry: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingLeft: "6%",
    alignItems: "flex-end",
    marginTop: "5%",
    alignItems:"center"
  },
  alinamain: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  alinawalflkry2: {
    justifyContent: "center",
    gap: 3,
  },
  username: {
    fontSize: 13,
  },
  iconContainer: {
    justifyContent: "flex-end",
  },
  searchmn: {
    borderColor: "black",
    alignItems: "center",
    marginTop: "10%",
  },
  searchInput: {
    height: 45,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "90%",
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    marginLeft: "5%",
    paddingLeft: "11%",
  },
  searchIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    top: "25%",
    left: "9%",
  },
});

export default FollowingList;
