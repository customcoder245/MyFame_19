// fetchProfileData.js

import { setProfileData , setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import { BASE_URL } from "./BaseURL";

const fetchProfileData = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await fetch(
      `${BASE_URL}/getuserdata/v1/getUserData/`,

      // "https://myfame.com/wp-json/getuserdata/v1/getUserData/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
        }),      
      } 
    );

    const responseData = await response.json();

    if (response.ok) {
      // console.log(responseData)
      dispatch(setProfileData(responseData.data));
      //dispatch is a  method used to send action to the reux store and dispatch is te only way to change the state of the redux store .
    } else {
      console.error("Error:", responseData);
      dispatch(setError("Failed to fetch profile data"));
    }
  } catch (error) {
    console.error("Error:", error);
    dispatch(setError("An error occurred. Please try again later."));
  }
};

export default fetchProfileData;
