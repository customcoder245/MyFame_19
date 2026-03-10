import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { image1, mail } from "../../assets2/Icons/allIcons";
import { logo3 } from "../../assets2/Icons/allIcons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from 'yup'
import { BASE_URL } from "../../Fetch_API/BaseURL";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email address'
    )
    .required('Email is required'),
});

export default function ForgotPassword() {
  const navigation = useNavigation();

  const handleSubmit = async (values, actions) => {

    try {
      const response = await fetch(
        `${BASE_URL}/forget-password/v1/userForgetPass/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        actions.resetForm();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message
        })

        setTimeout(() => {
          navigation.navigate('VerifyOtp', {
            userID: data.data.id
          })
        }, 1500)
      } else {

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message
        })
        console.error("Error:", data);
      }
    } catch (error) {

      console.error("Error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again later.'
      })
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground source={image1} style={styles.background}>
        {/* <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        > */}
        <Image source={logo3} style={styles.logo} resizeMode="contain" />

        <View style={styles.inputContainer_1}>
          <View style={{ alignItems: "center", marginTop: "5%" }}>
            <Text style={styles.maintxt}>Forgot Password</Text>
            <Text style={styles.discr}>
              Enter your email and we’ll send you a link to reset your
              password
            </Text>
          </View>

          <Formik
            validationSchema={validationSchema}
            initialValues={{ email: '' }}
            onSubmit={handleSubmit}
          >

            {({
              handleChange,
              values,
              touched,
              errors,
              handleBlur,
              handleSubmit
            }) => (
              <View style={{ alignItems: "center", marginTop: "10%" }}>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={22} color="black" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />

                </View>
                {
                  touched.email && errors.email && (
                    <Text style={{ color: "red" }}>{errors.email}</Text>
                  )
                }

                <TouchableOpacity
                  style={styles.btnsign1mn_2}
                  onPress={handleSubmit}
                >
                  <Text style={styles.btnsign1}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

          </Formik>


        </View>

        <View style={styles.dntfrmn_txts}>
          <Text style={styles.didntantxt}>Didn’t have any account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LogIn")}
          >
            <Text style={styles.siguytxt}>Sign In here</Text>
          </TouchableOpacity>
        </View>
        {/* </LinearGradient> */}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: 309,
    columnGap: 10
  },
  input: {
    flex: 1,
    height: 56,
  },
  logo: {
    height: 230,
    width: 230,
    marginTop: -85,
  },
  inputContainer_1: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: -15,
  },
  frpasstxt: {
    color: "white",
    marginTop: 15,
  },
  btnsign1mn_2: {
    backgroundColor: "#00E2FF",
    alignItems: "center",
    paddingVertical: 20,
    width: "50%",
    borderRadius: 10,
    marginTop: "20%",
  },
  didntantxt: {
    color: "white",
    fontWeight: "100",
  },
  siguytxt: {
    color: "#00E6FF",
    fontWeight: "300",
  },
  dntfrmn_txts: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  maintxt: {
    fontSize: 26,
    fontWeight: "300",
    color: "white",
  },
  discr: {
    color: "white",
    fontWeight: "100",
    textAlign: "center",
    width: "70%",
    marginTop: "10%",
  },
});
