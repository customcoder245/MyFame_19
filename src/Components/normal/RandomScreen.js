import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../Context/AuthContext";

export default function RandomScreen() {
  const { logout } = useContext(AuthContext);
  return (
    <View
      style={{
        backgroundColor: "blue",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>RandomScreen</Text>

      <TouchableOpacity
        onPress={() => {
          logout();
        }}
        style={{ width: 100, height: 35, backgroundColor: "white" }}
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
