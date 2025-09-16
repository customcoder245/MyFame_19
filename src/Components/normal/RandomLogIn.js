import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../Context/AuthContext";

export default function RandomLogIn() {
  const { login } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          login();
        }}
      >
        <Text style={styles.text}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 35,
    backgroundColor: "red",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
