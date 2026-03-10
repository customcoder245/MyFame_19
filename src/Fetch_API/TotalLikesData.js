import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";
import { setTotalLikesData } from "../redux/action";

const TotalLikesData = async () => {
  // Get the current state from the Redux store
  const state = store.getState();
  const profileData = state.profile.profileData;
  const postId = state.postId.postId;
  
  try {

    const response = await fetch(`${BASE_URL}/totallikes/v1/totalLikesData/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: profileData.id,
    
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Total likes on user profile', responseData);
      console.log("done hello")
      // Handle successful response, update Redux state or UI as needed
    //   console.log({postId});
    store.dispatch(setTotalLikesData(responseData.total_counts)); // Adjust according to the structure of responseData


    } else {
      console.error('Failed to get total likes on user profile:', responseData);
    }
  } catch (error) {
    console.error('Error liking video:', error);
  } finally {
  }
};

export default TotalLikesData;
