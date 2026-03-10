import { BASE_URL } from "./BaseURL";

const getAdDetails = async (ad_id) => {
  try {
    const response = await fetch(`${BASE_URL}/ads/v1/getAd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ad_id }),
    });

    const responseData = await response.json();

    if (response.ok && responseData.status === 200) {
            console.log(responseData.data)

      return responseData.data; // Return the ad details

    } else {
      console.error("Failed to fetch ad details:", responseData);
      return { error: responseData.message || "Failed to fetch ad details" };
    }
  } catch (error) {
    console.error("Error fetching ad details:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default getAdDetails;
