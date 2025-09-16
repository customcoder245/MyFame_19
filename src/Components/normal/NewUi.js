import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "./Header";
import ForgotPassword from "./ForgotPassword";

export default function NewUi() {
  const products = [
    {
      name: "samsung",
      color: "white",
      price: 30000,
    },
    {
      name: "apple",
      color: "red",
      price: 130000,
    },
    {
      name: "nokia",
      color: "green",
      price: 50000,
    },
  ];

  return (
    <View>
      <Header />
      {products.map((item) => (
        <ForgotPassword item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
