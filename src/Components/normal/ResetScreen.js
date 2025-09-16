import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Linking,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import React from "react";

const ResetScreen = () => {
  function openWebsite(websiteLink) {
    Linking.openURL(websiteLink);
  }

  // const [text, onChangeText] = React.useState('');
  // const [text2 , onChangeText2]=React.useState('');
  const [checkbox, setcheckbox] = useState(false);

  const image = {
    uri: "https://img.freepik.com/free-photo/top-view-monochromatic-pattern-with-copy-space_23-2148770338.jpg?size=626&ext=jpg&ga=GA1.1.1427876047.1695385592&semt=ais",
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imagebx}>
          <View style={styles.contain}>
            <ImageBackground
              source={image}
              resizeMode="cover"
              style={styles.imagex}
            ></ImageBackground>
          </View>
        </View>
        <ImageBackground resizeMode="cover" style={styles.imagex2}>
          <Text style={styles.ResetTxt}>Reset Password</Text>

          <View style={styles.data}>
            <Text style={styles.inptxt}>Email :</Text>

            <View style={styles.inputbx}>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                // onChangeText={onChangeText}
                // value={text}
              />
            </View>
          </View>

          <View style={styles.resetm}></View>

          <View style={styles.buttbx}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.logtxt}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttbx2}></View>

          <View style={styles.randommn}>
            <Text style={styles.randomtxt}>
              Lorem Ipsum is simply dummy text of the and{" "}
              <Text style={styles.span}>typesetting</Text> industry.{" "}
            </Text>
          </View>

          <View style={styles.boximg}>
            <Image
              source={{
                uri: "data:image/png;base64,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",
              }}
              style={{ width: 18, height: 18 }}
            />

            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPhdaCbbxjWHmqDLTU_6XwfWocxHwRd1bA3Ojt68KQfAsOBYlFddoc6vPmig_fCzcQOtA&usqp=CAU",
              }}
              style={{ width: 18, height: 18 }}
            />

            <Image
              source={{
                uri: "data:image/png;base64,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",
              }}
              style={{ width: 18, height: 18 }}
            />

            <Image
              source={{
                uri: "data:image/png;base64,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",
              }}
              style={{ width: 18, height: 18 }}
            />
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 5,
  },
  linktxt: {
    marginLeft: -100,
  },
  imagebx: {
    alignItems: "center",
  },

  img1: {
    width: 160,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
  },
  input: {
    height: 55,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 7,
    borderColor: "#f2f2f2",
  },
  data: {
    width: "85%",
    marginTop: 50,
    marginLeft: 28,
  },
  data2: {
    width: "85%",
    marginTop: 15,
    marginLeft: 28,
  },
  inputbx: {
    alignItems: "center",
  },
  inptxt: {
    fontSize: 20,
    fontWeight: "500",
  },
  lintxt: {
    color: "orange",
    textDecorationLine: "underline",
    marginLeft: 28,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4d4d4d",
    padding: 10,
    width: "85%",
    height: 55,
    borderRadius: 7,
    justifyContent: "center",
  },
  buttbx: {
    alignItems: "center",
    flex: "1",
    marginTop: 50,
  },
  buttbx2: {
    alignItems: "center",
    flex: "1",
    marginTop: 20,
  },

  logtxt: {
    fontSize: 17,
    fontWeight: "500",
    color: "white",
  },
  lsttxt: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    flex: "1",
    justifyContent: "center",
    marginTop: 100,
  },
  txt02: {
    color: "#67D945",
    fontSize: 15,
  },
  txt01: {
    fontSize: 15,
    color: "#cccccc",
  },
  icon: {
    width: 25,
    height: 25,
  },
  checkbx: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginLeft: 30,
    marginTop: 2,
  },
  accpt: {
    color: "gray",
  },
  imagex: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    height: 190,
  },
  imagex2: {
    width: "100%",
    // alignItems:"center",
    paddingVertical: 20,
  },
  contain: {
    width: "100%",
    borderBottomWidth: 7,
    borderColor: "#b3e5b3",
  },
  txtaln: {
    borderTopLeftRadius: 40,
  },
  reset1: {
    width: "26%",
    backgroundColor: "#47d147",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  resetxt1: {
    fontSize: 17,
    fontWeight: "500",
    color: "black",
  },
  reset2: {
    width: "45%",
    backgroundColor: "#333333",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  resetxt1: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },

  resetm: {
    flexDirection: "row",
    marginTop: -7,
    marginLeft: 27,
    marginBottom: 10,
  },
  randommn: {
    padding: 20,
    marginLeft: 20,
    marginTop: 60,
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
    flex: "1",
    width: "100%",
  },
  randomtxt: {
    color: "#b3b3b3",
    alignContent: "center",
    width: "100%",
  },
  span: {
    color: "#595959",
  },
  copyr: {
    width: 100,
    height: 100,
  },
  boximg: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",
    gap: 8,
  },
  ResetTxt: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "700",
  },
});

export default ResetScreen;
