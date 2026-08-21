import { setLoading, setError } from "../redux/profileSlice"; // optional for loading/error handling
import { BASE_URL } from "./BaseURL";

const fetchUserAds = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading()); // optional

    const response = await fetch(`${BASE_URL}/ads/v1/getUserAds?user_id=${userId}`, {
      method: "POST", // GET request because query param is used
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      // console.log("Ads fetched:", data);
      return data.data.ads || [];
    } else {
      console.error("Error fetching ads:", data);
      dispatch(setError("Failed to fetch ads"));
      return [];
    }
  } catch (error) {
    console.error("API error:", error);
    dispatch(setError("An error occurred while fetching ads"));
    return [];
  }
};

export default fetchUserAds;
