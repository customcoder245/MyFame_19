import store from "../../redux/store";
import { setAllUsers } from "../../redux/action";
import { BASE_URL } from "../../Fetch_API/BaseURL";

export const NoOfLikesData = async (videoid , userid) => {
  try {
    const response = await fetch(
      `${BASE_URL}/videousers/v1/videoLikeUsers/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoid: videoid 
          ,userid:userid
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      // console.log("DATAs : ", responseData);
      // Optionally, you can dispatch data to the Redux store
      store.dispatch(setAllUsers(responseData));
      return responseData; // Return the data
    } else {
      console.error("Failed to fetch No Of Likes Data:", responseData);
      return { error: responseData.message || "Failed to fetch No Of Likes Data" };
    }
  } catch (error) {
    console.error("Error fetching No Of Likes Data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};
export default NoOfLikesData;
