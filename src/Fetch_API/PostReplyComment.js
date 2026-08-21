import { useSelector } from "react-redux";
import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";

const PostReplyComment = async () => {
  // Get the current state from the Redux store
  const state = store.getState();
  const postSpUserId = state.postSpUserId.postSpUserId;
  const postId = state.postId.postId;
  const commentText = state.comment.commentText
//   const commentText = useSelector((state) => state.comment.commentText);
const commentVideoId = state.commentVideoId.videoId
const profileData = state.profile.profileData;
const commentIds =state.commentId.commentId;

//   const commentVideoId = useSelector(state => state.commentVideoId.videoId);

  try {
    const response = await fetch(`${BASE_URL}/videocomments/v1/videoCommentsData/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment_author_id: postSpUserId ,
        videoid: commentVideoId,
        comment_message:commentText,
        parent_comment_id:commentIds
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      // console.log('Comment posted successfully:', responseData);
      // Handle successful response, update Redux state or UI as needed
      //   console.log({postId});
      // console.log("viral" ,commentVideoId)
      return responseData
    } else {
      console.error('Failed to comment:', responseData);
    }
  } catch (error) {
    console.error('Error commenting:', error);
  } finally {
  }
};

export default PostReplyComment;
