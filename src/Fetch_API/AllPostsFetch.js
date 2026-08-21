import { useContext } from "react";
import { store } from "../redux/store";
import { BASE_URL } from "./BaseURL";
import { AuthContext } from "../Context/AuthContext";

const AllPostsFetch = async (userId,watch_type='everyone',post_type='videos') => {


  try {
    const response = await fetch(
      `${BASE_URL}/fetchvideos/v1/fetchVideosData/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          watch_type,
          post_type
          // userid:59,
        }),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log("Post fetch data : ",responseData);
     
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch users data is:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users data:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default AllPostsFetch;
