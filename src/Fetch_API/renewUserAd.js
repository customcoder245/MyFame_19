// renewUserAd.js
import { setLoading, setError } from "../redux/profileSlice"; // optional for loading/error handling
import { BASE_URL } from "./BaseURL";

const renewUserAd = (userId, adId) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await fetch(`${BASE_URL}/ads/v1/renewAd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        ad_id: adId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Renew Ad response:", data);
      return {
        success: true,
        message: data?.message || "Ad renewed successfully",
        data,
      };
    } else {
      console.error("Error renewing ad:", data);
      dispatch(setError(data?.message || "Failed to renew ad"));
      return {
        success: false,
        message: data?.message || "Failed to renew ad",
      };
    }
  } catch (error) {
    console.error("API error (renewUserAd):", error);
    dispatch(setError("An error occurred while renewing the ad"));
    return {
      success: false,
      message: "An error occurred while renewing the ad",
    };
  }
};

export default renewUserAd;
