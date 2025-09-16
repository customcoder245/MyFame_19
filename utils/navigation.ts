import React from "react";
import { DrawerActions } from "@react-navigation/native";
import { NavigationContainerRef } from "@react-navigation/native";

type RootParamList = {
  // Define the types of your root navigation screens here
};

export const navigationRef =
  React.createRef<NavigationContainerRef<RootParamList>>();
export const currentNavigationRef =
  React.createRef<NavigationContainerRef<RootParamList>>();

interface NavigationProps {
  screenName: any;
  params?;
  checkAuth?: boolean;
}

export function push({
  screenName,
  params,
  checkAuth = false,
}: NavigationProps) {
  /**
   * Handle the authentication check here
   * Sometime we want to provide some free access to the user
   * without authentication
   * In that scenario, we can pass checkAuth as false
   */
  if (checkAuth) return;
  navigationRef.current?.navigate(screenName, params);
}
export function pop() {
  navigationRef.current?.goBack();
}
export function openDrawer() {
  navigationRef?.current?.dispatch(DrawerActions.openDrawer());
}
export function closeDrawer() {
  navigationRef?.current?.dispatch(DrawerActions.closeDrawer());
}
