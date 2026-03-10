import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  ActivityIndicator,
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
} from "../../assets2/Images/allImages";
import TotalLikesData from "../../Fetch_API/TotalLikesData";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../Context/AuthContext";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import MyFollowerData from "../../Fetch_API/MyFollowerData";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import FetchOtherUserProfile from "../../Fetch_API/FetchOtherUserProfile";
import UserData from "../../Fetch_API/UsersData";
import { setProfileScreenFollowerId } from "../../redux/action";
import FollowOnProfile from "../../Fetch_API/FollowOnProfile";
import PostTopNav2 from "./PostTopNav2";
import { Ionicons } from "@expo/vector-icons";
import useAppState from "../../StackScreens/useAppState";
import store from "../../redux/store";

export default function OtherUserProfileScreen({ props }) {
  const route = useRoute();
  //  console.log("This is authorid" ,route.params.authorId)
  const state = store.getState();
  const { logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  const [userData, setUserData] = useState({});
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
  const [isLoading, setIsLoading] = useState(true);
  const [screenLoading, setScreenLoading] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const authorUserId = state.videoAuthorUserId.authorUserId;
  // const { appStateVisible, userStatus, backgroundColor } = useAppState();
  // const { userStatus, handleUserInteraction } = useAppState();
  const openModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setProfileModal(false);
  };

  const { item } = route.params; // Accessing the passed data

  useEffect(() => {
    const fetchData = async () => {
      setScreenLoading(true);
      try {
        const responseData = await FetchOtherUserProfile(); // Assuming SingleVideoComments needs postId as a parameter
        if (responseData && responseData.data) {
          setUserData(responseData.data); // Set the fetched user data in state
          false; // Set loading state to false
        } else {
          setError(error, "Failed to fetch user data");
          setIsLoading(false); // Set loading state to false
        }
        setScreenLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Screen B</Text>
        {userDatas && (
            <Text>{JSON.stringify(userDatas, null, 2)}</Text> // Display the passed data
        )}
    </View> */}

      <View style={styles.image_pro_pen}>
        <TouchableOpacity onPress={openModal}>
          {userData && userData.profile_img ? (
            <Image
              source={{ uri: userData.profile_img }}
              resizeMode="cover"
              style={styles.image}
            />
          ) : (
            <Image source={blank} style={styles.image} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.jhnkrmn}>
        <Text style={styles.jhnkr}>
          @{userData ? userData.username : " "}
          {/* {/ <Text>{userData.username ? }</Text> /} */}
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
            {userData ? userData.total_posts : " "}
          </Text>
          <Text style={styles.data_txt}>Posts</Text>
        </View>
        <View style={styles.data_mn_23}>
          <Text style={styles.data_num}>
            {userData ? userData.followers_count : " "}
          </Text>
          <Text style={styles.data_txt}>Followers</Text>
        </View>
        <View style={styles.data_mn_23}>
          <Text style={styles.data_num}>
            {userData ? userData.following_count : " "}
          </Text>
          <Text style={styles.data_txt}>Following</Text>
        </View>
        <View style={styles.data_mn_23}>
          <Text style={styles.data_num}>
            {userData ? userData.total_like_counts : " "}
          </Text>
          <Text style={styles.data_txt}>Likes</Text>
        </View>
      </View>

      <View style={styles.sven1_Seven2_mn_al}>
        <TouchableOpacity
          style={{
            width: 55,
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
          onPress={() => {
            dispatch(setProfileScreenFollowerId(userData.id));
          }}
        >
          <Ionicons name="bookmark-outline" size={27} color="black" />
        </TouchableOpacity>
      </View>
 
      <Text style={styles.text}>
        {userData ? userData.about : "Loading..."}
      </Text>

      {/* {/ <Text style={styles.alknwnsng}>Also known as singer</Text> /} */}

      {/* {/ Render Following component /} */}

      {!screenLoading ? (
        item.follow_status ? (
          <PostTopNav2 />
        ) : userData.account_type == "1" ? (
          <PostTopNav2 />
        ) : (
          <Text style={styles.private}>This account is private</Text>
        )
      ) : (
        <ActivityIndicator size="small" />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("CreatorTools");
                setModalVisible(false);
              }}
            >
              <View style={styles.srctxt_mdl}>
                <Image source={Vector4} />
                <Text style={styles.modalText}>Creator Tools</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("QR Screen");
                setModalVisible(false);
              }}
            >
              <View style={styles.srctxt_md3}>
                <Image source={qrcode1} />
                <Text style={styles.modalText}>My QR code</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("PrivacyPolicy");
                setModalVisible(false);
              }}
            >
              <View style={styles.srctxt_md2}>
                <Image source={Vector5} />
                <Text style={styles.modalText}>Privacy and Settings</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>X</Text>
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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          {userData && userData.profile_img ? (
            <Image
              source={{ uri: userData.profile_img }}
              resizeMode="cover"
              style={{ height: "40%", width: "80%", borderRadius: 200 }}
            />
          ) : (
            <Image
              source={blank}
              style={{ height: "40%", width: "80%", borderRadius: 200 }}
            />
          )}
        </TouchableOpacity>
      </Modal>
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
  image2: {
    height: 25,
    width: 25,
    position: "absolute",
    top: "80%",
    right: "3%",
    borderRadius: 30,
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
    fontSize: 16.23,
    fontWeight: "bold",
    textAlign: "center",
  },
  data_txt: {
    fontSize: 13,
    color: "#6D6969",
    marginTop: 7,
  },
  all_data_prst: {
    display: "flex",
    flexDirection: "row",
    // gap: -80,
    marginTop: 20,
  },
  data_mn_23: {
    marginHorizontal: 16, // Adjust this value to decrease spacing
    alignItems: "center", // Optional: Center align the text
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: "65%",
    height: "100%",
  },
  private: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    color: "black",
  },
  modalText: {
    fontSize: 18,
    marginBottom: "8%",
    color: "#302E2E",
    fontWeight: "500",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
  },
  srctxt_mdl: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginLeft: "-40%",
  },
  srctxt_md2: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginLeft: "-25%",
  },
  srctxt_md3: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginLeft: "-42%",
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
    top: "8%",
    width: "100%",
  },
  text: {
    fontSize: 13,
    marginVertical: 10,
    fontWeight: "400",
    width: "85%",
    textAlign: "center",
    color: "#ABABAB",
  },
  openButton: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Dim background
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },

  closeButton: {
    padding: 10,
    backgroundColor: "lightcoral",
    borderRadius: 5,
  },
});
