// Fetch_API/SaveWatchHistoryAPI.js

import { BASE_URL } from "./BaseURL";

const SaveWatchHistoryAPI = async (userId, postId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!postId) {
      throw new Error("Post ID is required");
    }

    const response = await fetch(
      `${BASE_URL}/activity/v1/watch-history`,
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
          post_id: postId,
        }),
      }
    );

    const json = await response.json();

    if (json?.status === 200) {
      return json;
    }

    throw new Error(json?.message || "Failed to save watch history");
  } catch (err) {
    console.log("Error in SaveWatchHistoryAPI:", err);
    throw err;
  }
};

export default SaveWatchHistoryAPI;