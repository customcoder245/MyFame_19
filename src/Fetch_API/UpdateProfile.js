import { Alert } from "react-native";
import store from "../redux/store";
import { BASE_URL } from "./BaseURL";

const UpdateProfile = async (about, instagramLink, imageUri) => {
  try {
    const state = store.getState();
    const profileData = state.profile.profileData;

    const formData = new FormData();
    formData.append("userid", profileData.id); // Replace with actual user ID
    formData.append("firstname", "rohittester"); // Replace with actual first name

    // Append 'about' if provided
    if (about !== undefined) {
      formData.append("about", about);
    }

    // Append Instagram link if provided
    if (instagramLink !== undefined) {
      formData.append("instagram", instagramLink); // Append Instagram link to form data
    }

    // Append 'profile_img' if imageUri is provided
    if (imageUri) {
      const imageName = imageUri.split("/").pop();
      let imageType = "";

      if (imageUri.endsWith(".jpg") || imageUri.endsWith(".jpeg")) {
        imageType = "image/jpeg";
      } else if (imageUri.endsWith(".png")) {
        imageType = "image/png";
      } else {
        throw new Error("Unsupported image type");
      }

      formData.append("profile_img", {
        uri: imageUri,
        name: imageName,
        type: imageType,
      });
    }

    console.log("FormData: ", formData);

    const response = await fetch(
      `${BASE_URL}/updateuserdata/v1/updateUserData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log("Profile update successful:", responseData);
    } else {
      console.error("Profile update failed:", responseData);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    Alert.alert(
      "Error",
      "Failed to update profile. Please check your network connection."
    );
  }
};

export default UpdateProfile;
