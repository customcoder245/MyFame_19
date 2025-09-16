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
import { toggle } from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";
import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
export default function DataSaver() {
  const toggleSource = toggle;
  const onSource = on;

  const { imageSource1, switchImage1 } = ChangeToggleImage(
    toggleSource,
    onSource
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={switchImage1}>
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
                maxWidth: "88%",
              }}
            >
              <Text style={styles.txt11}>Data saver</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Clear your cache to free up space .This wont affect your app
                experience. Clear your cache to free up space .This wont affect
                your app experience.{" "}
              </Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>
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
    height: 12,
    width: 12,
  },
  imgpar13: {
    height: 35,
    width: 45,
  },
});
