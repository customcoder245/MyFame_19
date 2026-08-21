// api/RequestWithdrawAPI.js
import { BASE_URL } from "./BaseURL";

const RequestWithdrawAPI = async (influencerId, amount) => {
  try {
    if (!influencerId || !amount) {
      throw new Error("Influencer ID and amount are required");
    }

    const response = await fetch(
      `${BASE_URL}/influencer/v1/requestWithdraw?influencer_id=${influencerId}&amount=${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    
    if (json?.status === 200) {
      return json;
    } else if (json?.status === 400) {
      throw new Error(json.message || "Failed to request withdrawal");
    } else {
      throw new Error(json?.message || "Failed to request withdrawal");
    }
  } catch (err) {
    // console.log("Error in RequestWithdrawAPI:", err);
    throw err;
  }
};

export default RequestWithdrawAPI;