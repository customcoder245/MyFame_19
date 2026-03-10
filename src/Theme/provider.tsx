import React, { useEffect, useRef } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

import { theme } from "./colors";
import { ThemeProvider } from "@rneui/themed";
import { _handleAppStateChange } from "@hooks/app";
import { AppState } from "react-native";
import useCachedResources from "@hooks/useCachedResources";
import { APP_VARIANT } from "@env";
import { EAPP_VARIANT } from "@constants/index";

export type ThemeProviderFunction = <P>(
  Component: React.ComponentType
) => React.ComponentType<P>;

/**
 * @description the purpose of this provide is used to wrap the root component with common components
 * @param Component
 * @returns HOC
 */
const queryClient = new QueryClient();
export const provider: ThemeProviderFunction = (Component) => {
  function wrap(props: any): JSX.Element {
    if (APP_VARIANT === EAPP_VARIANT.DEV) {
      // Enable Development environment for check all incomming api response
      useReactQueryDevTools(queryClient);
    }

    const appState = useRef(AppState.currentState);
    const isLoadingComplete = useCachedResources();

    // Listen app state
    useEffect(() => {
      const subscription = AppState.addEventListener("change", (nextAppState) =>
        _handleAppStateChange(nextAppState, appState)
      );
      return () => {
        subscription.remove();
      };
    }, []);

    if (!isLoadingComplete) return <></>;

    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Component {...props} />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }
  return wrap;
};
