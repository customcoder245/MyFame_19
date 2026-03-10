import { View, Text } from "react-native";
import React from "react";
import Parent from "./Parent";
import { TouchableOpacity } from "react-native-gesture-handler";

const Splash = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: "red" }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Parent");
        }}
      >
        <Text>hello world</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Splash;
