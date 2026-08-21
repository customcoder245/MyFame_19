import React, { useState , useCallback, useContext } from "react";
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
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";

import { Signup } from "../../assets2/Images/allImages";
import {
  search,
  mail,
  logo3,
  AppleAuth,
  LockIcon5,
  facebook1,
  vector,
} from "../../assets2/Icons/allIcons";
import { BASE_URL } from "../../Fetch_API/BaseURL";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, AuthenticationToken, LoginManager, Profile } from "react-native-fbsdk-next";
import Icon from 'react-native-vector-icons/Feather'; // Importing Feather icons
import debounce from 'lodash.debounce';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserData from "../../Fetch_API/UsersData";
import fetchProfileData from "../../Fetch_API/fetchProfileData";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/action";
import { AuthContext } from "../../Context/AuthContext";
import { setError, setProfileData } from "../../redux/profileSlice";

const reviewSchema = yup.object({
  Password: yup
    .string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character"),
  Email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  Name: yup.string().required("Name is required"),
});

export default function SignUp(props) {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);


  const fetchData = async(userId) =>{
    // console.log(userId)
    // try {
    //   const response = await fetch(
    //     `${BASE_URL}/getuserdata/v1/getUserData/`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         userid: userId,
    //       }),      
    //     } 
    //   );
  
    //   const responseData = await response.json();
  
    //   if (response.ok) {
        
    //     dispatch(setProfileData(responseData.data));
    //     //dispatch is a  method used to send action to the reux store and dispatch is te only way to change the state of the redux store .
    //   } else {
    //     console.error("Error:", responseData);
    //     dispatch(setError("Failed to fetch profile data"));
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   dispatch(setError("An error occurred. Please try again later."));
    // }
  
  }

  const HandleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
    
      const response = await fetch(
        `${BASE_URL}/signupwithgoogle/v1/signUpWithGoogle/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: res.user.name,
            user_email: res.user.email,
          }),
        }
      );

      const data = await response.json();
      if(data.message !== "User email exists."){
        login(res.user.email,data.user_id)     
        await UserData(data.user_id);
        await AsyncStorage.setItem("userId", String(data.user_id)); // Store user id in AsyncStorage
        fetchData(data.user_id);
        dispatch(setUser(data.user_id));
        await GoogleSignin.signOut();
    navigation.navigate("BottomNavigator");
      }
      else{
        Alert.alert('Error', data.message);
        await GoogleSignin.signOut();
      }
      
        

      // // Alert.alert('Error', data.message);
      // // navigation.goBack();
    } catch (error) {
      // console.log("EROR : ", error);
    } finally {
      setLoading(false);
    }
  };


  
  const handleSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/registration/v1/RegisterUser/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.Name,
            password: values.Password,
            email: values.Email,
          }),
        }
      );
      const data = await response.json();
      // console.log(data);
      actions.resetForm();
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const HandleFacebookLogin = async () => {
    try {
      setLoading(true);
      const result = await LoginManager.logInWithPermissions(
        ['email'],
      );

      if (Platform.OS === 'ios') {
        const result = await AuthenticationToken.getAuthenticationTokenIOS();
        // console.log(result?.authenticationToken);
      } else {
        const result = await AccessToken.getCurrentAccessToken();
        const profile = await Profile.getCurrentProfile()
      
        const response = await fetch(
          `${BASE_URL}/signupwithfacebook/v1/signUpWithFacebook/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: result.userID,
              username : profile.name
            }),
          }
        );
        const data = await response.json();
        if(response.ok){
          login('res.user.email',data.user_id)     
          await UserData(data.user_id);
          await AsyncStorage.setItem("userId", String(data.user_id)); // Store user id in AsyncStorage
          fetchData(data.user_id);
          dispatch(setUser(data.user_id));
        }
        else{
          Alert.alert("Error",data.message)
        }
        // console.log("DATA IS : ",data)
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };




  // Function to check if the username exists
  const checkUsername = useCallback(async (text) => {
    if (!text) {
      setMessage('');
      setButtonDisabled(false);
      return;
    }

    setLoadingUsername(true); // Show loading indicator when checking username

  
    try {
      const response = await fetch('https://myfame.com/wp-json/checkUsernameExist/v1/checkUsernameExist/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: text }),
      });
  
      const data = await response.json();
  
      if (data.status === false) {
        setMessage('Username is already taken.');
        setButtonDisabled(true);
      } else if (data.status === true) {
        setMessage('');
        setButtonDisabled(false);
      } else {
        setMessage('Unexpected response from the server.');
        setButtonDisabled(true);
      }
    } catch (error) {
      // console.log('Network or server error:', error);
      setButtonDisabled(true);
    }
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground source={Signup} style={styles.background}>
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        >
          <Image source={logo3} style={styles.logo} resizeMode="contain" />
          
          {loading ? (
            <ActivityIndicator size="large" color="#00E2FF" />
          ) : (
            <View style={styles.inputContainer_1}>
<Formik
  validationSchema={reviewSchema}
  initialValues={{ Email: "", Name: "", Password: "" }}
  onSubmit={handleSubmit}
>
  {({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    submitCount, // Destructure submitCount from Formik props
  }) => (
    <View style={{ marginLeft: "4%" }}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange("Email")}
          onBlur={handleBlur("Email")}
          value={values.Email}
          placeholder="Enter email"
         
        />
        <Ionicons name="mail-outline" size={21} color="gray" style={styles.lockIcon} />
      </View>
      {submitCount > 0 && errors.Email && (
        <Text style={{ color: "red", fontSize: 10 }}>
          {errors.Email}
        </Text>
      )}

      <View style={styles.inputContainer2}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            checkUsername(text); // Check username availability on text change
            handleChange("Name")(text);
          }}
          onBlur={handleBlur("Name")}
          value={values.Name}
          placeholder="Enter username"
        />
        <Ionicons name="person-outline" size={21} color="gray" style={styles.lockIcon} />
      </View>
      {submitCount > 0 && errors.Name && (
        <Text style={{ color: "red", fontSize: 10 }}>
          {errors.Name}
        </Text>
      )}
      {message ? <Text style={{ color: "red", fontSize: 10 }}>{message}</Text> : null}

      <View style={styles.inputContainer2}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange("Password")}
          onBlur={handleBlur("Password")}
          value={values.Password}
          placeholder="Enter password"
          secureTextEntry={!isPasswordVisible} // Toggle visibility
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIconContainer}
        >
          <Icon
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.lockIcon} />
      </View>

                    <Text style={styles.passwordRequirements}>
                 Password must contain: at least one uppercase letter, one lowercase letter, one number, and one special character.
                    </Text>
      <TouchableOpacity
        style={[styles.btnsign1mn_2, { backgroundColor: isButtonDisabled ? '#d3d3d3' : '#00E2FF' }]}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      >
        <Text style={styles.btnsign1}>Sign up</Text>
      </TouchableOpacity>
    </View>
  )}
</Formik>

            </View>
          )}

          <View style={styles.webIconmn}>
            <Image source={AppleAuth} style={styles.lockIcon2} />
            <Pressable onPress={HandleFacebookLogin} style={styles.lockIcon3mn}>
              <Image source={facebook1} style={styles.lockIcon4} />
            </Pressable>
            <Pressable onPress={HandleGoogleSignUp} style={styles.lockIcon3mn}>
              <Image source={search} style={styles.lockIcon3} />
            </Pressable>
          </View>

          <View style={styles.dntfrmn_txts}>
            <Text style={styles.didntantxt}>Didn’t have an account? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("LogInPage")}
            >
              <Text style={styles.siguytxt}>Sign In here</Text>
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
    marginTop: "1.5%",
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
    marginTop: "6.5%",
  },
  input: {
    flex: 1,
    height: 56,
    paddingLeft: 40,
  },
  lockIcon: {
    position: "absolute",
    left: 15,
    top: 15,
    width: 20,
    height: 20,
    resizeMode: "contain",
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
    marginTop: 20,
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
  lockIcon3mn: {
    backgroundColor: "white",
    justifyContent: "center",
    width: 38,
    height: 40,
    alignItems: "center",
    borderRadius: 6,
  },
  webIconmn: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: "13%",
  },
  passwordRequirements: {
    fontSize: 12,
    color: "#7f8c8d",
    maxWidth:"100%",
    fontWeight:"400",
    marginLeft:-30,
    paddingLeft:"10%",
    
  },
});
