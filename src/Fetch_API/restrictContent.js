import { BASE_URL } from "./BaseURL";

const restrictContent = async (userid, postid) => {
  const apiUrl = "https://myfame.com/wp-json/reportcontent/v1/reportcontent/";

  const data = {
    userid: userid,
    postid: postid,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      // console.log("Success:", result);
      return result;
    } else {
      // console.error("Failed:", response.status, response.statusText);
      throw new Error("Failed to report content.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};


export default restrictContent;
