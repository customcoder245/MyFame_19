import { useSelector } from "react-redux";
import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";

const MyfollowerData2 = async (userId, followerId) => {
  // Get the current state from the Redux store
  const state = store.getState();
  const postSpUserId = state.postSpUserId.postSpUserId;
  const postId = state.postId.postId;
  const commentText = state.comment.commentText
//   const commentText = useSelector((state) => state.comment.commentText);
const commentVideoId = state.commentVideoId.videoId
const profileData = state.profile.profileData;

//   const commentVideoId = useSelector(state => state.commentVideoId.videoId);

  try {
    const response = await fetch(`${BASE_URL}/myfollowers/v1/myFollowersData/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        follower_id: followerId,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Comment posted successfully:', responseData);
      // Handle successful response, update Redux state or UI as needed
    //   console.log({postId});
    console.log("viral" ,commentVideoId)
    } else {
      console.error('Failed to comment:', responseData);
    }
  } catch (error) {
    console.error('Error commenting:', error);
  } finally {
  }
};

export default MyfollowerData2;
