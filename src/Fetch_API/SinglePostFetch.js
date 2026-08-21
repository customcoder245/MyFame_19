import { BASE_URL } from "./BaseURL";

const SinglePostFetch = async (userId, postId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/mixedcontent/v1/getMixedVideosAndAds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId,
        }),
      }
    );

    const responseData = await response.json();

    console.log("Single Post API:", responseData);

    if (response.ok) {
      return responseData;
    }

    return {
      error: responseData.message,
    };
  } catch (error) {
    console.log(error);

    return {
      error: error.message,
    };
  }
};

export default SinglePostFetch;