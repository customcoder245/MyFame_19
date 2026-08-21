import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import { BASE_URL } from "./BaseURL";

const UserData = async (userId) => {
  const state = store.getState();
  const profileData = state.profile.profileData;

  try {
    const response = await fetch(
      `${BASE_URL}/allusers/v1/allUsersData/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: profileData != null ? profileData.id : userId, // Check if profileData exists, otherwise use userId from parameter
        }),
      }
    );
    
    const responseData = await response.json();

    if (response.ok) {
      // console.log("DATAs : ", responseData);
      // Dispatch the action to store all users in Redux
      store.dispatch(setAllUsers(responseData));
      return responseData; // Return the data if needed
    } else {
      console.error("Failed to fetch users data:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default UserData;
