import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

const Header = () => {
  const [cartItems, setCartItems] = useState(0);
  const cartData = useSelector((state) => state.reducer);
  // console.warn(cartData)

  useEffect(() => {
    setCartItems(cartData.length);
  }, [cartData]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{cartItems}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: 30,
  },
});

export default Header;
