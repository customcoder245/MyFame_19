// src/hooks/useAppState.js

import { useRef, useState, useEffect } from "react";
import { AppState } from "react-native";

const useAppState = () => {
  const appState = useRef(AppState.currentState); // Store initial app state
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isAppActive, setIsAppActive] = useState(appState.current === "active"); // Track if the app is active

  useEffect(() => {
    // Log the current app state when the component mounts
    console.log(`App is initially in state: ${appState.current}`);

    // Add event listener to detect app state changes
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    // Check if the app is active
    const isActive = nextAppState === "active";

    // Log the new state every time it changes
    console.log(`App has changed to: ${nextAppState}`);

    // Update the state for whether the app is active
    setIsAppActive(isActive);

    // Update the app state reference and the visible app state
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  // Set background color based on whether the app is active or in the background
  const backgroundColor = isAppActive ? 'green' : 'red';

  return { appStateVisible, isAppActive, backgroundColor };
};

export default useAppState;
