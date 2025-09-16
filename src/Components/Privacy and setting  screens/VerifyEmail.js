import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";

export default function VerifyEmail(props) {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 30, paddingTop: "23%" }}>
        Enter email address
      </Text>
      <Text style={styles.veremtxt}>
        You’ll recieve a code to verify your email address.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Enter Email" />
      </View>

      <View style={{ alignItems: "center", paddingTop: "20%", gap: 15 }}>
        <TouchableOpacity style={styles.btnmn}>
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>
            Send Code
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 17,
            color: "#00A4FF",
            fontWeight: "600",
            textDecorationLine: "underline",
          }}
        >
          Change Email address
        </Text>
      </View>

      <View style={styles.dntfrmn_txts}>
        <Text style={styles.didntantxt}>Didn’t have any account? </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("LogInPage")}
        >
          <Text style={styles.siguytxt}>Sign In here</Text>
        </TouchableOpacity>
      </View>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "10%",
    backgroundColor: "white",
  },
  veremtxt: {
    color: "#9F9B9B",
    fontSize: 16,
    paddingTop: "4%",
    fontWeight: "600",
  },
  inputContainer: {
    borderBottomWidth: 1, // Border bottom
    borderBottomColor: "black", // Color of the border bottom
    width: "100%",
    paddingTop: "26%",
  },
  input: {
    fontSize: 16,
    paddingVertical: 5, // Vertical padding inside the text input
  },
  btnmn: {
    width: 280,
    height: 54,
    backgroundColor: "#00A4FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  dntfrmn_txts: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    position: "absolute",
    bottom: "3%",
    left: "24%",
  },

  didntantxt: {
    color: "black",
    fontWeight: "100",
    textAlign: "center",
  },
  siguytxt: {
    color: "#00A4FF",
    fontWeight: "300",
  },
});
