import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import AccountImformation from "./AccountImformation";
import { LeftArrowIcon } from "../../assets2/Icons/allIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Account(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("AccountImformation")}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "13%",
          }}
        >
          <Text style={styles.txt11}>Account Information</Text>
          <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
       onPress={() => props.navigation.navigate("ChangePasswordFromSettings")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "13%",
        }}
      >
        <Text style={styles.txt11}>Password</Text>
        <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
      </TouchableOpacity>

      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "13%",
        }}
      >
        <Text style={styles.txt11}>Switch to Bussiness Account</Text>
        <Image source={LeftArrowIcon} style={styles.imgpar12} />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "13%",
        }}
      >
        <View style={{ display: "flex", flexDirection: "collumn" }}>
          <Text style={styles.txt11}>Download your data</Text>
          <Text style={{ fontSize: 13, fontWeight: "200", paddingTop: 10 }}>
            Get a copy of your tiktok daTA
          </Text>
        </View>
        <Image source={LeftArrowIcon} style={styles.imgpar12} />
      </View> */}

      <TouchableOpacity
        onPress={()=>props.navigation.navigate("DeleteOrDeactivateAcc")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "13%",
        }}
      >
        <Text style={styles.txt11}>Deactivate or delete account</Text>
        <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
      </TouchableOpacity>
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
    height: 17,
    width: 17,
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
});
