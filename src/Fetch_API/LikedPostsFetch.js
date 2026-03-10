import { useContext } from "react";
import { store } from "../redux/store";
import { BASE_URL } from "./BaseURL";
import { AuthContext } from "../Context/AuthContext";

const LikedPostsFetch = async (userId) => {


  try {
    const response = await fetch(
      `${BASE_URL}/fetchlikedvideos/v1/Fetchlikedvideos/`,
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
      // console.log("Post fetch data : ",responseData);
     
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch users data:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default LikedPostsFetch;
