import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import {
  SearchIcon,
  addcontact1,
  bckvector,
} from "../../assets2/Icons/allIcons";
import UsersList from "./AllUsers";

export default function Friends(props) {
  const downloadedImage = bckvector;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={downloadedImage}
        style={{ ImageBackground: "cover", height: "100%" }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={addcontact1} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Friends</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={SearchIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.headinghead}>
          <Text style={styles.headingtxt}>
            Connect with friends to view their posts
          </Text>
        </View>

        <View style={styles.bltxtmn}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("UsersList")}
          >
            <Text style={styles.bltxt}>Connect with friends</Text>
          </TouchableOpacity>
          <Text style={styles.bltxt}>Connect with facevbook friends</Text>
          <Text style={styles.bltxt}>Invite friends</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingTop: "3%",
  },
  headerButton: {
    padding: 10,
  },
  icon: {
    width: 23,
    height: 23,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Cover the entire area
  },
  headingtxt: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 15,
  },
  headinghead: {
    alignItems: "center",
    paddingTop: "30%",
  },
  bltxt: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: "5%",
    color: "#73CDFF",
  },
  bltxtmn: {
    alignItems: "center",
    paddingTop: "10%",
  },
});
