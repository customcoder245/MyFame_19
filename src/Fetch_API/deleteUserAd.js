import { setLoading, setError } from "../redux/profileSlice"; // optional if you want loading/error handling
import { BASE_URL } from "./BaseURL";

const deleteUserAd = (userId, adId) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await fetch(`${BASE_URL}/ads/v1/deleteAd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        ad_id: adId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // console.log("Ad deleted successfully:", data);
      return true;
    } else {
      console.error("Error deleting ad:", data);
      dispatch(setError("Failed to delete ad"));
      return false;
    }
  } catch (error) {
    console.error("API error:", error);
    dispatch(setError("An error occurred while deleting ad"));
    return false;
  }
};

export default deleteUserAd;
