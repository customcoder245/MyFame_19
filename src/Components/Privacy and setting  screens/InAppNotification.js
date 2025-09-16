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
import { toggle } from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";
import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
export default function Notification(props) {
  const toggleSource = toggle;
  const onSource = on;

  const {
    imageSource1,
    imageSource2,
    imageSource3,
    imageSource4,
    imageSource5,
    imageSource6,
    imageSource7,
    imageSource8,
    imageSource9,
    switchImage1,
    switchImage2,
    switchImage3,
    switchImage4,
    switchImage5,
    switchImage6,
    switchImage7,
    switchImage8,
    switchImage9,
  } = ChangeToggleImage(toggleSource, onSource);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={switchImage1}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Likes</Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage2}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Comments</Text>
            </View>
            <Image
              source={imageSource2 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage3}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>New followers</Text>
            </View>
            <Image
              source={imageSource3 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage4}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Mention and tags</Text>
            </View>
            <Image
              source={imageSource4 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage5}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Direct messages</Text>
            </View>
            <Image
              source={imageSource5 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage6}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "7%",
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
              <Text style={styles.txt11}>Activity status</Text>
            </View>
            <Image
              source={imageSource6 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage7}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>New posts from friends</Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource7 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage8}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>LIVE</Text>
            </View>
            <Image
              source={imageSource8 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage9}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Customized updates and more</Text>
            </View>
            <Image
              source={imageSource9 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
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
