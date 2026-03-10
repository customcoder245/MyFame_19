// Editprofile.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateText } from "../../redux/action";
// import UpdateProfile from "../../Fetch_API/UpdateProfile";

const EditDemo = () => {
  // const about = useSelector((state) => state.text.text);
  // const dispatch = useDispatch();

  // // Local state to manage the edited text input
  // const [editedAbout, setEditedAbout] = useState(about); // Initialize with current about text from Redux

  // const handleSave = async () => {
  //   // Update the Redux state if necessary
  //   dispatch(updateText(editedAbout));

  //   // Call UpdateProfile function to update the profile
  //   await UpdateProfile(editedAbout);

  //   // Show success message or perform other actions as needed
  //   Alert.alert("Success", "Profile updated successfully!");
  // };

  return (
    <View>
      <Text>Edit Profile</Text>
      {/* <UpdateProfile/> */}
      <TextInput

      />
      <TouchableOpacity>
        <Text>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditDemo;
