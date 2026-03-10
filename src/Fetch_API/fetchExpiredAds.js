import { setLoading, setError } from "../redux/profileSlice";
import { BASE_URL } from "./BaseURL";

const fetchExpiredAds = (userId, ad_creation_domain = '') => async (dispatch) => {
  try {
    dispatch(setLoading());

    const params = new URLSearchParams();
    params.append('user_id', userId);
    
    if (ad_creation_domain) {
      params.append('ad_creation_domain', ad_creation_domain);
    }

    const url = `${BASE_URL}/ads/v1/getExpiredAdsOverall`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Expired Ads fetched:", data.data);
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

export default fetchExpiredAds;