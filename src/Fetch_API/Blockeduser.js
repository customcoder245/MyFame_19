import { Header } from "@react-navigation/stack";
import { BASE_URL } from "./BaseURL";

const Blockeduser = async (current_user_id , userid ) => {
  try {
    const formdata = new FormData();
    formdata.append("current_user_id", current_user_id);
    formdata.append("userid", userid);
    
    const requestOptions = {
      method: "POST",
      headers:{"Content-Type":"multipart/form-data"} ,
      body: formdata,
      redirect: "follow"
    };
    
   const response = await fetch("https://myfame.com/wp-json/userblock/v1/userblockapi", requestOptions)

   
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

export default Blockeduser;
