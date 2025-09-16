import { StyleSheet, Text } from "react-native";
import React from "react";
import { PropsTypes } from "./types";

export default function Typography({
  children,
  style,
  size = 20,
  color,
  fontWeight,
  ...other
}: PropsTypes) {
  const styles = StyleSheet.create({
    text: {
      fontSize: size,
      flexDirection: "row",
      alignItems: "center",
      color: color,
      ...style,
    },
  });
  return (
    <Text style={styles.text} {...other}>
      {children}
    </Text>
  );
}
