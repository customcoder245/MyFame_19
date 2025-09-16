import { BASE_URL } from "./BaseURL";

const FetchAllUserData = async (userId) => {


  try {
    const response = await fetch(
      `https://myfame.com/wp-json/audiovideo/v1/allUsersData/`,
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

export default FetchAllUserData;
