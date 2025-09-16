import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LeftArrowIcon } from "../../assets2/Icons/allIcons";

export default function ContentPreference(props) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>DISCOVERREBILITY</Text>

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
            }}
          >
            <Text style={styles.txt11}>Filter video keywords</Text>
          </View>
          <View
            style={{
              maxWidth: "90%",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "200", maxWidth: "100%" }}>
              0
            </Text>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("RestrictedMode");
          }}
        >
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
              }}
            >
              <Text style={styles.txt11}>Restricted mode</Text>
            </View>
            <View
              style={{
                maxWidth: "90%",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "200", maxWidth: "100%" }}
              >
                off
              </Text>
              <Image source={LeftArrowIcon} style={styles.imgpar12} />
            </View>
          </View>
        </TouchableOpacity>

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
            }}
          >
            <Text style={styles.txt11}>Refresh your for you feed</Text>
          </View>
          <View
            style={{ maxWidth: "90%", display: "flex", flexDirection: "row" }}
          >
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
            }}
          >
            <Text style={styles.txt11}>Muted accounts</Text>
          </View>
          <View
            style={{ maxWidth: "90%", display: "flex", flexDirection: "row" }}
          >
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
