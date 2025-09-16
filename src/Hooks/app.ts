import { AppStateStatus } from "react-native";

export const _handleAppStateChange = (
  nextAppState: AppStateStatus,
  appState: React.MutableRefObject<AppStateStatus>
) => {
  if (
    appState.current.match(/inactive|background/) &&
    nextAppState === "active"
  ) {
    console.log("App has come to the foreground!");
  }

  appState.current = nextAppState;
};
