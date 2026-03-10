import { View, Text, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { Audio } from "expo-av";
interface PropsTypes {
  uri: string;
}

export default function PreviewRecord() {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const { params } = useRoute() as {
    params: { videoUrl: string; musicUrl: string };
  };

  const { videoUrl } = params;
  const musicUrl = params?.musicUrl;

  const onPlayMusic = async () => {
    const { sound } = await Audio.Sound.createAsync({
      uri: musicUrl,
    });
    // await sound.playAsync();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (musicUrl) {
        onPlayMusic();
      }
      // Resume the video when component is focused
      if (video.current) {
        video?.current?.playAsync();
      }

      return () => {
        // Pause the video when component is unfocused
        if (video.current) {
          video?.current?.pauseAsync();
        }
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={StyleSheet.absoluteFill}
        source={{
          // uri: videoUrl,

          uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={setStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
