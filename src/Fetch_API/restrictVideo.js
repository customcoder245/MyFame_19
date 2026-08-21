import { BASE_URL } from "./BaseURL";

const RestrictedVideo = async (current_user_id , videoID ) => {
  try {
    const formdata = new FormData();
    formdata.append("current_user_id", current_user_id);
    formdata.append("video_id", videoID);
    
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    
   const response = await fetch("https://myfame.com/wp-json/restrictvideo/v1/restrictvideo", requestOptions)

   
    const responseData = await response.json()

    if (response.ok) {
      // console.log(responseData) ; // Return the fetched data
    } else {
      console.error("Failed to block user:", responseData);
      return { error: responseData.message || "Failed to fetch videos" };
    }
  } catch (error) {
    console.error("Error blocking user:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default RestrictedVideo;
