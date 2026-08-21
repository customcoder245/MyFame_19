import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  LeftArrowIcon,
  LockIcon5,
  email1,
  iphone,
  profile,
} from "../../assets2/Icons/allIcons";
export default function TwoStepValidation() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mandiv}>
          <Text style={{ fontSize: 30, fontWeight: "600" }}>
            2-step validation is off
          </Text>
          <Text
            style={{
              fontSize: 19,
              color: "#A6A6A6",
              textAlign: "center",
              maxWidth: "90%",
              fontWeight: "300",
              lineHeight: 26,
              letterSpacing: 0.9,
            }}
          >
            Turning this on will require an additional verification code when
            you login through uan untrusted device.
          </Text>
          <Text
            style={{
              color: "#00A4FF",
              fontSize: 17,
              textDecorationLine: "underline",
            }}
          >
            Learn more
          </Text>
        </View>

        <Text style={styles.texthead}>Select at least 2 methods</Text>

        <View style={styles.boxft}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "5%",
            }}
          >
            <Image source={iphone} style={styles.imgpar11} />
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Phone</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                You will recieve a verification code via SMS.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "5%",
            }}
          >
            <Image source={email1} style={styles.imgpar11} />
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Email</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                You will recieve a verification code via SMS.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "5%",
            }}
          >
            <Image source={profile} style={styles.imgpar11} />
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Authenticator</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                You will recieve a verification code via SMS.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "5%",
            }}
          >
            <Image source={LockIcon5} style={styles.imgpar11} />
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Password</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                You will recieve a verification code via SMS.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "white", fontWeight: "500" }}>Turn On</Text>
        </TouchableOpacity>
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
    textAlign: "center",
  },
  texthead: {
    fontSize: 18,
    fontWeight: "300",
    color: "#86878B",
    marginTop: "8%",
  },
  imgpar11: {
    height: 20,
    width: 18,
  },
  txt11: {
    fontSize: 21,
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
  mandiv: {
    alignItems: "center",
    marginTop: "10%",
    gap: 15,
  },
  boxft: {
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    borderRadius: 17,
    paddingBottom: "15%",
    marginTop: "5%",
  },
  button: {
    width: "75%",
    height: 60,
    backgroundColor: "#00A4FF",
    marginTop: "10%",
    borderRadius: 10,
    marginLeft: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
});
