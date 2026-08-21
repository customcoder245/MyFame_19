import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import {
  pstvd1,
  pstvd2,
  pstvd4,
  pstvd5,
  pstvd6,
} from "../../assets2/Images/allImages";

export default function TaggedPosts() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Image source={pstvd1} style={styles.image} />
      <Image source={pstvd2} style={styles.image} />
      <Image source={pstvd4} style={styles.image} />
      <Image source={pstvd5} style={styles.image} />
      <Image source={pstvd6} style={styles.image} /> */}
      <Text>Tagged Posts</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding:15
  },
  image: {
    width: "33%",
    borderColor: "white",
    borderWidth: 1,
  },
});
