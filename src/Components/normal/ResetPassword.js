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
import { Feather } from "@expo/vector-icons";
import * as yup from "yup";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../Fetch_API/BaseURL";

const reviewSchema = yup.object({
    password: yup
        .string()
        .required("Password is required")
        .min(8, 'Password should be 8 characters long')
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[\W_]/, "Password must contain at least one special character"),
        
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
});

export default function ResetPassword(props) {

    const { params } = useRoute()
    const navigation = useNavigation();

    const handleSubmit = async (values, actions) => {

        // console.log(values.password !== values.confirmPassword)
        if (values.password !== values.confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Values Mis-match',
                text2: 'New Password and Confirm password must be same'
            })

        }
        else {


            try {
                const response = await fetch(
                    `${BASE_URL}/resetpassword/v1/resetPassword/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            CurrentUserId: params.userID.toString(),
                            NewPassword: values.password
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
                        navigation.navigate("BottomNavigator")
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
                        <Text style={styles.maintxt}>Reset Password</Text>
                        <Text style={styles.discr}>
                            Enter your new password
                        </Text>
                    </View>

                    <Formik
                        validationSchema={reviewSchema}
                        initialValues={{ password: '', confirmPassword: '' }}
                        onSubmit={handleSubmit}
                    >

                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View style={{ alignItems: "center", marginTop: "10%" }}>

                                <View style={styles.inputContainer}>
                                    <Feather name="lock" size={22} color="grey" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="New Password"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                    />

                                </View>
                                {touched.password && errors.password && (
                                    <Text style={{ color: "red" }}>{errors.password}</Text>
                                )}

                                <View style={styles.inputContainer}>
                                    <Feather name="lock" size={22} color="grey" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}

                                    />

                                </View>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
                                )}

                                <TouchableOpacity
                                    style={styles.btnsign1mn_2}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.btnsign1}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}


                    </Formik>
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
        width: 310,
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