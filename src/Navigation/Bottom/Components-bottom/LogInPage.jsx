import React, { useState, useContext } from "react";
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
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as yup from "yup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Signup } from "../../../assets2/Images/allImages";
import {
  AppleAuth,
  LockIcon5,
  facebook1,
  search,
  mail,
  logo3,
} from "../../../assets2/Icons/allIcons";
import { AuthContext } from "../../../Context/AuthContext";
import { BASE_URL } from "../../../Fetch_API/BaseURL";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from "react-native-fbsdk-next";
import fetchProfileData from "../../../Fetch_API/fetchProfileData";
import UserData from "../../../Fetch_API/UsersData";
import Icon from "react-native-vector-icons/Feather"; // Importing Feather icons
import { Ionicons } from "@expo/vector-icons";
import DeviceInfo from "react-native-device-info";
const reviewSchema = yup.object({
  Password: yup.string().required("Password is required"),
  Email: yup.string().required("Email is required"),
});

export default function LogInPage(props) {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // Loading state
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId])
  );

const HandleGoogleLogin = async () => {
  setLoading(true);

  try {
    await GoogleSignin.hasPlayServices();

    const res = await GoogleSignin.signIn();

    // Device Information
    const deviceId = await DeviceInfo.getUniqueId();
    const deviceName = DeviceInfo.getModel();
    const appVersion = DeviceInfo.getVersion();
    const deviceOS = `${Platform.OS} ${Platform.Version}`;

    const response = await fetch(
      `${BASE_URL}/signinwithgoogle/v1/signInWithGoogle/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: res.user.email,
          device_id: deviceId,
          device_name: deviceName,
          device_os: deviceOS,
          app_version: appVersion,
        }),
      }
    );

    const data = await response.json();

    console.log("========== GOOGLE LOGIN ==========");
    console.log("Status:", response.status);
    console.log("Response:", data);
    console.log("==================================");

    if (response.ok) {
      const result = await AsyncStorage.getItem("users");
      const allLoggedInUsers =
        result !== null ? JSON.parse(result) : null;

      if (
        allLoggedInUsers !== null &&
        allLoggedInUsers.includes(String(data.user_id))
      ) {
        Alert.alert("User is already logged in");
        return;
      }

      if (allLoggedInUsers === null) {
        await AsyncStorage.setItem(
          "users",
          JSON.stringify([String(data.user_id)])
        );
      } else {
        allLoggedInUsers.push(String(data.user_id));
        await AsyncStorage.setItem(
          "users",
          JSON.stringify(allLoggedInUsers)
        );
      }

      login(res.user.email, data.user_id);

      await UserData(data.user_id);

      await AsyncStorage.setItem(
        "userId",
        String(data.user_id)
      );

      dispatch(fetchProfileData(data.user_id));
      dispatch(setUser(data.user_id));

      console.log("✅ Google Login Successful");
      console.log("Logged In User ID:", data.user_id);

      props.navigation.navigate("BottomNavigator");
    } else {
      console.log("❌ Google Login Failed");
      console.log(data);

      Alert.alert(
        "Error",
        data?.message || "Google login failed."
      );
    }
  } catch (error) {
    console.log("========== GOOGLE LOGIN ERROR ==========");
    console.log(error);
    console.log("========================================");

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("User cancelled Google Sign-In");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Google Sign-In already in progress");
    } else if (
      error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
    ) {
      Alert.alert(
        "Google Play Services are not available on this device."
      );
    } else {
      Alert.alert(
        "Error",
        "Something went wrong during Google Sign-In."
      );
    }
  } finally {
    setLoading(false);
  }
};
  const HandleFacebookLogin = async () => {
    setLoading(true); // Start loading
    try {
      const result = await LoginManager.logInWithPermissions([
        "email",
      ]);
      if (Platform.OS === "ios") {
        const result = await AuthenticationToken.getAuthenticationTokenIOS();
        console.log(result?.authenticationToken);
      } else {
        const result = await AccessToken.getCurrentAccessToken();
        const response = await fetch(
          `${BASE_URL}/signinwithfacebook/v1/signInWithFacebook/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid: result.userID }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          await AsyncStorage.setItem("userId", String(data.user_id));
          console.log("Login successful:", data);
          // Alert.alert("Login successful");
          dispatch(setUser(data.user_id));
          login("email", data.user_id);
          navigation.navigate("ProfileScreen");
        } else {
          console.error("Error:", data);
          Alert.alert(
            "Error",
            "Invalid username or password. Please try again."
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSubmit = async (values, actions) => {
    setLoading(true); // Start loading
    try {

          const deviceId = await DeviceInfo.getUniqueId();
    const deviceName = DeviceInfo.getModel();
    const appVersion = DeviceInfo.getVersion();
    const deviceOS = `${Platform.OS} ${Platform.Version}`;


      const response = await fetch(`${BASE_URL}/login/v1/UserLogin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  username: values.Email,
  password: values.Password,

  device_id: deviceId,
  device_name: deviceName,
  device_os: deviceOS,
  app_version: appVersion,
}),
      });
      const data = await response.json();

      if (response.ok) {
        const result = await AsyncStorage.getItem("users");
        const allLoggedInUsers = result !== null ? JSON.parse(result) : null;

        if(allLoggedInUsers !== null && allLoggedInUsers.includes(String(data.user_id)))
        {
          Alert.alert("User is already logged in");
          return;
        }


        dispatch(fetchProfileData(data.user_id));
        dispatch(setUser(data.user_id));
        if (allLoggedInUsers === null) {
          await AsyncStorage.setItem(
            "users",
            JSON.stringify([String(data.user_id)])
          );
        } else {
          allLoggedInUsers.push(String(data.user_id));
          await AsyncStorage.setItem("users", JSON.stringify(allLoggedInUsers));
        }
        login(values.Email, data.user_id); // Pass user_id to login function
        await UserData(data.user_id);
        await AsyncStorage.setItem("userId", String(data.user_id));
        // Alert.alert("Login successful");
        // Store user id in Redux
        actions.resetForm();
        props.navigation.navigate("BottomNavigator");

      } else {
        actions.resetForm();
        console.error("Error:", data);
        Alert.alert("Error", "Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground source={Signup} style={styles.background}>
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        >
          <Image source={logo3} style={styles.logo} resizeMode="contain" />

          {loading ? (
            <ActivityIndicator size="large" color="#00E2FF" /> // Show loader while logging in
          ) : (
            <View style={styles.inputContainer_1}>
              <Formik
                validationSchema={reviewSchema}
                initialValues={{ Password: "", Email: "" }}
                onSubmit={handleSubmit}
                validateOnChange={false} // Disable validation on change
                validateOnBlur={false} // Disable validation on blur
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  validateForm, // Access validateForm function
                  setTouched, // Access setTouched function
                }) => (
                  <View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Email or Username"
                        onChangeText={handleChange("Email")}
                        onBlur={handleBlur("Email")}
                        value={values.Email}
                      />

                      <Ionicons
                        name="person-outline"
                        size={21}
                        color="gray"
                        style={styles.lockIcon}
                      />
                    </View>
                    {touched.Email && errors.Email && (
                      <Text style={{ color: "red" }}>{errors.Email}</Text>
                    )}

                    <View style={styles.inputContainer2}>
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={handleChange("Password")}
                        onBlur={handleBlur("Password")}
                        value={values.Password}
                        secureTextEntry={!isPasswordVisible} // Toggle visibility
                      />
                      <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.eyeIconContainer}
                      >
                        <Icon
                          name={isPasswordVisible ? "eye-off" : "eye"}
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="gray"
                        style={styles.lockIcon}
                      />
                    </View>
                    {touched.Password && errors.Password && (
                      <Text style={{ color: "red" }}>{errors.Password}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.btnsign1mn_2}
                      onPress={() => {
                        // Manually trigger validation on button press
                        validateForm().then((validationErrors) => {
                          if (Object.keys(validationErrors).length === 0) {
                            // If there are no errors, proceed with submission
                            handleSubmit();
                          } else {
                            // Otherwise, mark all fields as touched to show errors
                            setTouched({
                              Email: true,
                              Password: true,
                            });
                          }
                        });
                      }}
                    >
                      <Text style={styles.btnsign1}>Sign in</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.frpasstxt}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* {/ Google and Facebook login buttons /} */}
          <View style={styles.webIconmn}>
            {/* <Image source={AppleAuth} style={styles.lockIcon2} />
            <Pressable onPress={HandleFacebookLogin} style={styles.lockIcon3mn}>
              <Image source={facebook1} style={styles.lockIcon4} />
            </Pressable> */}
            <Pressable onPress={HandleGoogleLogin} style={styles.lockIcon3mn}>
              <Image source={search} style={styles.lockIcon3} />
            </Pressable>
          </View>

          <View style={styles.dntfrmn_txts}>
            <Text style={styles.didntantxt}>Didn’t have any account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.siguytxt}>Sign Up here</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
  },
  inputContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: 309,
    marginTop: "6%",
  },
  input: {
    flex: 1,
    height: 56,
    paddingLeft: 40,
  },
  lockIcon: {
    position: "absolute",
    left: 15,
    top: 16,
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  logo: {
    height: 230,
    width: 230,
    marginTop: -70,
  },
  inputContainer_1: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  frpasstxt: {
    color: "white",
    marginTop: 15,
  },
  btnsign1mn_2: {
    backgroundColor: "#00E2FF",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 130,
    borderRadius: 10,
    marginTop: 40,
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
    marginTop: 10,
  },
  webIconmn: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  lockIcon3mn: {
    backgroundColor: "white",
    justifyContent: "center",
    width: 38,
    height: 40,
    alignItems: "center",
    borderRadius: 6,
  },
  lockIcon2: {
    height: 40,
    width: 40,
  },
  lockIcon3: {
    height: 15,
    width: 15,
  },
  lockIcon4: {
    height: 20,
    width: 20,
  },
});
