import React, { useEffect } from "react";
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

const App = () => {
  const configGoogleSignIn = () => {
    GoogleSignin.configure();
  };
  useEffect(() => {
    configGoogleSignIn({
      webClientId:
        "332741188483-2pu4pmp4pliervmgjmch18c9k5ck9m3c.apps.googleusercontent.com",
    });
    Settings.initializeSDK();
  }, []);

 
  return (
    <Provider store={store}>
      <AuthProvider>
        <StripeProvider
          publishableKey={"pk_test_51SQi8cRJjmNb1l4h9mRQNN8dadNRCaimnpjFplmxniN57zRf3oCvz6zFYy8teWrfVez5vKbHIPHh8W0jFdOyXfLG00A2Y8Q9v6"}
 
        >
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