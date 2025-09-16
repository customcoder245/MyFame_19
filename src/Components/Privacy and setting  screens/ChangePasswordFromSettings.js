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
    Dimensions,
    ActivityIndicator, // Import ActivityIndicator
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
import { useSelector } from "react-redux";

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

export default function ChangePasswordFromSettings(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading

    const { params } = useRoute();
    const navigation = useNavigation();
    const profileData = useSelector((state) => state.profile.profileData);

    const handleSubmit = async (values, actions) => {
        if (values.password !== values.confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Values Mis-match',
                text2: 'New Password and Confirm password must be the same'
            });
        } else {
            setLoading(true); // Start loading

            try {
                const response = await fetch(
                    `${BASE_URL}/changepassword/v1/changepassword`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userid: profileData.id.toString(),
                            password: values.password,
                            confirmPassword: values.confirmPassword
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
                    });

                    setTimeout(() => {
                        setLoading(false); // Stop loading
                        navigation.goBack();
                    }, 1500);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: data.message
                    });
                    console.error("Error:", data);
                    setLoading(false); // Stop loading
                }
            } catch (error) {
                console.error("Error:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'An error occurred. Please try again later.'
                });
                setLoading(false); // Stop loading
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <ImageBackground  resizeMode="cover" style={styles.background}>
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
                                    <Feather name="lock" size={20} color="grey" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="New Password"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={!showConfirmPassword} // Hide/Show confirm password
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="grey" />
                                    </TouchableOpacity>
                                </View>
                                {isSubmitted && touched.password && errors.password && (
                                    <Text style={{ color: "red" , fontsize:14 }}>{errors.password}</Text>
                                )}

                                <View style={styles.inputContainer}>
                                    <Feather name="lock" size={20} color="grey" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        secureTextEntry={!showPassword} // Hide/Show password
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="grey" />
                                    </TouchableOpacity>
                                </View>
                                {isSubmitted && touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={{ color: "red" , fontSize:14 }}>{errors.confirmPassword}</Text>
                                )}

                                <TouchableOpacity
                                    style={styles.btnsign1mn_2}
                                    onPress={() => {
                                        setIsSubmitted(true); // Set submission state to true
                                        handleSubmit(); // Trigger form submission
                                    }}
                                >
                                    <Text style={styles.btnsign1}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>

                {loading && ( // Show loader if loading state is true
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#00E2FF" />
                    </View>
                )}
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: semi-transparent background
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
    maintxt: {
        fontSize: 26,
        fontWeight: "300",
        color: "black",
    },
    discr: {
        color: "black",
        fontWeight: "100",
        textAlign: "center",
        width: "70%",
        marginTop: "10%",
    },
    btnsign1mn_2: {
        backgroundColor: "#00E2FF",
        alignItems: "center",
        paddingVertical: 17,
        width: "90%",
        borderRadius: 10,
        marginTop: "20%",
    },
});
