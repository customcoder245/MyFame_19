import { BASE_URL } from "./BaseURL";

const SetInfluencerApi = async (user_id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/v1/setInfluencer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log("Set Influencer Success:", responseData);
      return responseData; // success response
    } else {
      console.error("Failed to set influencer:", responseData);
      return {
        error: responseData.message || "Failed to set influencer",
      };
    }
  } catch (error) {
    console.error("Error setting influencer:", error);
    return {
      error: "An error occurred. Please try again later.",
    };
  }
};

export default SetInfluencerApi;
