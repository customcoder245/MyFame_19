// 📂 src/api/TrackAdClickAPI.js
import { BASE_URL } from "./BaseURL";

const TrackAdClickAPI = (adId, userId , whichsite , through_influencer) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/ads/v1/trackAdClick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ad_id: adId,
        user_id: userId,
        from_which_site:whichsite,
        through_influencer:through_influencer
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Click tracked successfully:", data);
        resolve(data);
      })
      .catch((err) => {
        console.error("❌ Error tracking ad click:", err);
        reject(err);
      });
  });
};

export default TrackAdClickAPI;
