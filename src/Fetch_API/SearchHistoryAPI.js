// api/SearchHistoryAPI.js

import { BASE_URL } from "./BaseURL";

const SaveSearchHistoryAPI = async (userId, searchTerm) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!searchTerm?.trim()) {
      throw new Error("Search term is required");
    }

    const response = await fetch(
      `${BASE_URL}/activity/v1/search-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          user_id: userId,
          search_term: searchTerm.trim(),
        }),
      }
    );

    const json = await response.json();

    if (json?.status === 200) {
      return json;
    }

    throw new Error(json?.message || "Failed to save search history");
  } catch (err) {
    console.log("SaveSearchHistoryAPI:", err);
    throw err;
  }
};

export default SaveSearchHistoryAPI;