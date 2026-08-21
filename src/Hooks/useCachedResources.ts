import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export default function useLoadFonts() {
  const [isFontLoadCompleted, setIsFontLoadCompleted] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          "OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
      } finally {
        setIsFontLoadCompleted(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isFontLoadCompleted;
}
