// reducer.js
import { SET_USER } from "./constants";

const initialState = {
  email: null,
  // other user data can be added here
};

const userReducer = (state = initialState, action) => {


  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
