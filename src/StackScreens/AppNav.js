import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";

import { AuthContext } from "../Context/AuthContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

export default function AppNav() {
  const { userToken } = useContext(AuthContext);
  return (
    <View style={{ flex: 1 }}>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </View>
  );
}

const styles = StyleSheet.create({});
