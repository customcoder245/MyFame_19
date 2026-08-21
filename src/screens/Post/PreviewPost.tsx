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
  Modal,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
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
import { Audio } from "expo-av";
import Typography from "@components/typography";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { getFileObjectFromUri } from "../../../utils/getFileObjectFromUri";
import { useSelector } from "react-redux";
import UploadStory from "../../Fetch_API/UploadStory";
import MergeVideoApi from "../../Fetch_API/MergeVideo";
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import {
  fetchAllStickers,
  fetchStickersByCategory,
  getUniqueCategories,
  Sticker,
} from '../../Fetch_API/Stickerapi ';
import * as ImagePicker from "expo-image-picker";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const STICKER_SIZE = 80;
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

const convertDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// ─────────────────────────────────────────────
//  DraggableSticker
// ─────────────────────────────────────────────
const DraggableSticker = ({
  sticker,
  initX,
  initY,
  initScale,
  onPositionChange,
  onScaleChange,
  onRemove,
}) => {
  const translateX = useSharedValue(initX);
  const translateY = useSharedValue(initY);
  const scale = useSharedValue(initScale);
  const savedScale = useSharedValue(initScale);

  const panRef = useRef(null);
  const pinchRef = useRef(null);

  const notifyPosition = (x, y) => {
    "worklet";
    runOnJS(onPositionChange)(x, y);
  };

  const notifyScale = (s) => {
    "worklet";
    runOnJS(onScaleChange)(s);
  };

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      notifyPosition(translateX.value, translateY.value);
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = savedScale.value;
    },
    onActive: (event, ctx) => {
      let newScale = ctx.startScale * event.scale;
      if (newScale < MIN_SCALE) newScale = MIN_SCALE;
      if (newScale > MAX_SCALE) newScale = MAX_SCALE;
      scale.value = newScale;
    },
    onEnd: () => {
      savedScale.value = scale.value;
      notifyScale(scale.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      onGestureEvent={pinchGestureHandler}
    >
      <Animated.View collapsable={false}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={pinchRef}
          onGestureEvent={panGestureHandler}
        >
          <Animated.View
            collapsable={false}
            style={[styles.draggableSticker, animatedStyle]}
          >
            <Image
              source={{ uri: sticker.asset_url }}
              style={{ width: STICKER_SIZE, height: STICKER_SIZE }}
              resizeMode="contain"
            />
            <Pressable onPress={onRemove} style={styles.stickerRemoveBtn}>
              <Text style={styles.stickerRemoveTxt}>✕</Text>
            </Pressable>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
};

// ─────────────────────────────────────────────
//  DraggableText
//  Same pan + pinch as sticker but renders text
// ─────────────────────────────────────────────
const DraggableText = ({
  text,
  initX,
  initY,
  initScale,
  onPositionChange,
  onScaleChange,
  onRemove,
}) => {
  const translateX = useSharedValue(initX);
  const translateY = useSharedValue(initY);
  const scale = useSharedValue(initScale);
  const savedScale = useSharedValue(initScale);

  const panRef = useRef(null);
  const pinchRef = useRef(null);

  const notifyPosition = (x, y) => {
    "worklet";
    runOnJS(onPositionChange)(x, y);
  };

  const notifyScale = (s) => {
    "worklet";
    runOnJS(onScaleChange)(s);
  };

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      notifyPosition(translateX.value, translateY.value);
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = savedScale.value;
    },
    onActive: (event, ctx) => {
      let newScale = ctx.startScale * event.scale;
      if (newScale < MIN_SCALE) newScale = MIN_SCALE;
      if (newScale > MAX_SCALE) newScale = MAX_SCALE;
      scale.value = newScale;
    },
    onEnd: () => {
      savedScale.value = scale.value;
      notifyScale(scale.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      onGestureEvent={pinchGestureHandler}
    >
      <Animated.View collapsable={false}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={pinchRef}
          onGestureEvent={panGestureHandler}
        >
          <Animated.View
            collapsable={false}
            style={[styles.draggableTextContainer, animatedStyle]}
          >
            <Text style={styles.draggableTextContent}>{text}</Text>
            <Pressable onPress={onRemove} style={styles.stickerRemoveBtn}>
              <Text style={styles.stickerRemoveTxt}>✕</Text>
            </Pressable>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
};

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
const PreviewPost = (props) => {
  const route = useRoute();
  const navigation = useNavigation();

  // ── Video source state ──
  const [activeVideoUri, setActiveVideoUri] = useState(
    route.params?.videoUrl || ""
  );
  const [activeVideoDuration, setActiveVideoDuration] = useState(
    route.params?.duration || 0
  );

  // ── Music state ──
  const bottomSheetModalRef = useRef(null);
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

  // ── Sticker state ──
  const stickerBottomSheetRef = useRef(null);
  const [allStickers, setAllStickers] = useState([]);
  const [filteredStickers, setFilteredStickers] = useState([]);
  const [stickerCategories, setStickerCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stickerSearchQuery, setStickerSearchQuery] = useState("");
  const [isLoadingStickers, setIsLoadingStickers] = useState(false);
  const [placedStickers, setPlacedStickers] = useState([]);

  // ── Text overlay state ──
  const [placedTexts, setPlacedTexts] = useState([]);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [currentInputText, setCurrentInputText] = useState("");

  const profileData = useSelector((state) => state.profile.profileData);

  // ─────────────────────────────────────────────
  //  Lifecycle
  // ─────────────────────────────────────────────
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (sound) sound.stopAsync();
    });
    return () => unsubscribe?.();
  }, [navigation, sound]);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  useEffect(() => {
    (async () => {
      const data = await getAlbums();
      if (data) setTracks(data?.data);
    })();
  }, []);

  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);
  const stickerSnapPoints = useMemo(() => ["60%", "85%"], []);

  // ─────────────────────────────────────────────
  //  Pick video from library
  // ─────────────────────────────────────────────
  const handlePickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to access your video library.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        setActiveVideoUri(picked.uri);
        if (picked.duration) {
          setActiveVideoDuration(Math.round(picked.duration / 1000));
        }
        setPlacedStickers([]);
        setPlacedTexts([]);
      }
    } catch (error) {
      console.log("Error picking video:", error);
      alert("Could not open video library. Please try again.");
    }
  };

  // ─────────────────────────────────────────────
  //  Music handlers
  // ─────────────────────────────────────────────
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
        setSound(null);
        setSelectedMusic("");
      }
      setSelectedMusic(music.preview);
      const { sound: sounds } = await Audio.Sound.createAsync({
        uri: music.preview,
      });
      await sounds.setIsLoopingAsync(true);
      setSound(sounds);
      setMusicName(music.title);
      await sounds.playAsync();
      handleClose();
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
          (item) => item.hasOwnProperty("preview") && item.preview !== ""
        );
        setAvailableTracks(filteredTracks);
        setIsLoadingTracks(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingTracks(false);
      });
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

  // ─────────────────────────────────────────────
  //  Next
  // ─────────────────────────────────────────────
  const handleNext = async () => {
    setIsProcessing(true);
    try {
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) await sound.stopAsync();
        } catch (soundError) {
          console.log("Sound error (ignored):", soundError);
        }
      }

      if (!activeVideoUri) throw new Error("Video URL is missing");
      if (!selectedMusic) throw new Error("No music selected");

      const formdata = new FormData();
      formdata.append("video", {
        uri: activeVideoUri,
        type: "video/mp4",
        name: "video.mp4",
      });
      formdata.append("audio", selectedMusic);
      formdata.append("userid", profileData.id);
      formdata.append("start_time", "0");
      formdata.append("end_time", activeVideoDuration.toString());

      // ── Sticker metadata ──
      const normalizedStickers = placedStickers.map((ps, index) => ({
        type: "sticker",
        asset_url: ps.sticker.asset_url,
        x: ps.x / SCREEN_WIDTH,
        y: ps.y / SCREEN_HEIGHT,
        width: (STICKER_SIZE * ps.scale) / SCREEN_WIDTH,
        height: (STICKER_SIZE * ps.scale) / SCREEN_HEIGHT,
        sort_order: index,
      }));

      // ── Text overlay metadata ──
      const normalizedTexts = placedTexts.map((pt, index) => ({
        type: "text",
        text: pt.text,
        x: pt.x / SCREEN_WIDTH,
        y: pt.y / SCREEN_HEIGHT,
        scale: pt.scale,
        sort_order: index,
      }));

      const response = await MergeVideoApi(formdata);

      if (response?.data?.video_url) {
        navigation.navigate("CreatePost", {
          videoUrl: response.data.video_url,
          thumbnail: route.params.thumbnail,
          stickers: normalizedStickers,
          texts: normalizedTexts, // ← text overlays travel here
        });
      } else {
        alert("Video processing completed but no URL returned");
      }
    } catch (error) {
      console.log("handleNext error:", error.message);
      alert("Error: " + (error.message || "Unknown error occurred"));
    } finally {
      setIsProcessing(false);
    }
  };

  const HandleUploadStory = async () => {
    setStoryLoading(true);
    const video = getFileObjectFromUri(activeVideoUri);
    const formdata = new FormData();
    formdata.append("video", video);
    formdata.append("audio", selectedMusic);
    formdata.append("userid", profileData.id);
    formdata.append("end_time", activeVideoDuration.toString());
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

  // ─────────────────────────────────────────────
  //  Sticker handlers
  // ─────────────────────────────────────────────
  const handleOpenStickerSheet = async () => {
    stickerBottomSheetRef.current?.present();
    if (allStickers.length > 0) return;
    setIsLoadingStickers(true);
    try {
      const stickers = await fetchAllStickers();
      setAllStickers(stickers);
      setFilteredStickers(stickers);
      const cats = getUniqueCategories(stickers);
      setStickerCategories(["All", ...cats]);
    } catch (error) {
      console.log("Error loading stickers:", error);
    } finally {
      setIsLoadingStickers(false);
    }
  };

  const handleCloseStickerSheet = () => {
    stickerBottomSheetRef.current?.close();
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setStickerSearchQuery("");
    if (category === "All") {
      setFilteredStickers(allStickers);
      return;
    }
    setFilteredStickers(
      allStickers.filter(
        (s) => s.category_name.toLowerCase() === category.toLowerCase()
      )
    );
  };

  const handleStickerSearch = async (query) => {
    setStickerSearchQuery(query);
    if (query.trim() === "") {
      if (selectedCategory === "All") {
        setFilteredStickers(allStickers);
      } else {
        setFilteredStickers(
          allStickers.filter(
            (s) => s.category_name.toLowerCase() === selectedCategory.toLowerCase()
          )
        );
      }
      return;
    }
    setIsLoadingStickers(true);
    try {
      const results = await fetchStickersByCategory(query);
      setFilteredStickers(results);
    } catch (error) {
      setFilteredStickers(
        allStickers.filter((s) =>
          s.category_name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } finally {
      setIsLoadingStickers(false);
    }
  };

  const handleAddStickerToVideo = (sticker) => {
    setPlacedStickers((prev) => [
      ...prev,
      {
        id: `${sticker.id}_${Date.now()}`,
        sticker,
        x: SCREEN_WIDTH / 2 - STICKER_SIZE / 2,
        y: SCREEN_HEIGHT / 2 - STICKER_SIZE / 2,
        scale: 1,
      },
    ]);
    handleCloseStickerSheet();
  };

  const handleStickerPositionChange = (id, x, y) => {
    setPlacedStickers((prev) =>
      prev.map((ps) => (ps.id === id ? { ...ps, x, y } : ps))
    );
  };

  const handleStickerScaleChange = (id, scale) => {
    setPlacedStickers((prev) =>
      prev.map((ps) => (ps.id === id ? { ...ps, scale } : ps))
    );
  };

  const handleRemoveStickerFromVideo = (id) => {
    setPlacedStickers((prev) => prev.filter((ps) => ps.id !== id));
  };

  // ─────────────────────────────────────────────
  //  Text overlay handlers
  // ─────────────────────────────────────────────
  const handleOpenTextModal = () => {
    setCurrentInputText("");
    setTextModalVisible(true);
  };

  const handleAddTextToVideo = () => {
    if (!currentInputText.trim()) {
      setTextModalVisible(false);
      return;
    }
    setPlacedTexts((prev) => [
      ...prev,
      {
        id: `text_${Date.now()}`,
        text: currentInputText,
        x: SCREEN_WIDTH / 2 - 60,  // approx center
        y: SCREEN_HEIGHT / 2 - 20,
        scale: 1,
      },
    ]);
    setCurrentInputText("");
    setTextModalVisible(false);
  };

  const handleTextPositionChange = (id, x, y) => {
    setPlacedTexts((prev) =>
      prev.map((pt) => (pt.id === id ? { ...pt, x, y } : pt))
    );
  };

  const handleTextScaleChange = (id, scale) => {
    setPlacedTexts((prev) =>
      prev.map((pt) => (pt.id === id ? { ...pt, scale } : pt))
    );
  };

  const handleRemoveText = (id) => {
    setPlacedTexts((prev) => prev.filter((pt) => pt.id !== id));
  };

  // ─────────────────────────────────────────────
  //  Render helpers
  // ─────────────────────────────────────────────
  const renderAvailableTracks = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMusic(item)}
      style={{ paddingHorizontal: 60, marginVertical: 7 }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.durationText}>{convertDuration(item.duration)}</Text>
    </TouchableOpacity>
  );

  const RenderAllTracks = ({ item }) => (
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

  const RenderTracks = ({ item }) => (
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
      {selectedAlbum === item.id ? (
        isLoadingTracks ? (
          <ActivityIndicator size="small" color={"blue"} />
        ) : availableTracks.length === 0 ? (
          <Text style={{ fontSize: 12, color: "red", textAlign: "center", marginBottom: 20 }}>
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

  const RenderStickerItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAddStickerToVideo(item)}
      style={styles.stickerItem}
    >
      <Image
        source={{ uri: item.thumbnail_url }}
        style={styles.stickerThumb}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <EstatusBar style="light" />

        <View style={{ flex: 1 }}>

          {/* ── Top buttons row ── */}
          <View style={styles.topButtonsRow}>

            {/* Add Sound */}
            <TouchableOpacity style={styles.topChip} onPress={handlePresentModalPress}>
              <Ionicons name="musical-notes" size={16} color="#fff" />
              <Typography style={styles.topChipText}>
                {musicName ? musicName : "Add sound"}
              </Typography>
            </TouchableOpacity>

            {/* Add Sticker */}
            <TouchableOpacity style={styles.topChip} onPress={handleOpenStickerSheet}>
              <Text style={{ fontSize: 16 }}>😎</Text>
              <Typography style={styles.topChipText}>Sticker</Typography>
            </TouchableOpacity>

            {/* ✅ Add Text */}
            <TouchableOpacity style={styles.topChip} onPress={handleOpenTextModal}>
              <Ionicons name="text" size={16} color="#fff" />
              <Typography style={styles.topChipText}>Text</Typography>
            </TouchableOpacity>

            {/* Upload from Library */}
            <TouchableOpacity style={styles.topChip} onPress={handlePickVideo}>
              <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
              <Typography style={styles.topChipText}>Upload</Typography>
            </TouchableOpacity>

          </View>

          {/* ── Video ── */}
          <Video
            resizeMode="stretch"
            style={StyleSheet.absoluteFill}
            source={{ uri: activeVideoUri }}
            repeat={true}
            automaticallyWaitsToMinimizeStalling={false}
            playInBackground={false}
            onError={(e) => console.log("Video error:", e)}
          />

          {/* ── Placed stickers ── */}
          {placedStickers.map((ps) => (
            <View key={ps.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <DraggableSticker
                sticker={ps.sticker}
                initX={ps.x}
                initY={ps.y}
                initScale={ps.scale}
                onPositionChange={(x, y) => handleStickerPositionChange(ps.id, x, y)}
                onScaleChange={(scale) => handleStickerScaleChange(ps.id, scale)}
                onRemove={() => handleRemoveStickerFromVideo(ps.id)}
              />
            </View>
          ))}

          {/* ── Placed text overlays ── */}
          {placedTexts.map((pt) => (
            <View key={pt.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <DraggableText
                text={pt.text}
                initX={pt.x}
                initY={pt.y}
                initScale={pt.scale}
                onPositionChange={(x, y) => handleTextPositionChange(pt.id, x, y)}
                onScaleChange={(scale) => handleTextScaleChange(pt.id, scale)}
                onRemove={() => handleRemoveText(pt.id)}
              />
            </View>
          ))}
        </View>

        {/* ── Bottom action row ── */}
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
              {isProcessing ? "Processing..." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Text Input Modal ── */}
        <Modal
          visible={textModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTextModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.textModalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.textModalBox}>
              <Text style={styles.textModalTitle}>Add Text</Text>
              <Text style={styles.textModalHint}>
                You can also use emojis 😄🔥✨
              </Text>

              <RNTextInput
                style={styles.textModalInput}
                placeholder="Type something..."
                placeholderTextColor="#999"
                value={currentInputText}
                onChangeText={setCurrentInputText}
                multiline
                autoFocus
                maxLength={150}
              />

              <View style={styles.textModalButtons}>
                <TouchableOpacity
                  onPress={() => setTextModalVisible(false)}
                  style={styles.textModalCancelBtn}
                >
                  <Text style={styles.textModalCancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddTextToVideo}
                  style={styles.textModalDoneBtn}
                >
                  <Text style={styles.textModalDoneTxt}>Add to Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <BottomSheetModalProvider>

          {/* ── Music Bottom Sheet ── */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={() => (
              <Pressable onPress={handleClose} style={styles.overlay} />
            )}
          >
            {!isSearching ? (
              <View style={styles.searchMoreBtn}>
                <Text
                  onPress={() => setIsSearching(true)}
                  style={[styles.title, { textAlign: "center", color: "white" }]}
                >
                  Search More Sounds
                </Text>
              </View>
            ) : (
              <View style={styles.searchRow}>
                <TouchableOpacity onPress={() => setIsSearching(false)}>
                  <Entypo name="cross" color={"#666"} size={24} />
                </TouchableOpacity>
                <TextInput
                  onChangeText={setSearchTrack}
                  value={searchTrack}
                  placeholder="Search..."
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                />
                <TouchableOpacity onPress={handleSearchTrack}>
                  <Ionicons name="search" color={"#666"} size={24} />
                </TouchableOpacity>
              </View>
            )}
            {!isSearching && searchTrack === "" ? (
              <BottomSheetFlatList data={tracks} renderItem={RenderTracks} />
            ) : isLoadingTracks ? (
              <ActivityIndicator size={"small"} color="blue" />
            ) : (
              <BottomSheetFlatList data={allSearchedTracks} renderItem={RenderAllTracks} />
            )}
          </BottomSheetModal>

          {/* ── Sticker Bottom Sheet ── */}
          <BottomSheetModal
            ref={stickerBottomSheetRef}
            index={0}
            snapPoints={stickerSnapPoints}
            backdropComponent={() => (
              <Pressable onPress={handleCloseStickerSheet} style={styles.overlay} />
            )}
          >
            <View style={styles.stickerSheetHeader}>
              <Text style={styles.stickerSheetTitle}>Stickers</Text>
              <TouchableOpacity onPress={handleCloseStickerSheet}>
                <Entypo name="cross" color={"#333"} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
              <TextInput
                onChangeText={handleStickerSearch}
                value={stickerSearchQuery}
                placeholder="Search by category (e.g. Love, Birthday...)"
                placeholderTextColor="#999"
                style={[styles.searchInput, { flex: 1 }]}
              />
            </View>

            {stickerCategories.length > 0 && (
              <FlatList
                data={stickerCategories}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectCategory(item)}
                    style={[
                      styles.categoryChip,
                      selectedCategory === item && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === item && styles.categoryChipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {isLoadingStickers ? (
              <ActivityIndicator size="large" color="#00A4FF" style={{ marginTop: 40 }} />
            ) : filteredStickers.length === 0 ? (
              <Text style={styles.noResultsText}>
                No stickers found. Try a different category.
              </Text>
            ) : (
              <BottomSheetFlatList
                data={filteredStickers}
                keyExtractor={(item, index) => `${item.id}_${index}`}
                numColumns={4}
                renderItem={RenderStickerItem}
                contentContainerStyle={styles.stickerGrid}
              />
            )}
          </BottomSheetModal>

        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default PreviewPost;

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  topButtonsRow: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10,
  },
  topChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  topChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    maxWidth: 120,
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
  searchMoreBtn: {
    backgroundColor: "#00A4FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 5,
    width: "60%",
    alignSelf: "center",
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  searchInput: {
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
  },
  stickerSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stickerSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  categoryChip: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#00A4FF",
  },
  categoryChipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  stickerGrid: {
    padding: 8,
  },
  stickerItem: {
    flex: 1 / 4,
    aspectRatio: 1,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  stickerThumb: {
    width: "100%",
    height: "100%",
  },
  noResultsText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 40,
  },
  // ── Sticker draggable ──
  draggableSticker: {
    position: "absolute",
    width: STICKER_SIZE,
    height: STICKER_SIZE,
  },
  stickerRemoveBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  stickerRemoveTxt: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  // ── Text draggable ──
  draggableTextContainer: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 8,
    maxWidth: SCREEN_WIDTH * 0.7,
  },
  draggableTextContent: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  // ── Text input modal ──
  textModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  textModalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  textModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  textModalHint: {
    fontSize: 13,
    color: "#888",
    marginBottom: 14,
  },
  textModalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  textModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  textModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  textModalCancelTxt: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  textModalDoneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#00A4FF",
    alignItems: "center",
  },
  textModalDoneTxt: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});