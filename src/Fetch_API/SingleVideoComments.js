import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import profileSlice from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const SingleVideoComments = async (postId) => {
  const state = store.getState();
  const commentVideoId = state.commentVideoId.videoId
  const commentCurrentUserId =  state.commentCurrentUserId.currentUserId;

  try {
    const response = await fetch(
      `${BASE_URL}/fetchsinglevideocomment/v1/fetchsinglevideoCommentData/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoid: commentVideoId ,
          current_user_id:commentCurrentUserId,
        }), 
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      // Dispatch the action to store all users in Redux
      // store.dispatch(setAllUsers(responseData)); // Directly dispatch using store
      // console.log(responseData)
      // console.log("hell owrold")
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch comments data:", responseData);
      return { error: responseData.message || "Failed to fetch comments data" };
    }
  } catch (error) {
    console.error("Error fetching comments data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default SingleVideoComments;
