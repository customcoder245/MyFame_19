import { BASE_URL } from "./BaseURL";

const EveryUserPostFetch = async () => {
  try {
    const response = await fetch(`${BASE_URL}/randomallvideos/v1/randomVideosData/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

   
    const responseData = await response.json()

    if (response.ok) {
      return responseData; // Return the fetched data
    } else {
      console.error("Failed to fetch videos:", responseData);
      return { error: responseData.message || "Failed to fetch videos" };
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default EveryUserPostFetch;
