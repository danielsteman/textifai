import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const messageStackSlice = createSlice({
  name: "messageStack",
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
    },
    popMessage: (state) => {
      state.pop();
    },
    clearMessages: (state) => {
      return initialState;
    },
  },
});

export const { pushMessage, popMessage, clearMessages } = messageStackSlice.actions;
export default messageStackSlice.reducer;