import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.contain2}>
        <View style={styles.header}></View>

        <View style={styles.header2}>
          <View style={styles.mainView1}>
            <View style={styles.mainVtxt1}>
              <Text style={styles.maintxt1}>
                Buy One Big Bertha Burger Plate and Receive a FREE Bowl of
                Berthas Famous Chocolate Ice Cream{" "}
              </Text>
            </View>
    
          </View>

          <View style={styles.mainView1}>
            <View style={styles.mainVtxt1}>
              <Text style={styles.maintxt1}>
                Buy One Big Bertha Burger Plate and Receive a FREE Bowl of
                Berthas Famous Chocolate Ice Cream{" "}
              </Text>
            </View>
          </View>

          <View style={styles.mainView1}>
            <View style={styles.mainVtxt1}>
              <Text style={styles.maintxt1}>
                Buy One Big Bertha Burger Plate and Receive a FREE Bowl of
                Berthas Famous Chocolate Ice Cream{" "}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: -10,
    justifyContent: "center",
  },
  contain2: {},
  catg: {
    width: "8%",
    height: 27,
    marginLeft: 10,
  },
  catg2: {
    width: "65%",
    height: 25,
    marginLeft: 20,
  },
  user: {
    width: "8%",
    height: 27,
  },
  logo2: {
    width: "53%",
    height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 39,
    paddingVertical: 0,
    paddingTop: 0,
    marginRight: 12,
  },
  mainVimg1: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mainView1: {
    width: "100%",
    // paddingHorizontal:"5%",
    marginTop: 30,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#cccccc",
  },
  mainVtxt1: {
    borderWidth: 1,
    // height:"29%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: "#cccccc",
    width: "100%",
  },
  maintxt1: {
    fontSize: 14,
    fontWeight: "500",
    padding: 10,
  },
  thik1: {
    marginBottom: 100,
  },
  header2: {
    alignItems: "center",
    width: "95%",
    paddingLeft: 28,
  },
  jadu: {
    width: "10%",
    backgroundColor: "red",
  },
  foot: {
    width: 35,
    height: 40,
  },
  foot2: {
    width: 25,
    height: 40,
  },
});

export default DashboardScreen;
