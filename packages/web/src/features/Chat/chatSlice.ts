// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentConversationId: null,
  },
  reducers: {
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
    },
  },
});

export const { setCurrentConversationId } = chatSlice.actions;

export default chatSlice.reducer;
