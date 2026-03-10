import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./BaseURL";
import { setApiResponse } from "../redux/action";
import store from "../redux/store";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const ShowHideAccount = async (userId) => {
    const state = store.getState();
    const authorUserId =state.videoAuthorUserId.authorUserId;

  try {
    const response = await fetch(
        `${BASE_URL}/checkAccountTypeFollower/v1/checkAccountTypeFollower/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            current_user_id: userId,
            follower_id:authorUserId
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
     console.log(responseData , "Successfully switched account")

     dispatch(setApiResponse(responseData));
      return responseData; // Return data if needed
      
    } else {
      console.error("Failed to switch account", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default ShowHideAccount;
