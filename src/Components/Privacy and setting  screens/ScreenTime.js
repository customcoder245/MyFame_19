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
import {
  LeftArrowIcon,
  mess,
  mess2,
  mess3,
  toggle,
} from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";
import ChangeToggleImage from "../../Hooks/ChangeToggleImage";

export default function ScreenTime(props) {
  const toggleSource = toggle;
  const onSource = on;

  const {
    imageSource1,
    imageSource2,
    imageSource3,
    imageSource4,
    switchImage1,
    switchImage2,
    switchImage3,
    switchImage4,
  } = ChangeToggleImage(toggleSource, onSource);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>Discoverebility</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "13%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("DailyScreenTime");
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Daliy screen time</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Get notified if you reach your time limit.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={switchImage1}>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={switchImage2}>
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
              <Text style={styles.txt11}>Screen time breaks</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Get reminded to take breaks from scrolling
              </Text>
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
              <Text style={styles.txt11}>Sleep reminders</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Get reminded about your sleep time.
              </Text>
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
              <Text style={styles.txt11}>Weekly screen time updates</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                stay updated on your time from your inboox.
              </Text>
            </View>
            <Image
              source={imageSource4 === toggleSource ? toggleSource : onSource}
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
            <View style={{ display: "flex", flexDirection: "collumn" }}>
              <Text style={styles.txt11}>Summary</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Your wekly metrics inclue your time on the app.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
            <View style={{ display: "flex", flexDirection: "collumn" }}>
              <Text style={styles.txt11}>This week</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Apr 28, 2024-May 4, 2024
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>INTERACTIONS</Text>

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
            <Image source={mess3} style={styles.imgpar11} />
            <Text style={styles.txt11}>Comments</Text>
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
            <Image source={mess2} style={styles.imgpar11} />
            <Text style={styles.txt11}>Mention</Text>
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
            <Image source={mess} style={styles.imgpar11} />
            <Text style={styles.txt11}>Direct Messages</Text>
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
