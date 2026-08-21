import { BASE_URL } from "./BaseURL";

const fetchAdvertiserDashboard = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/ads/v1/advertisor-dashboard/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      return responseData; // Full dashboard data
    } else {
      console.error("Failed to fetch dashboard:", responseData);
      return { error: responseData.message || "Failed to fetch dashboard" };
    }
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default fetchAdvertiserDashboard;
