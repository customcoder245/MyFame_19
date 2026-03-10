import React from "react";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";

const PlayIcon = () => (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    colors={["#54C2FF", "#D6F0FF"]}
    style={{
      justifyContent: "center",
      alignItems: "center",
      height: 45,
      width: 45,
      borderRadius: 45,
    }}
  >
    <Entypo
      name="controller-play"
      size={26}
      style={{ marginLeft: 3 }}
      color="white"
    />
  </LinearGradient>
);

export default PlayIcon;
