import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    currentConversationId: null,
    loading: false,
    extractedText: "",
    processedText: "",
  },
  reducers: {
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setExtractedText: (state, action) => {
      state.extractedText = action.payload;
    },
  },
});

export const { setCurrentConversationId, setLoading, setExtractedText } =
  chatSlice.actions;

export default chatSlice.reducer;
