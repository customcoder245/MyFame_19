import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { bell1, clock1, clockhl } from "../../assets2/Icons/allIcons";

export default function DailyScreenTime() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.maindv}>
          <Image source={clock1} style={styles.imgpar12} />
          <Text style={{ fontSize: 28, fontWeight: "600" }}>
            Restricted mode:off
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "400",
              color: "#8A8A8A",
              textAlign: "center",
              color: "#717171",
            }}
          >
            We’ll let you know if you reach your daily time to help you balance
            your daily.
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "90%",
            gap: 10,
            marginTop: "15%",
          }}
        >
          <Image source={clockhl} style={styles.imgpar13} />
          <View>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>
              Set your daily time{" "}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#343434" }}>
              Choose how long to spend on this app.
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "90%",
            gap: 10,
            marginTop: "10%",
          }}
        >
          <Image source={bell1} style={styles.imgpar13} />
          <View>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>
              Get notified
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#343434" }}>
              Close app to stay within your daily time or enter a passcode to
              return to it.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "white", fontWeight: "500" }}>
            Set daily screen time
          </Text>
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
    height: 180,
    width: 180,
  },
  imgpar13: {
    height: 25,
    width: 25,
  },
  maindv: {
    alignItems: "center",
    gap: 12,
  },
  button: {
    width: "75%",
    height: 45,
    backgroundColor: "#00A4FF",
    marginTop: "10%",
    borderRadius: 10,
    marginLeft: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
});
