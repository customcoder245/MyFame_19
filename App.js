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

const App = () => {
  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      scopes:["email"]
    });
  };
  useEffect(() => {
    configGoogleSignIn();
    Settings.initializeSDK();
  }, []);
  return (
    <Provider store={store}>   
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <SafeAreaProvider>
            <AppNavigation />
            <Toast topOffset={20} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
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