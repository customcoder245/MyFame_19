import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

export default function VideoThumbnailItem({ video, thumbnail }) {
  return (
    <View style={styles.container}>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={styles.errorContainer}>
          <Text>Thumbnail generation failed</Text>
          <Image 
            source={{ uri: 'https://via.placeholder.com/320x180.png?text=No+Thumbnail' }} 
            style={styles.thumbnail} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  thumbnail: {
    width: 320,
    height: 180,
  },
  errorContainer: {
    alignItems: 'center',
  },
});
