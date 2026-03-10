import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Account2, LockIcon5, filte1 } from "../../assets2/Icons/allIcons";

export default function RestrictedMode() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.maindv}>
          <Image source={Account2} style={styles.imgpar12} />
          <Text style={{ fontSize: 28, fontWeight: "600" }}>
            Restricted mode:off
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "90%",
            gap:10,
            marginTop: "15%",
          }}
        >
          <Image source={filte1} style={styles.imgpar13} />
          <Text style={{ fontSize: 16, fontWeight: "400", color: "#8A8A8A" }}>
            Limit videso that may be inappropriate for some people. if you
            inappropriate video in restricted mode , report it to help us
            improve
          </Text>
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
          <Image source={LockIcon5} style={styles.imgpar13} />
          <Text style={{ fontSize: 16, fontWeight: "400", color: "#8A8A8A" }}>
            Turn the setting on and off at any time.
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
    height: 60,
    width: 60,
  },
  imgpar13: {
    height: 25,
    width: 25,
  },
  maindv: {
    alignItems: "center",
    gap: 18,
    marginTop: "30%",
  },
});
