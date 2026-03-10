import store from "../redux/store";
import { setAllUsers } from "../redux/action";
import { setTermsOfServiceText } from "../redux/action";
import { BASE_URL } from "./BaseURL";

const TermsOfServiceApi = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/termsofservice/v1/termsofservice-content/terms-of-service/`,

      // "https://myfame.com/wp-json/termsofservice/v1/termsofservice-content/terms-of-service/",
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
      store.dispatch(setTermsOfServiceText(responseData));
      console.log(responseData)
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

export default TermsOfServiceApi;
