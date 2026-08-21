// MyFollowerData.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import { setFollowerToggle } from "../redux/action";
import { BASE_URL } from "./BaseURL";

const ItemData = () => {
  const dispatch = useDispatch();
  const followerId = useSelector((state) => state.followerId.followerId); // Fetch followerId from Redux state
  const profileData = useSelector((state) => state.profile.profileData);
  const followerToggle = useSelector((state) => state.followerToggle.followerToggle); // Ensure correct state path


  useEffect(() => {
    const FetchItem = async () => {
        // console.log(profileData.id)
        try {
            const response = await fetch(
              `${BASE_URL}/allusers/v1/allUsersData/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userid: profileData.id,
                }),
              }
            );
        
            const responseData = await response.json();
        
            if (response.ok) {
              // Dispatch the action to store all users in Redux
              // store.dispatch(setAllUsers(responseData)); // Directly dispatch using store
              return responseData; // Return data if needed
            } else {
              console.error("Failed to fetch users data:", responseData);
              return { error: responseData.message || "Failed to fetch users data" };
            }
          } catch (error) {
            console.error("Error fetching users data:", error);
            return { error: "An error occurred. Please try again later." };
          }}

    // Call fetchData whenever profileData.id or followerId changes
    FetchItem();
  }, [profileData.id, followerId, dispatch,followerToggle]);

  return null; // Since this component doesn't render anything, return null or remove this line
};

export default ItemData;
