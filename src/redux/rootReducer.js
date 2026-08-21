
import { combineReducers } from "redux";
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
  SET_FOLLOWERS_COUNT,
  SET_USER_POSTS,
  SET_POST_ID,
  SET_POST_SP_USER_ID,
  SET_LIKES_DATA_USER_ID,
  SET_TOTAL_LIKES_DATA,
  SET_INSTAGRAM_LINK,
  SET_COMMENT_TEXT ,
  SET_COMMENT_VIDEO_ID  ,
  SET_COMMENT_USER_ID, // Import SET_COMMENT_USER_ID constant
  SET_VIDEO_AUTHOR_USER_ID ,
  SET_COMMENT_ID,
  SET_PROFILE_SCREEN_FOLLOWER_ID  ,
  SET_COMMENT_CURRENT_USER_ID ,
  SET_USER_VIDEO_SCROLL ,
  SET_USER_PROFILE_IMAGE_VIDEO_SCROLL ,
  SET_USERNAME_VIDEO_SCROLL ,
  SET_CURRENT_USER_COMMENT_STATUS ,// Add this line
  SET_API_RESPONSE 
} from "./constants";
import profileReducer from "./profileSlice";
import commentsSlice from "./commentsSlice";

// Initial state for text
const initialTextState = {
  text: "",
};

// Initial state for user
const initialUserState = {
  email: null,
  // other user data can be added here
};

// Initial state for selected image
const initialImageState = {
  selectedImageURI: null,
};

const initialState = {
  // Define initial state for profile data
  username: "",
  about: "",
  profile_img: "",
};

// Initial state for all users
const initialAllUsersState = {
  users: [],
};

const initialFollowerIdState = {
  followerId: null,
};

const initialFollowerToggleState = {
  followerToggle: false, // Ensure this matches your initial state structure
};

const initialFollowingCountState = {
  followingCount: 0,
};

const initialFollowersCountState = {
  followersCount: 0,
};

// Initial state for user posts
const initialUserPostsState = {
  posts: [],
};

// Initial state for postId
const initialPostIdState = {
  postId: null,
};

const initialPostSpUserIdState = {
  postSpUserId: null, // Initial state for postspuserid
};

// Initial state for likes data user id
const initialLikesDataUserIdState = {
  likesData: null,
};

const initialTotalLikesDataState = {
  totalLikes: 0,
};


const initialInstagramLinkState = {
  instagramLink: '',
};


const initialCommentState = {
  commentText: '', // Initial state for comment text
};


const initialCommentVideoIdState = {
  videoId: null,
};


const initialCommentUserIdState = {
  userId: null,
};


const initialVideoAuthorUserIdState = {
  authorUserId: null, // Initial state for video author user id
};


const initialCommentIdState = {
  commentId: null,
};


const initialProfileScreenFollowerIdState = {
  followerId: null, // Initial value can be null or any default number
};


const initialCommentCurrentUserIdState = {
  currentUserId: null,
};


const initialUserVideoScrollState = {
  videoUrl: "", // Initial state for user video scroll
};


const initialUserProfileImageVideoScrollState = {
  url: '', // Initialize as an empty string
};


const initialUsernameVideoScrollState = {
  username: "", // Initial state for username
};  


// Initial state for current user comment status
const initialCurrentUserCommentStatusState = {
  status: null,
};


const initialStatePrivateAccount = {
  responseData: null,
};




const apiReducer = (state = initialStatePrivateAccount, action) => {
  switch (action.type) {
    case SET_API_RESPONSE:
      return {
        ...state,
        responseData: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for text
const textReducer = (state = initialTextState, action) => {
  switch (action.type) {
    case SET_TEXT:
      return {
        ...state,
        text: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for user
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        email: action.payload.email,
        // other user data can be added here
      };
    default:
      return state;
  }
};

const updateProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

// Reducer for selected image URI
const imageReducer = (state = initialImageState, action) => {
  switch (action.type) {
    case SET_SELECTED_IMAGE:
      return {
        ...state,
        selectedImageURI: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for all users
const allUsersReducer = (state = initialAllUsersState, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for followerId
const followerIdReducer = (state = initialFollowerIdState, action) => {
  switch (action.type) {
    case SET_FOLLOWER_ID:
      return {
        ...state,
        followerId: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for follower toggle
const followerToggleReducer = (state = initialFollowerToggleState, action) => {
  switch (action.type) {
    case SET_FOLLOWER_TOGGLE:
      return {
        ...state,
        followerToggle: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for terms of service text
const termsOfServiceReducer = (state = "", action) => {
  switch (action.type) {
    case SET_TERMS_OF_SERVICE_TEXT:
      return action.payload;
    default:
      return state;
  }
};

// Reducer for following count
const followingCountReducer = (state = initialFollowingCountState, action) => {
  switch (action.type) {
    case SET_FOLLOWING_COUNT:
      return {
        ...state,
        followingCount: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for followers count
const followersCountReducer = (state = initialFollowersCountState, action) => {
  switch (action.type) {
    case SET_FOLLOWERS_COUNT:
      return {
        ...state,
        followersCount: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for user posts
const userPostsReducer = (state = initialUserPostsState, action) => {
  switch (action.type) {
    case SET_USER_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for postId
const postIdReducer = (state = initialPostIdState, action) => {
  switch (action.type) {
    case SET_POST_ID:
      return {
        ...state,
        postId: action.payload,
      };
    default:
      return state;
  }
};

const postSpUserIdReducer = (state = initialPostSpUserIdState, action) => {
  switch (action.type) {
    case SET_POST_SP_USER_ID:
      return {
        ...state,
        postSpUserId: action.payload,
      };
    default:
      return state;
  }
};

const likesDataUserIdReducer = (
  state = initialLikesDataUserIdState,
  action
) => {
  switch (action.type) {
    case SET_LIKES_DATA_USER_ID:
      return {
        ...state,
        likesData: action.payload,
      };
    default:
      return state;
  }
};

const totalLikesDataReducer = (state = initialTotalLikesDataState, action) => {
  switch (action.type) {
    case SET_TOTAL_LIKES_DATA:
      return {
        ...state,
        totalLikes: action.payload,
      };
    default:
      return state;
  }
};



const instagramLinkReducer = (state = initialInstagramLinkState, action) => {
  switch (action.type) {
    case SET_INSTAGRAM_LINK:
      return {
        ...state,
        instagramLink: action.payload,
      };
    default:
      return state;
  }
};


export const commentReducer = (state = initialCommentState, action) => {
  switch (action.type) {
    case SET_COMMENT_TEXT:
      return {
        ...state,
        commentText: action.payload,
      };
    default:
      return state;
  }
};


export const commentVideoIdReducer = (state = initialCommentVideoIdState, action) => {
  switch (action.type) {
    case SET_COMMENT_VIDEO_ID:
      return {
        ...state,
        videoId: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for commentUserId
export const commentUserIdReducer = (state = initialCommentUserIdState, action) => {
  switch (action.type) {
    case SET_COMMENT_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for video author user id
const videoAuthorUserIdReducer = (state = initialVideoAuthorUserIdState, action) => {
  switch (action.type) {
    case SET_VIDEO_AUTHOR_USER_ID:
      return {
        ...state,
        authorUserId: action.payload,
      };
    default:
      return state;
  }
};


export const commentIdReducer = (state = initialCommentIdState, action) => {
  switch (action.type) {
    case SET_COMMENT_ID:
      return {
        ...state,
        commentId: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for profile screen follower id
const profileScreenFollowerIdReducer = (state = initialProfileScreenFollowerIdState, action) => {
  switch (action.type) {
    case SET_PROFILE_SCREEN_FOLLOWER_ID:
      return {
        ...state,
        followerId: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for comment current user ID
const commentCurrentUserIdReducer = (state = initialCommentCurrentUserIdState, action) => {
  switch (action.type) {
    case SET_COMMENT_CURRENT_USER_ID:
      return {
        ...state,
        currentUserId: action.payload,
      };
    default:
      return state;
  }
};


// Reducer for user video scroll
const userVideoScrollReducer = (state = initialUserVideoScrollState, action) => {
  switch (action.type) {
    case SET_USER_VIDEO_SCROLL:
      return {
        ...state,
        videoUrl: action.payload,
      };
    default:
      return state;
  }
};


const userProfileImageVideoScrollReducer = (state = initialUserProfileImageVideoScrollState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE_IMAGE_VIDEO_SCROLL:
      return {
        ...state,
        url: action.payload, // Update the URL in the state
      };
    default:
      return state;
  }
};


const usernameVideoScrollReducer = (state = initialUsernameVideoScrollState, action) => {
  switch (action.type) {
    case SET_USERNAME_VIDEO_SCROLL:
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};


const currentUserCommentStatusReducer = (state = initialCurrentUserCommentStatusState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER_COMMENT_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  text: textReducer,
  user: userReducer,
  image: imageReducer, // Include imageReducer in combineReducers
  profile: profileReducer,
  comments:commentsSlice,
  updatedProfile: updateProfileReducer, // Include updateProfileReducer
  allUsers: allUsersReducer, // Include allUsersReducer
  followerId: followerIdReducer, // Include followerIdReducer
  followerToggle: followerToggleReducer,
  termsOfServiceText: termsOfServiceReducer, // Include termsOfServiceReducer
  followingCount: followingCountReducer, // Include followingCountReducer
  followersCount: followersCountReducer, // Include followersCountReducer
  userPosts: userPostsReducer, // Include userPostsReducer
  postId: postIdReducer,
  postSpUserId: postSpUserIdReducer, // Include postSpUserIdReducer
  likesDataUserId: likesDataUserIdReducer, // Add the new reducer here
  totalLikesData: totalLikesDataReducer, // Include totalLikesDataReducer
  instagramLink: instagramLinkReducer,
  comment: commentReducer,
  commentVideoId: commentVideoIdReducer, // Include commentVideoIdReducer
  commentUserId: commentUserIdReducer, // Include commentUserIdReducer in rootReducer
  videoAuthorUserId: videoAuthorUserIdReducer, // Include videoAuthorUserIdReducer in combineReducers
  commentId: commentIdReducer,
  profileScreenFollowerId: profileScreenFollowerIdReducer,
  commentCurrentUserId: commentCurrentUserIdReducer,
  userVideoScroll: userVideoScrollReducer, // Add the new reducer here
  userProfileImageVideoScroll: userProfileImageVideoScrollReducer, // Include new reducer
  usernameVideoScroll: usernameVideoScrollReducer, // Add the new reducer here
  currentUserCommentStatus: currentUserCommentStatusReducer,
  api: apiReducer,
});

export default rootReducer;









