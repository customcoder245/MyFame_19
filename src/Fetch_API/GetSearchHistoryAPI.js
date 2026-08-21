// Fetch_API/GetSearchHistoryAPI.js

import { BASE_URL } from "./BaseURL";

const GetSearchHistoryAPI = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await fetch(
      `${BASE_URL}/activity/v1/search-history?user_id=${userId}`,
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
      throw new Error(json.message || "Invalid user");
    } else {
      throw new Error(json?.message || "Failed to fetch search history");
    }
  } catch (err) {
    console.log("Error in GetSearchHistoryAPI:", err);
    throw err;
  }
};

export default GetSearchHistoryAPI;