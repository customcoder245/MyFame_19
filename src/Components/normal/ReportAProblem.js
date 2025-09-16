import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import { useState } from "react";
import {
  LeftArrowIcon,
  mess,
  mess2,
  mess3,
  no1,
  toggle,
} from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";
export default function PrivacyScreen() {
  const [imageSource, setImageSource] = useState(toggle);
  const [imageSource2, setImageSource2] = useState(toggle);
  const [imageSource3, setImageSource3] = useState(toggle);
  const switchImage = () => {
    const newSource = imageSource === toggle ? on : toggle;
    setImageSource(newSource);
  };

  const switchImage2 = () => {
    const newSource = imageSource2 === toggle ? on : toggle;
    setImageSource2(newSource);
  };

  const switchImage3 = () => {
    const newSource = imageSource3 === toggle ? on : toggle;
    setImageSource3(newSource);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: 31,
            fontWeight: "bold",
            paddingVertical: "7%",
            paddingHorizontal: "6%",
          }}
        >
          Facing a problem?
        </Text>

        <View style={styles.searchmn}>
          <TextInput
            style={{
              height: 45,
              marginBottom: 10,
              paddingHorizontal: 10,
              width: "90%",
              borderRadius: 18,
              backgroundColor: "#F0F0F0",
              paddingLeft: "11%",
              marginTop: "-5%",
            }}
            placeholder="Search chats......"
          />
          <Image
            source={no1}
            style={{
              width: 18,
              height: 18,
              position: "absolute",
              top: "-5%",
              left: "8%",
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: "5%",
          }}
        >
          <View style={styles.boxcnt}>
            <Image source={no1} style={styles.box_img} />
            <Text style={styles.box_txt}>Account recovery</Text>
          </View>

          <View style={styles.boxcnt}>
            <Image source={no1} style={styles.box_img} />
            <Text style={styles.box_txt}>Account recovery</Text>
          </View>
        </View>

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
            <Text style={styles.txt11}>Account and problem</Text>
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
            <Text style={styles.txt11}>Interaction</Text>
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
            <Text style={styles.txt11}>Feed and playback</Text>
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
            <Image source={mess3} style={styles.imgpar11} />
            <Text style={styles.txt11}>LIVE</Text>
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
            <Text style={styles.txt11}>Account growth</Text>
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
            <Text style={styles.txt11}>Creation</Text>
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
            <Text style={styles.txt11}>Creator tools</Text>
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
  searchmn: {
    borderColor: "black",
    alignItems: "center",
    marginTop: "10%",
  },
  boxcnt: {
    backgroundColor: "#F5F5F5",
    width: "40%",
    height: 120,
    paddingLeft: "8%",
    paddingTop: "8%",
    borderRadius: 10,
  },
  box_img: {
    width: 20,
    height: 20,
  },
  box_txt: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
