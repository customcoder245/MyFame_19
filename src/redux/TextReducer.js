
const initialTextState = {
    text: '',
  };

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