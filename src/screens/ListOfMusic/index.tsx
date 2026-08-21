import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

import { Audio } from "expo-av";

import { getAlbums, getTrack } from "@services/spotify";
import { useNavigation, useRoute } from "@react-navigation/native";
import { pop } from "../../../utils/navigation";

const RenderItem = ({ item, onMusicSelected }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackRef, setTrackRef] = useState("");
  const playSound = async (previewUrl: string) => {
    getTrack(previewUrl).then(async (data) => {
      console.log("data", JSON.stringify(JSON.parse(data), null, 2));
      const music = JSON.parse(data)?.items[0];

      const { sound } = await Audio.Sound.createAsync({
        uri: music?.preview_url,
      });
      setIsPlaying(true);
      setSound(sound);
      console.log("Playing Sound");
      await sound.playAsync();
    });
  };

  const onPress = async (previewUrl: string) => {
    getTrack(previewUrl).then(async (data) => {
      const music = JSON.parse(data)?.items[0];
      await sound?.stopAsync();
      onMusicSelected(music?.preview_url);
    }).catch(err=>console.log(err))
  };

  useEffect(() => {
    if (sound)
      sound?.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (!playbackStatus.isLoaded) {
          if (playbackStatus.error) {
            console.error("Playback error:", playbackStatus.error);
          }
        } else {
          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.log("Finished playing audio.");
            setIsPlaying(false);
            sound?.stopAsync(); // Optionally stop after playing once
          }
        }
      });
  }, [sound]);

  const onStop = async () => {
    setIsPlaying(false);
    await sound?.stopAsync();
  };

  return (
    <Pressable style={styles.card} onPress={() => onPress(item.id)}>
      <Text style={styles.title}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => (isPlaying ? onStop() : playSound(item.id))}
      >
        {isPlaying ? (
          <Entypo name="controller-stop" size={24} color="black" />
        ) : (
          <AntDesign name="play" size={24} color="black" />
        )}
      </TouchableOpacity>
    </Pressable>
  );
};

export default function ListOfMusic() {
  const [tracks, setTracks] = useState([]);
  const navigation = useNavigation()

  const { params } = useRoute();
  const {onSelectedMusic} = params;
  // console.log(onSelectedMusic)

  const fetchAllAlbums = async () => {
    const data = await getAlbums();
    console.log(JSON.stringify(data?.albums?.items, null, 2));

    const newTracks = data?.albums?.items;
    setTracks(newTracks);
  };

  useEffect(() => {
    fetchAllAlbums();
  }, []);

  const onMusicSelected = (music: string) => {
    onSelectedMusic(music);
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderItem item={item} onMusicSelected={onMusicSelected} />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
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
  },
  title: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  item: {
    marginBottom: 8,
  },
});
