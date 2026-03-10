import { BASE_URL } from "./BaseURL";

const getRandomAd = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ads/v1/getRandomAd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (response.ok && responseData.status === 200) {
      return responseData.data; // Return the ad object
    } else {
      console.error("Failed to fetch ad:", responseData);
      return null; // No ad to show
    }
  } catch (error) {
    console.error("Error fetching ad:", error);
    return null;
  }
};

export default getRandomAd;
