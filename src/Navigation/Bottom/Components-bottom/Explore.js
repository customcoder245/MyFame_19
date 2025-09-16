   
   
   
   
   
     import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import ExploreCategoriesFetch from "../../../Fetch_API/ExploreCategoriesFetch";
import { AuthContext } from "../../../Context/AuthContext";
import AllPostsExploreFetch from "../../../Fetch_API/AllPostsExploreFetch";
import SearchRandom from "../../../Fetch_API/SearchRandom"; // Ensure you import the Search API function
import { setUserVideoScroll, setUserProfileImageVideoScroll } from "../../../redux/action";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { blank, placeholder_image } from "../../../assets2/Images/allImages";
import { Vector13 } from "../../../assets2/Icons/allIcons";

export default function Explore(props) {
  const [categoryData, setCategoryData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(""); // State for search text
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await ExploreCategoriesFetch();
      setCategoryData(data);
    };

    fetchCategory();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchCommentData = async () => {
        try {
          const response = await AllPostsExploreFetch(userId);
          console.log("ALL POST:", response);
          if (response && response.videos) {
            setAllPosts(response.videos);
          } else {
            setAllPosts([]);
          }
        } catch (error) {
          console.error("Error fetching AllPosts:", error);
          setAllPosts([]);
        }
      };

      fetchCommentData();
    }, [userId])
  );

  // Function to handle search based on searchText
  const handleSearch = async (text) => {
    if (text.trim()) {
      try {
        const response = await SearchRandom(userId, text); // Call the Search API
        console.log("Search Results:", response);
        setAllPosts(response?.data?.liked_videos || []); // Update allPosts with search results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      // If searchText is empty, call the Explore API again
      const response = await AllPostsExploreFetch(userId);
      setAllPosts(response?.videos || []);
    }
  };
  

  const handleClearSearch = () => {
    setSearchText(""); // Clear the search text
    handleSearch(""); // Call Explore API again
  };

  const renderAllPosts = ({ item, index }) => {
    if (item.placeholder) {
      return <View />;
    }
    
    return (
<View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setUserVideoScroll(item.video_url));
            dispatch(setUserProfileImageVideoScroll(item.profile_img));
            props.navigation.navigate("AllPostScroll", {
              index,
              allPosts,
            });
          }}
          style={{maxWidth:"100%" ,}}
        >
          <Image
            source={
              item.thumbnail_url
                ? { uri: item.thumbnail_url }
                : placeholder_image
            }
            style={styles.image}
          />
        </TouchableOpacity>
                <Ionicons name="videocam" size={24} color="white" style={styles.videoIcon} />

        <View style={{ flex: 1 }}>
          <Text style={styles.tittle}>
            {item.video_title ? item.video_title : null}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginTop: 4,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.vdmncnt2}>
              <Image
                style={{ width: 25, height: 25, borderRadius: 50 }}
                source={
                  item.video_author_profile_img
                    ? { uri: item.video_author_profile_img }
                    : blank
                }
              />
              <Text style={styles.username}>{item.video_username}</Text>
            </View>
            <View style={styles.vdmncnt2}>
              <Image style={{ width: 15, height: 15 }} source={Vector13} />
              <Text>{item.video_likes}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: "20%" }}>
      <View style={styles.searchmn}>
      {/* Container for TextInput and icons */}
      <View style={styles.inputContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="gray" 
          style={styles.searchIcon} // Style for the search icon
        />

        <TextInput
          style={styles.textInput}
          placeholder="Explore any video"
          placeholderTextColor="#969696"
          value={searchText} // Bind the TextInput value to state
          onChangeText={(text) => {
            setSearchText(text); // Update state on text change
            handleSearch(text); // Call handleSearch with the new text
          }}
        />

        {/* Clear button (cross icon) */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons
              name="close-circle"
              size={24}
              color="gray"
              style={styles.clearIcon} // Style for the clear icon
            />
          </TouchableOpacity>
        )}
      </View>
    </View>

        {allPosts.length > 0 ? (
          <FlatList
            data={allPosts}
            renderItem={renderAllPosts}
            keyExtractor={(item) =>
              item.post_id ? item.post_id.toString() : item.key
            }
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between'}}
            contentContainerStyle={styles.contentContainer}
            key={`${allPosts.length}-${userId}`}
          />
        ) : (
          <Text style={styles.noPostsText}></Text>
        )}
      </ScrollView>
    </View>
  );
}
const screenWidth = Dimensions.get("window").width;

// Add styles here

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: "1%",
    paddingTop: "5%",
  },
  searchmn: {
    borderColor: "black",
    alignItems: "center",
    marginTop: 20,
    display: "flex",
  },
  textInput: {
    height: 45,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "75%",
    borderRadius: 18,
    marginTop: "2%",
  },
  imageContainer: {
    width: screenWidth / 2 - 16, // 50% width with a bit of margin adjustment
    margin: 8,
    justifyContent: "center",
    marginTop: "7%",
  },
  image: {
    width: "100%",
    height: 244,
    borderRadius: 4,
  },
  videoIcon: {
    position: "absolute",
    top: 8,
    right: 12,
  },
  vdmncnt2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap:5   
  },
  tittle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: "1%",
  },
  username: {
    fontSize: 12,
    fontWeight: "400",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 18,
    height: 45,
    paddingHorizontal: 13,
  },
  contentContainer: {
    paddingHorizontal: 4, // Padding around the whole FlatList content
  },
});