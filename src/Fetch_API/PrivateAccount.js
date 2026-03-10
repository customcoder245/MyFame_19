import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./BaseURL";
import { setApiResponse } from "../redux/action";

const PrivateAccount = async (userId) => {


  try {
    const response = await fetch(
        `${BASE_URL}/updateAccountType/v1/updateAccountType/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
     console.log(responseData , "Successfully switched account")


      return responseData; // Return data if needed
      
    } else {
      console.error("Failed to switch account", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default PrivateAccount;
