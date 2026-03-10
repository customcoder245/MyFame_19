import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import LikedPostsFetch from "../../Fetch_API/LikedPostsFetch";
import { AuthContext } from "../../Context/AuthContext";
import { placeholder_image } from "../../assets2/Images/allImages";
import { videoicon } from "../../assets2/Icons/allIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  setUserProfileImageVideoScroll,
  setUserVideoScroll,
} from "../../redux/action";
import { Ionicons } from "@expo/vector-icons";
import SearchRandom from "../../Fetch_API/SearchRandom";

const SearchRandomVideo = (props) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchLikedPosts = async () => {
        try {
          console.log("User ID:", userId);
          const response = await SearchRandom(userId);
          console.log("ALL POSTS:", response);

          setAllPosts(response?.data?.liked_videos || []);
        } catch (error) {
          console.error("Error fetching liked posts:", error);
          setAllPosts([]);
        } finally {
          setLoading(false); // Stop the loader after fetching data
        }
      };

      fetchLikedPosts();
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
            dispatch(setUserProfileImageVideoScroll(item.profile_img));
            props.navigation.navigate("AllPostScroll", { index, allPosts });
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
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, placeholder: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Display loader while fetching data
       <ActivityIndicator size="large" color="#00E2FF" />
      ) : allPosts.length > 0 ? (
        <FlatList
          data={allPosts}
          renderItem={renderAllPosts}
          keyExtractor={(item) => (item.post_id ? item.post_id.toString() : item.key)}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: "15%",
  },
  imageContainer: {
    flex: 1,
    margin: 2,
    maxWidth: "33.33%",
  },
  image: {
    width: '100%',
    height: 170,
  },
  videoIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  row: {
    justifyContent: 'flex-start',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchRandomVideo;
