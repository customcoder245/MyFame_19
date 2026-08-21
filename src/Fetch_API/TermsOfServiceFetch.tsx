import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  PermissionsAndroid,
  Linking,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import {
  CameraRuntimeError,
  getCameraDevice,
  Templates,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
  Camera as VCamera,
} from "react-native-vision-camera";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import Typography from "@components/typography";
import { push } from "../../utils/navigation";
import { Audio } from "expo-av";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../Context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as ImagePicker from "expo-image-picker"; // ✅ already in package.json
import {
  Gesture,
  GestureDetector,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import {
  getAlbums,
  getTrack,
  searchTrack as getSearchedTrack,
} from "@services/spotify";
import RNFS from "react-native-fs";
import { TextInput } from "react-native-paper";
import { useIsForeground } from "@hooks/useIsForeground";

const convertDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TermsOfServiceFetch({ navigation }) {
  const devices = VCamera.getAvailableCameraDevices();
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
  let myDevice = useCameraDevice(cameraPosition);
  const [device, setDevice] = useState(myDevice);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<VCamera>(null);
  const [time, setTime] = useState(0);
  const [sound, setSound] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState("");
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [torch, setTorch] = useState<"off" | "on">("off");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [longPress, setLongPress] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [musicName, setMusicName] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [availableTracks, setAvailableTracks] = useState([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTrack, setSearchTrack] = useState("");
  const [isPermssion, setIsPermssion] = useState(false);
  const [allSearchedTracks, setAllSearchedTracks] = useState([]);
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const microphone = useMicrophonePermission();

  const isActive = isFocused && isForeground;

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const format = useCameraFormat(device, [
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: "max" },
  ]);

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video)`
        : undefined;
    console.log(`Camera: ${device?.name} | Format: ${f}`);
  }, [device?.name, format]);

  useEffect(() => {
    (async () => {
      const storagePermission = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );

      if (
        storagePermission != RESULTS.GRANTED &&
        Platform.OS === "android" &&
        Platform.Version < 29
      ) {
        setIsPermssion(false);
        Linking.openSettings();
        return;
      }

      const microphonePersmission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if (microphonePersmission !== RESULTS.GRANTED) {
        setIsPermssion(false);
        Linking.openSettings();
        return;
      }
      if (!hasPermission) {
        const result = await requestPermission();
        if (result === false) {
          setIsPermssion(false);
          Linking.openSettings();
          return;
        }
      }
      setIsPermssion(true);
    })();
  }, [hasPermission]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      const pauseSound = async () => {
        if (sound) {
          await sound.stopAsync();
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

  function toggleCameraFacing() {
    const position = device?.position == "front" ? "back" : "front";
    setDevice(getCameraDevice(devices, position));
  }

  const toggleTorch = () => {
    setTorch((pre) => (pre === "on" ? "off" : "on"));
  };

  const toggleTimer = () => {
    setTimer((prev) =>
      prev === 0 ? 3 : prev === 3 ? 5 : prev === 5 ? 10 : 0
    );
  };

  useEffect(() => {
    (async () => {
      const data = await getAlbums();
      if (data) {
        setTracks(data?.data);
      }
    })();
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  // ─────────────────────────────────────────────
  //  ✅ Pick video from gallery
  //  Navigates straight to PreviewPost just like
  //  a recorded video would
  // ─────────────────────────────────────────────
  const handlePickVideoFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to your photo library to pick a video."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];

        // Generate thumbnail from picked video
        let thumbnailUri = "";
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(picked.uri, {
            time: 1000,
          });
          thumbnailUri = uri;
        } catch (thumbError) {
          console.log("Thumbnail generation failed:", thumbError);
        }

        // duration from expo-image-picker is in milliseconds → convert to seconds
        const durationInSeconds = picked.duration
          ? Math.round(picked.duration / 1000)
          : 0;

        // Navigate to PreviewPost exactly the same as after recording
        navigation.navigate("PreviewPost", {
          musicUrl: selectedMusic,
          videoUrl: picked.uri,
          thumbnail: thumbnailUri,
          name: musicName,
          duration: durationInSeconds,
        });
      }
    } catch (error) {
      console.log("Error picking video from library:", error);
      Alert.alert("Error", "Could not open video library. Please try again.");
    }
  };

  const handleRecord = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        setTime(0);
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        if (timer > 0) {
          setCountdown(timer);
        } else {
          startRecording();
        }
      }
    }
  };

  const handleRecord2 = async () => {
    if (cameraRef.current) {
      setLongPress(true);
      if (timer > 0) {
        setCountdown(timer);
      } else {
        startRecording();
      }
    }
  };

  const stopRecord = async () => {
    if (cameraRef.current) {
      if (isRecording && longPress) {
        if (sound) {
          await sound?.stopAsync();
        }
        setTime(0);
        cameraRef.current.stopRecording();
        setIsRecording(false);
        setLongPress(false);
      }
    }
  };

  const togglePausing = async () => {
    if (isPaused) {
      await cameraRef?.current?.resumeRecording();
      setIsPaused(false);
    } else {
      await cameraRef?.current?.pauseRecording();
      setIsPaused(true);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);
    if (sound) {
      await sound.playAsync();
    }

    cameraRef.current?.startRecording({
      fileType: "mp4",
      onRecordingFinished: async (video) => {
        try {
          if (sound) {
            await sound.stopAsync();
          }
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            `file://${video.path}`,
            { time: 15000 }
          );
          navigation.navigate("PreviewPost", {
            musicUrl: selectedMusic,
            videoUrl: `file://${video.path}`,
            thumbnail: uri,
            name: musicName,
            duration: video.duration,
          });
        } catch (error) {
          console.log("ERROR ON VIDEO FINISH:", error);
        }
      },
      onRecordingError: async (error) => {
        if (!hasPermission) {
          const result = await requestPermission();
          if (result === false) {
            Linking.openSettings();
            setIsPermssion(false);
          }
        } else {
          console.log("ERROR IS:", error);
        }
      },
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    } else if (countdown === 0 && timer > 0) {
      startRecording();
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  const handleMusic = async (music) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSelectedMusic(music.preview);
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: music.preview,
        });
        await newSound.setIsLoopingAsync(true);
        setSound(newSound);
        setMusicName(music.title);
        handleClose();
      } else {
        setSelectedMusic(music.preview);
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: music.preview,
        });
        await newSound.setIsLoopingAsync(true);
        setSound(newSound);
        setMusicName(music.title);
        handleClose();
      }
    } catch (error) {
      console.log("Error while selecting music:", error);
    }
  };

  const ChooseMusic = (previewUrl, name) => {
    setIsLoadingTracks(true);
    setSelectedAlbum(previewUrl);
    getTrack(previewUrl)
      .then(async (data) => {
        const tracks = JSON.parse(data)?.data;
        const filteredTracks = tracks.filter(
          (item) => item.hasOwnProperty("preview") && item.preview != ""
        );
        setAvailableTracks(filteredTracks);
        setIsLoadingTracks(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingTracks(false);
      });
  };

  const renderAvailableTracks = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleMusic(item)}
        style={{ paddingHorizontal: 60, marginVertical: 7 }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.durationText}>{convertDuration(item.duration)}</Text>
      </TouchableOpacity>
    );
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
          </View>
        </Pressable>
      </View>
    );
  };

  const handleSearchTrack = async () => {
    try {
      setIsLoadingTracks(true);
      const results = await getSearchedTrack(searchTrack);
      setAllSearchedTracks(results.data);
    } catch (error) {
      console.log("ERRORS:", error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const onInitialized = useCallback(() => {
    console.log("Camera initialized!");
  }, []);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <GestureDetector
        gesture={Gesture.Tap()
          .numberOfTaps(2)
          .onEnd(() => {
            runOnJS(toggleCameraFacing)();
          })}
      >
        <View style={{ flex: 1 }}>
          {device != null && isPermssion && (
            <VCamera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              ref={cameraRef}
              onInitialized={onInitialized}
              onError={onError}
              fps={16}
              format={format}
              outputOrientation="device"
              video={true}
              audio={microphone.hasPermission}
              torch={torch}
            />
          )}

          {!isRecording && (
            <View style={styles.cameraSettingsContainer}>
              <TouchableOpacity
                style={styles.cameraSettingsItem}
                onPress={toggleCameraFacing}
              >
                <MaterialIcons name="cameraswitch" size={24} color="#fff" />
                <Text style={styles.cameraSettingsText}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraSettingsItem}
                onPress={toggleTimer}
              >
                {timer === 5 ? (
                  <Text style={styles.seconds}>
                    5<Text style={{ fontSize: 16 }}>s</Text>
                  </Text>
                ) : (
                  <MaterialIcons
                    name={
                      timer === 3
                        ? "timer-3-select"
                        : timer === 10
                        ? "timer-10-select"
                        : "timer-off"
                    }
                    size={26}
                    color="#fff"
                  />
                )}
                <Text style={styles.cameraSettingsText}>Timer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraSettingsItem}
                onPress={toggleTorch}
              >
                <MaterialIcons
                  name={torch ? "flash-on" : "flash-off"}
                  size={26}
                  color="#fff"
                />
                <Text style={styles.cameraSettingsText}>Flash</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.option2}>
            {isRecording && (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={togglePausing}
              >
                <MaterialCommunityIcons
                  name={isPaused ? "play" : "pause"}
                  size={50}
                  color="red"
                />
              </TouchableOpacity>
            )}

            {/* ✅ Gallery button — left of record button, hidden while recording */}
            {!isRecording && (
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handlePickVideoFromLibrary}
              >
                <Ionicons name="images-outline" size={32} color="#fff" />
                <Text style={styles.galleryText}>Gallery</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.button}
              onPressOut={stopRecord}
              onLongPress={handleRecord2}
              onPress={handleRecord}
            >
              {isRecording ? (
                <Entypo name="controller-stop" size={60} color="red" />
              ) : (
                <Fontisto name="record" size={60} color="red" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addMoreSound}
            onPress={handlePresentModalPress}
          >
            <Typography style={styles.addMoreText}>
              {musicName ? musicName : "Add sound"}
            </Typography>
          </TouchableOpacity>

          {countdown > 0 && (
            <View style={styles.timerBox}>
              <Text style={styles.timer}>{countdown}</Text>
            </View>
          )}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
          </View>
        </View>
      </GestureDetector>

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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                width: "60%",
                marginBottom: 10,
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
          ) : isLoadingTracks ? (
            <ActivityIndicator size={"small"} color={"blue"} />
          ) : (
            <BottomSheetFlatList
              data={allSearchedTracks}
              renderItem={RenderAllTracks}
            />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
  },
  option1: {
    flex: 1,
  },
  option2: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: "auto",
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    bottom: 10,
  },
  timer: {
    fontSize: 46,
    color: "#fff",
    fontWeight: "600",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderWidth: 7,
    borderColor: "#fff",
    borderRadius: 50,
  },
  pauseButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderWidth: 7,
    borderColor: "#fff",
    borderRadius: 50,
    position: "absolute",
    left: 10,
  },
  // ✅ Gallery button styles
  galleryButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 40,
    rowGap: 4,
  },
  galleryText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  seconds: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  timerBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1,
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
    top: 30,
  },
  addMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  timerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginBottom: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  cameraSettingsContainer: {
    position: "absolute",
    padding: 14,
    marginTop: 30,
    right: 0,
    rowGap: 19,
    zIndex: 1,
  },
  cameraSettingsItem: {
    alignItems: "center",
    rowGap: 6,
  },
  cameraSettingsText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "400",
    lineHeight: 12.74,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "red",
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
  durationText: {
    fontSize: 12,
    color: "grey",
  },
});