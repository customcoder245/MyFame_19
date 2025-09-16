import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Group207 } from "../../assets2/Icons/allIcons";

export default function ManageDevice() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "8%",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={styles.texthead}>Where are you logged in</Text>
          <Image source={Group207} style={styles.imgpar13} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "13%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "collumn",
              maxWidth: "90%",
              gap: 5,
            }}
          >
            <Text style={styles.txt11}>iPhone 12 Pro</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "300",
                paddingTop: 0,
                maxWidth: "100%",
                color: "#7D7D7D",
              }}
            >
              (Current device)
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "13%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "collumn",
              maxWidth: "90%",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "300",
                paddingTop: 10,
                maxWidth: "100%",
                color: "#7D7D7D",
              }}
            >
              Last Google login on{" "}
            </Text>
            <Text style={styles.txt11}>May 01 2024 1;06PM</Text>
          </View>
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
    fontSize: 16,
    fontWeight: "300",
    color: "#515151",
  },
  imgpar11: {
    height: 20,
    width: 18,
  },
  txt11: {
    fontSize: 19,
    color: "#161722",
    fontWeight: "500",
  },
  imgpar12: {
    height: 12,
    width: 12,
  },
  imgpar13: {
    height: 17,
    width: 17,
  },
});
