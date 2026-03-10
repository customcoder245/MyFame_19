import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useState } from "react";
import { LeftArrowIcon, toggle } from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";

import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
export default function SecurityPermission(props) {
  const toggleSource = toggle;
  const onSource = on;

  const { imageSource1, switchImage1 } = ChangeToggleImage(
    toggleSource,
    onSource
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>SECURITY & PERMISSION</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Security alerts</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("ManageDevice");
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <View
              style={{
                gap: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.txt11}>Manage device</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("TwoStepValidation");
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <View
              style={{
                gap: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.txt11}>2-step verification</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage1}>
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
              <Text style={styles.txt11}>Save login info</Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>PERMISISON</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Apps & services permissions</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Browser settings</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
