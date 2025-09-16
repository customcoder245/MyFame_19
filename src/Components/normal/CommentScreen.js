// CommentScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCommentText , setCommentVideoId} from '../../redux/action';
import PostComments from '../../Fetch_API/PostComments';


const CommentScreen = (props) => {
  const postId = useSelector(state => state.postId.postId);
  const profileData = useSelector(state => state.profile.profileData);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');

  const handleTextInputChange = (text) => {
    setInputText(text);
  };

  const handleSaveComment = () => {
    // Dispatch action to save comment text
    dispatch(setCommentText(inputText));
    setInputText(''); // Clear the input field after saving

    // Dispatch action to store postId in commentVideoId state
    dispatch(setCommentVideoId(postId));
    PostComments()

    // Navigate to another screen (assuming you have set up navigation)
    // props.navigation.navigate("AllUsersData");

 };

  return (
    <View>
      <Text>Post ID: {profileData.id}</Text>
      <Text>Post SP User ID: {postId}</Text>

      <TextInput
        value={inputText}
        onChangeText={handleTextInputChange}
        placeholder="Enter your comment"
        multiline={true}
        style={{ height: 100, borderColor: 'gray', borderWidth: 1, padding: 10 }}
      />
      <Button title="Save Comment" onPress={handleSaveComment} />
    </View>
  );
};

export default CommentScreen;
