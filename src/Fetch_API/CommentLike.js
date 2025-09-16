import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";

const CommentLike = async () => {
  // Get the current state from the Redux store
  const state = store.getState();
  const postSpUserId = state.postSpUserId.postSpUserId;
  const postId = state.postId.postId;
  const commentIds =  state.commentId.commentId;

  try {

    const response = await fetch(`${BASE_URL}/likevideocomment/v1/likevideoCommentData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_user_id: postSpUserId,
        comment_id: commentIds,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Comment liked successfully:', responseData);
      // Handle successful response, update Redux state or UI as needed
    //   console.log({postId});
    } else {
      console.error('Failed to like Comment:');
    }
  } catch (error) {
    console.error(error);
  } finally {
  }
};

export default CommentLike;
