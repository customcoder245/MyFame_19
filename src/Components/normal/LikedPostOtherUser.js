import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import LikedPostFetchOtherProfile from "../../Fetch_API/LikedPostFetchOtherProfile";
import { placeholder_image } from "../../assets2/Images/allImages"; // Import the placeholder image
import { videoicon } from "../../assets2/Icons/allIcons";
import {
  setUserVideoScroll,
  setUserProfileImageVideoScroll,
} from "../../redux/action";
import { Ionicons } from "@expo/vector-icons";

const LikedPostOtherUser = (props) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchCommentData = async () => {
        try {
          const response = await LikedPostFetchOtherProfile(userId);
          console.log("ALL POSTS:", response.data.liked_videos);
          setAllPosts(response.data.liked_videos || []); // Handle no data scenario
        } catch (error) {
          console.error("Error fetching AllPosts:", error);
          setAllPosts([]); // Handle error state
        } finally {
          setLoading(false); // Stop the loader after fetching data
        }
      };
      fetchCommentData();
    }, [userId])
  );

  const renderAllPosts = ({ item, index }) => {
    if (item.placeholder) {
      return <View style={styles.imageContainer} />;
    }
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setUserVideoScroll(item.video_url));
            dispatch(setUserProfileImageVideoScroll(item.profile_img)); // Dispatch action with URL
            props.navigation.navigate("AllPostScroll", {
              index,
              allPosts,
            });
          }}
        >
          <Image
            source={item.thumbnail_url ? { uri: item.thumbnail_url } : placeholder_image}
            style={styles.image}
          />
        </TouchableOpacity>
                <Ionicons name="videocam" size={24} color="white" style={styles.videoIcon} />

      </View>
    );
  };

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, placeholder: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <View style={styles.container1}>
      {loading ? (
        <ActivityIndicator size="large" color="#00E2FF" /> // Show loader when loading
      ) : allPosts.length > 0 ? (
        <FlatList
          data={formatData(allPosts, 3)}
          renderItem={renderAllPosts}
          keyExtractor={(item) =>
            item.post_id ? item.post_id.toString() : item.key
          }
          numColumns={3} // Fixed number of columns
          columnWrapperStyle={styles.row} // Style for each row
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    // marginBottom: "15%",
  },
  imageContainer: {
    flex: 1,
    margin: 2, // Add some spacing between images
    maxWidth: "33.33%", // Ensure a maximum of 3 items per row
  },
  image: {
    width: "100%", // Make sure the image fills the container width
    height: 170, // Maintain the original height for the image
  },
  videoIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  row: {
    justifyContent: "flex-start", // Align items to the start of the row
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default LikedPostOtherUser;
