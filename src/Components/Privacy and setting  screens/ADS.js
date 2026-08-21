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
  bin2,
  deactivate,
  toggle,
} from "../../assets2/Icons/allIcons";
import { users1 } from "../../assets2/Icons/allIcons";
import { project1 } from "../../assets2/Icons/allIcons";
import { postrev } from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";
import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
export default function ADS() {
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
            <Image source={project1} style={styles.imgpar11} />
            <View style={{ maxWidth: "85%" }}>
              <Text style={styles.txt11}>Manage inferences</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Change factors used topersonalize the ADS you see.
              </Text>
            </View>
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
            <Image source={deactivate} style={styles.imgpar11} />
            <View style={{ maxWidth: "85%" }}>
              <Text style={styles.txt11}>Mute advertisers</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Mute ADS from specefic advertisewho showed you ADS recwentlyon
                this app.
              </Text>
            </View>
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
            <Image source={postrev} style={styles.imgpar11} />
            <View style={{ maxWidth: "85%" }}>
              <Text style={styles.txt11}>Share feedback</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Share feedback on ads you engaged with or purchase from ads.
              </Text>
            </View>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

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
              <Text style={styles.txt11}>Targated ADS</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Get notified when your friends comment on other friends postyou
                liked or commented on.
              </Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

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
            <Image source={users1} style={styles.imgpar11} />
            <View style={{ maxWidth: "85%" }}>
              <Text style={styles.txt11}>Disconnect advertisers</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Stop tailoring ads with your data.
              </Text>
            </View>
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
              gap:20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image source={bin2} style={styles.imgpar11} />
            <View style={{ maxWidth: "85%" }}>
              <Text style={styles.txt11}>Clear activity</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Clear the data that advertisers have shared you.
              </Text>
            </View>
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
