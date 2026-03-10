// setAdvertiser.js

import { setLoading, setError } from "../redux/profileSlice"; // adjust path as needed
import { BASE_URL } from "./BaseURL"; // your base URL, e.g., "https://myfame.com/wp-json"

const setAdvertiser = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await fetch(
      `${BASE_URL}/user/v1/setAdvertiser/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log("You have become an advertiser");
      // Optionally, dispatch a Redux action here if you want to update state
    } else {
      console.error("Error:", responseData);
      dispatch(setError("Failed to become advertiser"));
    }
  } catch (error) {
    console.error("Error:", error);
    dispatch(setError("An error occurred. Please try again later."));
  }
};

export default setAdvertiser;
