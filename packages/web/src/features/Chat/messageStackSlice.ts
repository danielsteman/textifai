import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const messageStackSlice = createSlice({
  name: "messageStack",
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<string>) => {
      return [...state, action.payload];
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      return [...action.payload];
    },
    clearMessages: (state) => {
      return []; 
    },
  },
});

export const { pushMessage, setMessages, clearMessages } = messageStackSlice.actions;
export default messageStackSlice.reducer;
