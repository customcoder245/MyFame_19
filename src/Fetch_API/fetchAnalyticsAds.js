import { setLoading, setError } from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const fetchAnalyticsAds = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const params = new URLSearchParams();
    params.append('user_id', userId);
    
    // ✅ Add the two static parameters
    params.append('ad_creation_domain', 'all_myfame_domain_ads');
    params.append('approval_status', 'approved');

    const url = `${BASE_URL}/ads/v1/getActiveAdsOverall`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Analytics Ads fetched:", data.data);
      return data.data.ads || [];
    } else {
      console.error("Error fetching analytics ads:", data);
      dispatch(setError("Failed to fetch analytics ads"));
      return [];
    }
  } catch (error) {
    console.error("API error:", error);
    dispatch(setError("An error occurred while fetching analytics ads"));
    return [];
  }
};

export default fetchAnalyticsAds;