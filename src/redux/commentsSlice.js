// commentsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsData: [],
  },
  reducers: {
    setComments: (state, action) => {
      state.commentsData = action.payload;
    },
  },
});

export const { setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
