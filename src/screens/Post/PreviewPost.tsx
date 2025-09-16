import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Video from "react-native-video";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar as EstatusBar } from "expo-status-bar";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import {
  getAlbums,
  getTrack,
  searchTrack as getSearchedTrack,
} from "@services/spotify";
import { Audio, AudioMode } from "expo-av";
import Typography from "@components/typography";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { getFileObjectFromUri } from "../../../utils/getFileObjectFromUri";
import { useSelector } from "react-redux";
import UploadStory from "../../Fetch_API/UploadStory";
import MergeVideoApi from "../../Fetch_API/MergeVideo";

type Props = {};

const convertDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const PreviewPost = (props: Props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedMusic, setSelectedMusic] = useState(
    route.params.musicUrl || ""
  );
  const [tracks, setTracks] = useState([]);
  const [musicName, setMusicName] = useState(route.params.name);
  const [sound, setSound] = useState(null);
  const [availableTracks, setAvailableTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTrack, setSearchTrack] = useState("");
  const [allSearchedTracks, setAllSearchedTracks] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const profileData = useSelector((state) => state.profile.profileData);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      const pauseSound = async () => {
        if(sound){
          console.log("UseEffect : 1")
          await sound.stopAsync();
          // sound.unloadAsync();

        }
      };
      pauseSound();
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const HandleUploadStory = async () => {
    setStoryLoading(true);

    const video = getFileObjectFromUri(route.params.videoUrl);

    const formdata = new FormData();

    formdata.append("video", video);
    formdata.append("audio", selectedMusic);
    formdata.append("userid", profileData.id);
    formdata.append("end_time", route.params.duration);

    try {
      const data = await UploadStory(formdata);
      // console.log(data)

      if (data.status !== 200) alert(data.message);
      else navigation.navigate("BottomNavigator", { screen: "Chat" });
      setStoryLoading(false);
    } catch (error) {
      setStoryLoading(false);
      console.log(error);
    }
  };

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  // useEffect(() => {
  //   (async () => {
  //     if (sound) {
  //       console.log("UseEffect 2")
  //       await sound.stopAsync();
  //     }
  //     if (selectedMusic !== undefined && selectedMusic !== "") {
  //       const { sound } = await Audio.Sound.createAsync({
  //         uri: selectedMusic,
  //       });
  //       await sound.setIsLoopingAsync(true);
  //       setSound(sound);
  //       await sound.playAsync();
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const data = await getAlbums();
      // console.log("DATA : ", data);
      if (data) {
        setTracks(data?.data);
      }
    })();
  }, []);

  const handleMusic = async (music) => {
    try {
      if (sound) {
        console.log("SOUND EXISTS");
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setSelectedMusic("");

        setSelectedMusic(music.preview);
        const { sound: sounds } = await Audio.Sound.createAsync({
          uri: music.preview,
        });
        await sounds.setIsLoopingAsync(true);
        setSound(sounds);
        setMusicName(music.title);
        await sounds.playAsync();
        handleClose();
      } else {
        setSelectedMusic(music.preview);
        const { sound: sounds } = await Audio.Sound.createAsync({
          uri: music.preview,
        });
        await sounds.setIsLoopingAsync(true);
        setSound(sounds);
        setMusicName(music.title);
        await sounds.playAsync();
        handleClose();
      }
    } catch (error) {
      console.log("Error while selecting music : ", error);
    }
  };

  const ChooseMusic = (previewUrl, name) => {
    setIsLoadingTracks(true);
    setSelectedAlbum(previewUrl);
    getTrack(previewUrl)
    .then(async (data) => {
      const tracks = JSON.parse(data)?.data;
      console.log("tracks : ",tracks)
      const filteredTracks = tracks.filter((item) =>
        item.hasOwnProperty("preview") && item.preview != "" 
      );

      setAvailableTracks(filteredTracks);
      setIsLoadingTracks(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoadingTracks(false);
    });
  };

  const handleNext = async () => {
    setIsProcessing(true);
    if (sound) await sound.stopAsync();

    try {
      const video = getFileObjectFromUri(route.params.videoUrl);

      const formdata = new FormData();

      formdata.append("video", video);
      formdata.append("audio", selectedMusic);
      formdata.append("userid", profileData.id);
      formdata.append("start_time", "0");
      formdata.append("end_time", route.params.duration);

      const response = await MergeVideoApi(formdata);

      setIsProcessing(false);
      navigation.navigate("CreatePost", {
        videoUrl: response.data.video_url,
        thumbnail: route.params.thumbnail,
      });

      console.log("response is : ", response);
    } catch (error) {
      setIsProcessing(false);
      console.log("Error while processing video : ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderAvailableTracks = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleMusic(item)}
        style={{ paddingHorizontal: 60, marginVertical: 7 }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.durationText}>
          {convertDuration(item.duration)}
        </Text>
      </TouchableOpacity>
    );
  };

  const RenderAllTracks = ({ item }) => {
    return (
      <View>
        <Pressable style={styles.card} onPress={() => handleMusic(item)}>
          <Image
            source={{ uri: item.album.cover_small }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.title}>{item.title}</Text>
            {/* <Text style={styles.durationText}>
              {convertDuration(item.duration)}
            </Text> */}
          </View>
        </Pressable>
      </View>
    );
  };

  const handleSearchTrack = async () => {
    try {
      setIsLoadingTracks(true)
      const results = await getSearchedTrack(searchTrack);
      setAllSearchedTracks(results.data);
    } catch (error) {
      console.log("ERRORS : ", error);
    }
    finally {
      setIsLoadingTracks(false)
    }
  };

  const RenderTracks = ({ item }) => {
    return (
      <View>
        <Pressable
          style={styles.card}
          onPress={() => ChooseMusic(item.id, item.title)}
        >
          <Image
            source={{ uri: item.picture_small }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.title}</Text>
        </Pressable>
        {selectedAlbum == item.id ? (
          isLoadingTracks ? (
            <ActivityIndicator size="small" color={"blue"} />
          ) : availableTracks.length === 0 ? (
            <Text
              style={{
                fontSize: 12,
                color: "red",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Music not available in your region
            </Text>
          ) : (
            <FlatList
              data={availableTracks}
              renderItem={renderAvailableTracks}
              contentContainerStyle={{ backgroundColor: "white" }}
            />
          )
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <EstatusBar style="light" />

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.addMoreSound}
          onPress={handlePresentModalPress}
        >
          <Typography style={styles.addMoreText}>
            {musicName ? musicName : "Add sound"}
          </Typography>
        </TouchableOpacity>
        <Video
          resizeMode="stretch"
          style={StyleSheet.absoluteFill}
          source={{ uri: route.params?.videoUrl }}
          repeat={true}
          automaticallyWaitsToMinimizeStalling={false}
          playInBackground={false}
          onError={(e)=>console.log("Errror is : ",e)}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={storyLoading ? () => {} : HandleUploadStory}
          style={styles.storyButton}
        >
          {storyLoading ? (
            <ActivityIndicator size={"small"} color="#00A4FF" />
          ) : (
            <Text style={styles.storyText}>Post to story</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={isProcessing ? () => {} : handleNext}
        >
          <Text style={styles.nextButtonText}>
            {" "}
            {isProcessing ? "Processing..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={() => (
            <Pressable onPress={handleClose} style={styles.overlay} />
          )}
        >
          {!isSearching ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: "#00A4FF",
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 }, // Adjusted height for more pronounced bottom shadow
                shadowOpacity: 0.3,
                shadowRadius: 4, // Increased radius for a softer shadow
                elevation: 5,
                width: "60%",
                marginBottom: 10, // Added margin at the bottom for spacing
              }}
            >
              <Text
                onPress={() => setIsSearching(true)}
                style={[styles.title, { textAlign: "center", color: "white" }]}
              >
                Search More Sounds
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <TouchableOpacity onPress={() => setIsSearching(false)}>
                <Entypo name="cross" color={"#666"} size={24} />
              </TouchableOpacity>

              <TextInput
                onChangeText={setSearchTrack}
                value={searchTrack}
                placeholder="Search..."
                placeholderTextColor="#999"
                style={{
                  fontSize: 14,
                  color: "black",
                  flex: 1,
                  marginHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 4,
                  padding: 0,
                  elevation: 2,
                  borderWidth: 0.2,
                  height: 38,
                }}
              />

              <TouchableOpacity onPress={handleSearchTrack}>
                <Ionicons name="search" color={"#666"} size={24} />
              </TouchableOpacity>
            </View>
          )}

          {!isSearching && searchTrack == "" ? (
            <BottomSheetFlatList data={tracks} renderItem={RenderTracks} />
          ) : (
            isLoadingTracks ? <ActivityIndicator size={'small'} color="blue" /> :
            <BottomSheetFlatList
              data={allSearchedTracks}
              renderItem={RenderAllTracks}
            />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default PreviewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    columnGap: 10,
    marginTop: 24,
    marginBottom: 10,
  },
  storyButton: {
    flex: 1,
    backgroundColor: "#F6F6FD",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  storyText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333333",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#00A4FF",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  nextButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    columnGap: 10,
  },
  title: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  addMoreSound: {
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    paddingHorizontal: 25,
    paddingVertical: 15,
    alignSelf: "center",
    position: "absolute",
    zIndex: 1,
    top: 30,
  },
  addMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  durationText: {
    fontSize: 12,
    color: "grey",
  },
});
