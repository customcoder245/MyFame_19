import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";

const LikeVideoPosts = async () => {
  // Get the current state from the Redux store
  const state = store.getState();
  const postSpUserId = state.postSpUserId.postSpUserId;
  const postId = state.postId.postId;
  
  try {

    const response = await fetch(`${BASE_URL}/singlevideolike/v1/singlevideoLikeData/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: postSpUserId,
        videoid: postId,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      // console.log('Video liked successfully:', responseData);
      // Handle successful response, update Redux state or UI as needed
    //   console.log({postId});
    } else {
      console.error('Failed to like video:', responseData);
    }
  } catch (error) {
    console.error('Error liking video:', error);
  } finally {
  }
};

export default LikeVideoPosts;
