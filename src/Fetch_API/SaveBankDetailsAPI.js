// api/SaveBankDetailsAPI.js
import { BASE_URL } from "./BaseURL";

const SaveBankDetailsAPI = async (bankDetails) => {
  try {
    const { influencer_id, bank_account_name, bank_account_number, bank_ifsc, bank_name, bank_upi_id } = bankDetails;

    // Validate required fields
    if (!influencer_id || !bank_account_name || !bank_account_number || !bank_ifsc || !bank_name) {
      throw new Error("All required bank fields must be filled");
    }

    const response = await fetch(
      `${BASE_URL}/influencer/v1/saveBankDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          influencer_id,
          bank_account_name,
          bank_account_number,
          bank_ifsc,
          bank_name,
          bank_upi_id: bank_upi_id || ""
        }),
      }
    );

    const json = await response.json();
    
    if (json?.status === 200) {
      return json;
    } else if (json?.status === 400) {
      throw new Error(json.message || "Failed to save bank details");
    } else {
      throw new Error(json?.message || "Failed to save bank details");
    }
  } catch (err) {
    console.log("Error in SaveBankDetailsAPI:", err);
    throw err;
  }
};

export default SaveBankDetailsAPI;