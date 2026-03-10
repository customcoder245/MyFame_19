import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Message3 } from "../../assets2/Icons/allIcons";

export default function CommentHistory() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.maindv}>
          <Image source={Message3} style={styles.imgpar12} />
          <Text style={{ fontSize: 22, fontWeight: "600" }}>
            No comment history yet
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "300" }}>
            Comments you left will appear here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  texthead: {
    fontSize: 12,
    fontWeight: "300",
    color: "#86878B",
    marginTop: "8%",
  },
  imgpar11: {
    height: 20,
    width: 18,
  },
  txt11: {
    fontSize: 17,
    color: "#161722",
    fontWeight: "500",
  },
  imgpar12: {
    height: 120,
    width: 120,
  },
  imgpar13: {
    height: 35,
    width: 45,
  },
  maindv: {
    alignItems: "center",
    gap: 18,
    marginTop: "30%",
  },
});
