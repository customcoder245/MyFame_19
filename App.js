import React, { useEffect, useState } from "react";
import AppNavigation from "./src/AppNavigation";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { AuthProvider } from "./src/Context/AuthContext";
import "react-native-url-polyfill/auto";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Settings } from "react-native-fbsdk-next";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, ActivityIndicator } from "react-native";
import * as Linking from 'expo-linking';
import DeviceInfo from "react-native-device-info";

const App = () => {
  const [publishableKey, setPublishableKey] = useState(null);

  const configGoogleSignIn = () => {
    GoogleSignin.configure();
  };
  useEffect(() => {
    configGoogleSignIn({
      webClientId:
        "332741188483-2pu4pmp4pliervmgjmch18c9k5ck9m3c.apps.googleusercontent.com",
    });
    Settings.initializeSDK();

    fetch("https://rofhub.com/wp-json/invite/v1/stripe_api_key")
      .then((res) => res.json())
      .then((data) => setPublishableKey(data.publishable_key))
      .catch((err) => console.error("Stripe key fetch failed:", err));
  }, []);

useEffect(() => {
  const getDeviceName = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    console.log("Device Name:", deviceName);
  };

  getDeviceName();
}, []);

// useEffect(() => {
//   // ✅ App already open — listen for new links
//   const subscription = Linking.addEventListener('url', ({ url }) => {
//     console.log('Deep link received (foreground):', url);
//   });

//   // ✅ App opened cold from deep link
//   Linking.getInitialURL().then((url) => {
//     if (url) {
//       console.log('App opened with URL (cold start):', url);
//     }
//   });

//   return () => subscription.remove();
// }, []);
  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }




  return (
    <Provider store={store}>
      <AuthProvider>
        <StripeProvider publishableKey={publishableKey}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <SafeAreaProvider>
              <AppNavigation />
              <Toast topOffset={20} />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </StripeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;




// import react from 'react';
// import { View, Button } from 'react-native';
// import analytics from '@react-native-firebase/analytics';

// export default function App() {
//   return (
//     <View>
//       <Button
//         title="Login"
//         onPress = {async () =>
//           await analytics().logEvent('login', {
//             method: 'email'
//           })
//         }
//       />
//     </View>
//   );
// }