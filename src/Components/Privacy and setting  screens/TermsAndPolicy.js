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
import {
  Group249,
  LeftArrowIcon,
  book1,
  book2,
  insurance,
  users1,
} from "../../assets2/Icons/allIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TermsAndPolicy(props) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.texthead}>INTERACTIONS</Text>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("CommunityGuidelines");
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
                   <MaterialCommunityIcons name="account-multiple-outline" size={26} color="#86878B" />

              <Text style={styles.txt11}>Community guidelines</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("TermsOfService");
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
                      <MaterialCommunityIcons name="book-outline" size={26} color="#86878B" />
              <Text style={styles.txt11}>Terms of service</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("PrivacyPolicyScreen");
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
                <MaterialCommunityIcons name="shield-lock-outline" size={26} color="#86878B" />
              <Text style={styles.txt11}>Privacy Policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("IntellectualPolicy");
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
               <MaterialCommunityIcons name="certificate-outline" size={26} color="#86878B" />
              <Text style={styles.txt11}>Intellectual property policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Opensourcesoftware");
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
               <MaterialCommunityIcons name="code-tags" size={26} color="#86878B" />
              <Text style={styles.txt11}>Open source software notices</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#898989" />
          </View>
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
