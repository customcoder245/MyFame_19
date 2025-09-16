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
export default function Languege() {
  const toggleSource = toggle;
  const onSource = on;

  const { imageSource1, switchImage1 } = ChangeToggleImage(
    toggleSource,
    onSource
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>Manage the ADS you see</Text>

        <TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View style={{ display: "flex", flexDirection: "collumn" }}>
              <Text style={styles.txt11}>App language</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Select your default app language
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text>Eng</Text>
              <Image source={LeftArrowIcon} style={styles.imgpar12} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>Manage your off-data</Text>

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
              <Text style={styles.txt11}>Always translate posts</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Posrtswill be translated into your translation language , when
                possible. This includes post description , comments , photo
                titles , video captions , adn text in videos.
              </Text>
            </View>
            <Image
              source={imageSource1 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
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
              <Text style={styles.txt11}>Translate into</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                For features that support translation , we will translate text
                into this language when transllatiion are turned on.
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text>Eng</Text>
              <Image source={LeftArrowIcon} style={styles.imgpar12} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
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
              <Text style={styles.txt11}>Do not translate</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Select languages you dont want to tranlate automatically.
              </Text>
            </View>

            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
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
