import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import profileSlice from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const UserData = async (id) => {
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
          userid: profileData 
        }), 
      }
    );
    
    const responseData = await response.json();
    
    if (response.ok) {
      // Dispatch the action to store all users in Redux
      console.log("DATAs : ",responseData)
      store.dispatch(setAllUsers(responseData)); // Directly dispatch using store
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

export default UserData;
