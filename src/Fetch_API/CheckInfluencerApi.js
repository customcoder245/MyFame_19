import { BASE_URL } from "./BaseURL";

const CheckInfluencerApi = async (user_id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/v1/checkInfluencer?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();
    console.log("Check Influencer API Response:", responseData);

    if (response.ok) {
      console.log("Check Influencer Success:", responseData);
      return responseData;
    } else {
      console.error("Failed to check influencer:", responseData);
      return {
        status: response.status,
        error: responseData.message || "Failed to check influencer status",
      };
    }
  } catch (error) {
    console.error("Error checking influencer:", error);
    return {
      status: 500,
      error: "An error occurred. Please try again later.",
    };
  }
};

export default CheckInfluencerApi;