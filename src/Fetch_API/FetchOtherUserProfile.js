import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import profileSlice from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const FetchOtherUserProfile = async () => {
  
    const state = store.getState();
  const profileData = state.profile.profileData;


  const authorUserId =state.videoAuthorUserId.authorUserId;


  try {
    const response = await fetch(
        `${BASE_URL}/getuserdata/v1/getUserData/`,

      // "https://myfame.com/wp-json/allusers/v1/allUsersData/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: authorUserId ,
        }), 
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      // Dispatch the action to store all users in Redux
      // store.dispatch(setAllUsers(responseData)); // Directly dispatch using store
      console.log("Fetched this user profile successfully")
      console.log(responseData)
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch users profile:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users profile:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default FetchOtherUserProfile;
