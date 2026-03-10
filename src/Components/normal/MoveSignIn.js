import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import React from "react";
import { logo3 } from "../../assets2/Icons/allIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function MoveSignIn() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo3} style={styles.logo} resizeMode="contain" />
      <View style={styles.block}>
        <Text style={styles.title}>Sign In Now </Text>
        <Text style={styles.description}>
          Sign in now so that you can enjoy our app.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BottomNavigator", { screen: "Me" })}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  block: {
    width: "80%",
    minHeight: 200, // Increased height
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    alignItems: "center",
    marginTop: "15%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#00A3FF",
    borderRadius: 5,
    marginTop: "5%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  logo: {
    position: "absolute",
    top: "15%",
  },
});
