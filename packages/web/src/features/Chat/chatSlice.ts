import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentConversationId: null,
    loading: false,
  },
  reducers: {
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCurrentConversationId, setLoading } = chatSlice.actions;

export default chatSlice.reducer;
