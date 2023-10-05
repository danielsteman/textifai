import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const answerStackSlice = createSlice({
  name: "answerStack",
  initialState,
  reducers: {
    pushAnswer: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
    },
    setAnswers: (state, action: PayloadAction<string[]>) => {
      return action.payload;
    },
    replaceLastAnswer: (state, action: PayloadAction<string>) => {
      if (state.length) {
        state[state.length - 1] = action.payload;
      }
    },
  },
});

export const { pushAnswer, setAnswers, replaceLastAnswer } = answerStackSlice.actions;
export default answerStackSlice.reducer;