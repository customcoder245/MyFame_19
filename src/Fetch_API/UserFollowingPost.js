import { store } from "../redux/store";
import { BASE_URL } from "./BaseURL";

const UserFollowingPost = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/videosfollowinglist/v1/videosFollowingListData/`,
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
      console.log(responseData);
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

export default UserFollowingPost;
