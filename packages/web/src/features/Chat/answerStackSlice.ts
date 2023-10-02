import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const answerStackSlice = createSlice({
  name: "answerStack",
  initialState,
  reducers: {
    pushAnswer: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
    },
    popAnswer: (state) => {
      state.pop();
    },
    clearAnswers: (state) => {
      return initialState;
    },
    replaceLastAnswer: (state, action: PayloadAction<string>) => {
      if (state.length) {
        state[state.length - 1] = action.payload;
      }
    },
  },
});

export const { pushAnswer, popAnswer, clearAnswers, replaceLastAnswer } = answerStackSlice.actions;
export default answerStackSlice.reducer;