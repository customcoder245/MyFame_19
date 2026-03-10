import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/action";
import { setProfileData } from "../redux/profileSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const userIdRedux = useSelector((state) => state.user.userId); // Get userId from Redux store
  const [userId, setUserId] = useState(userIdRedux); // Initialize userId from Redux
  const dispatch = useDispatch();

  useEffect(() => {
    // Update local state when userId changes in Redux
    setUserId(userIdRedux);
  }, [userIdRedux]);

  const login = async (email, userId) => {
    setUserToken("ujguwe"); // Example token, replace with your actual token logic
    await AsyncStorage.setItem("userToken", "ujguwe");
    await AsyncStorage.setItem("userId", String(userId)); // Store user ID in AsyncStorage
    setUserId(userId); // Set user ID in state
    setLoading(false);
    console.log("Login successful");

    // Dispatch action to Redux store
    dispatch(setUser({ userId }));
  };

  const logout = async () => {
    setUserToken(null);
    setUserId(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    setLoading(true);
    console.log("Logout successful");

    // Dispatch action to Redux store to clear user data
    dispatch(setProfileData(null))
    dispatch(setUser({ userId: null }));
  };

  const isLoggedIn = async () => {
    try {
      let userToken = await AsyncStorage.getItem("userToken");
      let userId = await AsyncStorage.getItem("userId");
      setUserToken(userToken);          
      setUserId(userId ? parseInt(userId) : null); // Parse stored user ID

      // Dispatch action to Redux store
      dispatch(setUser({ userId: userId ? parseInt(userId) : null }));
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, loading, userToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
