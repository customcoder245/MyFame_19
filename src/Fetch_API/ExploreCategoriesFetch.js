import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import { setTermsOfServiceText } from "../redux/action";
import { BASE_URL } from "./BaseURL";

const ExploreCategoriesFetch = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/videoscategories/v1/videosCategoriesData/`,

      // "https://myfame.com/wp-json/opensource/v1/opensource-content/open-source-software-notices/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      // Dispatch the action to store all users in Redux
      console.log(responseData)
      return responseData; // Return data if needed
    } else {
      console.error("Failed to fetch users data:", responseData);
      return { error: responseData.message || "Failed to fetch users data" };
    }
  } catch (error) {
    console.error("Error fetching users dddddata:", error);
    return { error: "An error occurred. Please try again later." };
  }
};

export default ExploreCategoriesFetch;
