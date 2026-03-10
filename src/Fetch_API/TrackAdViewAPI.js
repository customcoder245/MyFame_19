import { BASE_URL } from "./BaseURL";

const TrackAdViewAPI = (ad_id, user_id , whichsite , throughInfluencer) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/ads/v1/trackAdView`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ad_id: ad_id,
        user_id: user_id,
from_which_site:whichsite,
throughInfluencer:throughInfluencer
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Ad view tracked successfully:", data);
        resolve(data);
      })
      .catch((err) => {
        console.log("Error tracking ad view:", err);
        reject(err);
      });
  });
};

export default TrackAdViewAPI;
