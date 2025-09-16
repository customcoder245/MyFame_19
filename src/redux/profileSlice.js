// profileSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileData: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setProfileData, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;
