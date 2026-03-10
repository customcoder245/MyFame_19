import { BASE_URL } from "./BaseURL";

const GetAdAnalyticsAPI = async (adId, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/ads/v1/getAdAnalytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ad_id: adId,
        user_id: userId,
        include_detailed: true,
      }),
    });

    const json = await response.json();
    if (json?.status === 200) {
      return json.data;
    } else {
      console.log("Error in GetAdAnalyticsAPI:", json);
      throw new Error(json?.message || "Failed to fetch analytics");
    }
  } catch (err) {
    console.log("Network error:", err);
    throw err;
  }
};

export default GetAdAnalyticsAPI;
