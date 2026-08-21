import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import thumbnail from "../../assets2/Images/thumbnail.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import Header from "@components/Header/Header";
import PostVideo from "../../Fetch_API/PostVideo";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import { getFileObjectFromUri } from "../../../utils/getFileObjectFromUri";
import ItemData from "../../Fetch_API/ItemData";
import { push } from "../../../utils/navigation";
import UploadStory from "../../Fetch_API/UploadStory";
import { blank, User } from "../../assets2/Images/allImages";
import { FontAwesome } from "@expo/vector-icons";

const who_can_watch_video = [
  { label: "Everyone", value: "everyone" },
  { label: "Private", value: "private" },
];

const comments = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const Index = ({ navigation, route }) => {
  const [allow_duet, setAllow_duet] = useState(true);
  const [allow_stich, setAllow_Stich] = useState(true);
  const [video_Description, setVideo_Description] = useState("");
  const [watchVideo, setWatchVideo] = useState("everyone");
  const [allowComment, setAllowComment] = useState("yes");
  const [image, setImage] = useState(route.params.thumbnail);
  const [tagPeople, setTagPeople] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [searchPeople, setSearchPeople] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [videoLinks, setVideoLinks] = useState([]);
  const [newVideoLink, setNewVideoLink] = useState("");

  const profileData = useSelector((state) => state.profile.profileData);

  const videoURL = route.params.videoUrl;
  const stickers = route.params.stickers ?? [];
  const texts = route.params.texts ?? []; // ✅ grab texts from route params

  console.log("ROUTE stickers:", stickers);
  console.log("ROUTE texts:", texts); // ✅ verify texts are coming through

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "https://myfame.com/wp-json/allusers/v1/allUsersData/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid: profileData.id }),
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          const transformedArray = responseData.map((item) => ({
            label: item.username,
            value: item.id,
            image: item.profile_img,
            id: item.id,
          }));
          setAllPeople(transformedArray);
        }
      } catch (error) {
        console.log("Error while fetching all users:", error);
      }
    })();
  }, []);

  const toggleDuet = () => setAllow_duet((previousState) => !previousState);
  const toggleStich = () => setAllow_Stich((previousState) => !previousState);

  const handlePost = async () => {
    setisLoading(true);
    console.log("=== HANDLE POST STARTED ===");

    try {
      if (!watchVideo || !allowComment) {
        alert("Please select all fields");
        setisLoading(false);
        return;
      }
      if (!image) {
        alert("Please select the thumbnail");
        setisLoading(false);
        return;
      }

      const formdata = new FormData();

      formdata.append("merged_url", videoURL);

      const imageObject = {
        uri: image,
        type: "image/jpeg",
        name: "thumbnail.jpg",
      };
      formdata.append("thumbnail", imageObject);

      formdata.append("start_time", "10");
      formdata.append("end_time", "23");
      formdata.append("video_Description", video_Description || "");

      if (Array.isArray(tagPeople) && tagPeople.length > 0) {
        formdata.append("tag_peoples", tagPeople.join(","));
      } else {
        formdata.append("tag_peoples", "");
      }

      formdata.append("video_location", "mohali");

      if (Array.isArray(videoLinks) && videoLinks.length > 0) {
        formdata.append("video_links", videoLinks.join(","));
      } else {
        formdata.append("video_links", "");
      }

      formdata.append("who_watch_video", watchVideo);
      formdata.append("allow_comment", allowComment);
      formdata.append("allow_duet", allow_duet ? "yes" : "no");
      formdata.append("allow_stich", allow_stich ? "yes" : "no");

      // ✅ Send stickers
      formdata.append("stickers", JSON.stringify(stickers));

      // ✅ Send texts — THIS WAS MISSING
      formdata.append("texts", JSON.stringify(texts));

      formdata.append("userid", profileData.id);

      console.log("Sending texts to backend:", JSON.stringify(texts));

      const data = await PostVideo(formdata);
      console.log("PostVideo API response:", data);

      if (data.status !== 200) {
        alert(data.message || "Post failed");
      } else {
        navigation.navigate("BottomNavigator", { screen: "Me" });
      }
    } catch (error) {
      console.log("Error in handlePost:", error.message);
      alert(`Error posting video: ${error.message || "Unknown error"}`);
    } finally {
      setisLoading(false);
      console.log("=== HANDLE POST COMPLETED ===");
    }
  };

  const handleLink = () => {
    setVideoLinks((pre) => [...pre, newVideoLink]);
    setNewVideoLink("");
  };

  const HandleUploadStory = async () => {
    setStoryLoading(true);

    if (watchVideo === null || allowComment === null) {
      alert("Please select all fields");
      setStoryLoading(false);
      return;
    }
    if (image === null) {
      alert("Please select the thumbnail");
      setStoryLoading(false);
      return;
    }

    const video = getFileObjectFromUri(videoURL);
    const imageObject = getFileObjectFromUri(image);
    const formdata = new FormData();

    formdata.append("video", video);
    formdata.append("start_time", "10");
    formdata.append("end_time", "23");
    formdata.append("video_Description", video_Description);
    formdata.append("tag_peoples", tagPeople);
    formdata.append("video_location", "mohali");
    formdata.append("video_links", "");
    formdata.append("who_watch_video", watchVideo);
    formdata.append("allow_comment", allowComment);
    formdata.append("allow_duet", allow_duet ? "yes" : "no");
    formdata.append("allow_stich", allow_stich ? "yes" : "no");
    formdata.append("stickers", JSON.stringify(stickers));
    formdata.append("texts", JSON.stringify(texts)); // ✅ also in story upload
    formdata.append("userid", profileData.id);
    formdata.append("thumbnail", imageObject);

    try {
      const data = await UploadStory(formdata);
      if (data.status !== 200) alert(data.message);
      else navigation.navigate("BottomNavigator", { screen: "Chat" });
      setStoryLoading(false);
    } catch (error) {
      setStoryLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header handlePress={() => navigation.goBack()} title="Post" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Describe your video"
            placeholderTextColor={"grey"}
            style={styles.input}
            multiline
            numberOfLines={6}
            onChangeText={(text) => setVideo_Description(text)}
          />
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.tagContainer}>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}># Hastags</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>@ Mention</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Octicons name="video" size={9} color={"#000"} />
            <Text style={styles.tagText}>Videos</Text>
          </TouchableOpacity>
        </View>

        <View style={{ rowGap: 5 }}>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemContainerStyle={{ height: searchPeople === "" ? 0 : "auto" }}
            onChangeText={(item) => setSearchPeople(item)}
            search
            data={allPeople}
            labelField="label"
            valueField="value"
            placeholder="Tag People"
            searchPlaceholder="Search people"
            value={tagPeople}
            onChange={(item) => setTagPeople(item)}
            renderItem={(item) => (
              <View style={[styles.dropdownItemContainer]}>
                <Image
                  source={item.image !== "" ? { uri: item.image } : blank}
                  style={styles.profileImage}
                />
                <Text style={styles.itemText}>{item.label}</Text>
                {tagPeople.includes(item.id) && (
                  <FontAwesome
                    name="check-circle"
                    size={24}
                    color="green"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </View>
            )}
            renderLeftIcon={() => (
              <Ionicons
                name="person-outline"
                color={"black"}
                size={24}
                style={{ marginRight: 10 }}
              />
            )}
            selectedStyle={styles.selectedStyle}
          />
          <Card title="Add Location" icon={"location-sharp"} />
        </View>

        <View style={{ marginTop: 24 }}>
          <Card
            iconStyle={{ transform: [{ rotate: "45deg" }] }}
            videoLinks={videoLinks}
            onPress={() => setShowAddLink(!showAddLink)}
            variant={"link"}
            title="Add Link"
            icon="link"
          />
          {showAddLink && (
            <View
              style={{
                width: "100%",
                padding: 10,
                borderWidth: 0.5,
                borderColor: "black",
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                style={{ fontSize: 12, color: "black", width: "80%" }}
                onChangeText={setNewVideoLink}
                value={newVideoLink}
              />
              <TouchableOpacity onPress={handleLink}>
                <Text>Add Link</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ rowGap: 10, marginTop: 20 }}>
          <Dropdown
            style={styles.dropdown}
            placeholder="Who can watch this video"
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={who_can_watch_video}
            maxHeight={300}
            placeholderStyle={styles.placeholderStyle}
            labelField="label"
            valueField="value"
            value={watchVideo}
            onChange={(item) => setWatchVideo(item.value)}
            renderLeftIcon={() => (
              <Ionicons
                name="lock-open-outline"
                color={"black"}
                size={24}
                style={{ marginRight: 10 }}
              />
            )}
          />
          <Dropdown
            style={styles.dropdown}
            placeholder="Allow comments"
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={comments}
            maxHeight={300}
            placeholderStyle={styles.placeholderStyle}
            labelField="label"
            valueField="value"
            value={allowComment}
            onChange={(item) => setAllowComment(item.value)}
            renderLeftIcon={() => (
              <Ionicons
                name="chatbox-outline"
                color={"black"}
                size={24}
                style={{ marginRight: 10 }}
              />
            )}
          />
          <Card
            title="Allow Duet"
            variant={"switch"}
            onValueChange={toggleDuet}
            value={allow_duet}
            icon={"people"}
          />
          <Card
            title="Allow Stich"
            variant={"switch"}
            onValueChange={toggleStich}
            value={allow_stich}
            icon={"phone-portrait-outline"}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={storyLoading ? () => {} : HandleUploadStory}
          style={styles.button}
        >
          {storyLoading ? (
            <ActivityIndicator size={26} color={"#fff"} />
          ) : (
            <>
              <Ionicons name="document-outline" size={22} color={"#000"} />
              <Text style={styles.draft}>Upload Story</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isLoading ? () => {} : handlePost}
          style={[styles.button, { backgroundColor: "#00A4FF" }]}
        >
          {isLoading ? (
            <ActivityIndicator size={26} color={"#fff"} />
          ) : (
            <>
              <Feather name="upload" size={22} color={"#fff"} />
              <Text style={[styles.draft, { color: "#fff" }]}>Post</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 25,
  },
  tag: {
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 0.6,
    borderColor: "#D1D1D1",
    borderRadius: 4,
    paddingHorizontal: 8,
    columnGap: 5,
  },
  tagText: { fontSize: 9, fontWeight: "600", color: "#000" },
  selectedStyle: { borderRadius: 12 },
  input: { width: "70%", fontSize: 14, color: "#000000" },
  image: { width: 97, height: 127 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  button: {
    width: "47%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#F6F6F6",
    columnGap: 14,
  },
  draft: { fontSize: 16, fontWeight: "600", lineHeight: 19.36, color: "#000" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginBottom: 25,
  },
  dropdown: { height: 50, width: "100%" },
  icon: { marginRight: 5 },
  placeholderStyle: { fontSize: 14, lineHeight: 19.36, color: "grey" },
  selectedTextStyle: { fontSize: 16 },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 16 },
  profileImage: { width: 40, height: 40, borderRadius: 25 },
  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    margin: 10,
    flex: 1,
  },
});