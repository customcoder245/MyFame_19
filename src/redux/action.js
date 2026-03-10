
import {
  SET_TEXT,
  SET_USER,
  SET_SELECTED_IMAGE,
  UPDATE_PROFILE,
  SET_ALL_USERS,
  SET_FOLLOWER_ID,
  SET_FOLLOWER_TOGGLE,
  SET_TERMS_OF_SERVICE_TEXT,
  SET_FOLLOWING_COUNT,
   SET_FOLLOWERS_COUNT ,
   SET_USER_POSTS ,
   SET_POST_ID ,
   SET_POST_SP_USER_ID ,
   SET_LIKES_DATA_USER_ID ,
   SET_TOTAL_LIKES_DATA ,
   SET_INSTAGRAM_LINK ,
   SET_COMMENT_TEXT ,
   SET_COMMENT_VIDEO_ID  ,
   LIKE_INCREMENT ,
   SET_VIDEO_AUTHOR_USER_ID  ,
   SET_COMMENT_ID ,
   SET_PROFILE_SCREEN_FOLLOWER_ID  ,
   SET_COMMENT_CURRENT_USER_ID ,
   SET_USER_VIDEO_SCROLL ,
   SET_USER_PROFILE_IMAGE_VIDEO_SCROLL ,
   SET_USERNAME_VIDEO_SCROLL ,
   SET_CURRENT_USER_COMMENT_STATUS ,
   SET_API_RESPONSE 

} from "./constants";

export const updateText = (text) => ({
  type: SET_TEXT,
  payload: text,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setSelectedImage = (uri) => ({
  type: SET_SELECTED_IMAGE,
  payload: uri,
});

export const updateProfile = (updatedProfileData) => ({
  type: UPDATE_PROFILE,
  payload: updatedProfileData,
});

export const setAllUsers = (users) => ({
  type: SET_ALL_USERS,
  payload: users,
});


export const setFollowerId = (id) => ({
  type: SET_FOLLOWER_ID,
  payload: id,
});

export const setFollowerToggle = (value) => ({
  type: SET_FOLLOWER_TOGGLE,
  payload: value,
});


export const setTermsOfServiceText = (text) => ({
  type: SET_TERMS_OF_SERVICE_TEXT,
  payload: text,
});


export const setFollowingCount = (count) => ({
  type: SET_FOLLOWING_COUNT,
  payload: count,
});


export const setFollowersCount = (count) => ({
  type: SET_FOLLOWERS_COUNT,
  payload: count,
});


export const setUserPosts = (posts) => ({
  type: SET_USER_POSTS,
  payload: posts,
});


export const setPostId = (postId) => ({
  type: SET_POST_ID,
  payload: postId,
});

export const setPostSpUserId = (postSpUserId) => ({
  type: SET_POST_SP_USER_ID,
  payload: postSpUserId,
});


export const setLikesDataUserId = (likesData) => ({
  type: SET_LIKES_DATA_USER_ID,
  payload: likesData,
});


export const setTotalLikesData = (likesData) => ({
  type: SET_TOTAL_LIKES_DATA,
  payload: likesData,
});


export const setInstagramLink = (link) => ({
  type: SET_INSTAGRAM_LINK,
  payload: link,
});


export const setCommentText = (text) => ({
  type: SET_COMMENT_TEXT,
  payload: text,
});


export const setCommentVideoId = (videoId) => ({
  type: SET_COMMENT_VIDEO_ID,
  payload: videoId,
});


export const likeIncrement = () => {
  return {
    type: LIKE_INCREMENT,
  };
};


export const setVideoAuthorUserId = (authorUserId) => ({
  type: SET_VIDEO_AUTHOR_USER_ID,
  payload: authorUserId,
});


export const setCommentId = (id) => ({
  type: SET_COMMENT_ID,
  payload: id,
});


export const setProfileScreenFollowerId = (followerId) => ({
  type: SET_PROFILE_SCREEN_FOLLOWER_ID,
  payload: followerId,
});


// Action creator for setting the current user ID for comments
export const setCommentCurrentUserId = (userId) => ({
  type: SET_COMMENT_CURRENT_USER_ID,
  payload: userId,
});


export const setUserVideoScroll = (videoUrl) => ({
  type: SET_USER_VIDEO_SCROLL,
  payload: videoUrl,
});


export const setUserProfileImageVideoScroll = (url) => ({
  type: SET_USER_PROFILE_IMAGE_VIDEO_SCROLL,
  payload: url,
});


export const setUsernameVideoScroll = (username) => ({
  type: SET_USERNAME_VIDEO_SCROLL,
  payload: username,
});



export const setCurrentUserCommentStatus = (status) => ({
  type: SET_CURRENT_USER_COMMENT_STATUS,
  payload: status,
});

export const setApiResponse = (data) => ({
  type: SET_API_RESPONSE,
  payload: data,
});