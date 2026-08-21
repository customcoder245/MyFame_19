import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import profileSlice from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const NoOfVideoLikesFetch = async () => {
  const state = store.getState();
  const postId = state.postId.postId;


  try {
    const response = await fetch(
      `${BASE_URL}/getsinglevideolike/v1/getsinglevideoLikeData/`,

      // "https://myfame.com/wp-json/allusers/v1/allUsersData/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoid: postId ,
        }), 
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      // Dispatch the action to store all users in Redux
      // store.dispatch(setAllUsers(responseData)); // Directly dispatch using store
      // console.log(responseData)
      // console.log("done again")
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch users data:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default NoOfVideoLikesFetch;
