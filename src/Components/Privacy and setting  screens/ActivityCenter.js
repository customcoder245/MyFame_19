import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Group194,
  LeftArrowIcon,
  Search2,
  bin1,
  visible,
} from "../../assets2/Icons/allIcons";
import { Message3 } from "../../assets2/Icons/allIcons";
export default function ActivityCenter(props) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>ACCOUNT</Text>

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
            <Image source={Group194} style={styles.imgpar11} />
            <Text style={styles.txt11}>Watch history</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("CommentHistory");
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
              <Image source={Message3} style={styles.imgpar11} />
              <Text style={styles.txt11}>Comment history</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
            <Image source={Search2} style={styles.imgpar11} />
            <Text style={styles.txt11}>Search history</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("RecentlyDeleted");
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
              <Image source={bin1} style={styles.imgpar11} />
              <Text style={styles.txt11}>Recently deleted</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
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
            <Image source={visible} style={styles.imgpar11} />
            <Text style={styles.txt11}>Manage post visibility</Text>
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
