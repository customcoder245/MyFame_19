// api/BankDetailsAPI.js
import { BASE_URL } from "./BaseURL";

const GetBankDetailsAPI = async (influencerId) => {
  try {
    if (!influencerId) {
      throw new Error("Influencer ID is required");
    }

    const response = await fetch(
      `${BASE_URL}/influencer/v1/getBankDetails?influencer_id=${influencerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    const json = await response.json();
    
    if (json?.status === 200) {
      return json.data;
    } else if (json?.status === 400) {
      throw new Error(json.message || "Invalid influencer");
    } else {
      throw new Error(json?.message || "Failed to fetch bank details");
    }
  } catch (err) {
    console.log("Error in GetBankDetailsAPI:", err);
    throw err;
  }
};

export default GetBankDetailsAPI;