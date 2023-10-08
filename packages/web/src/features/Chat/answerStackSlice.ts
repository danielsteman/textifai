import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const answerStackSlice = createSlice({
  name: "answerStack",
  initialState,
  reducers: {
    pushAnswer: (state, action: PayloadAction<string>) => {
      return [...state, action.payload];
    },
    setAnswers: (state, action: PayloadAction<string[]>) => {
      return [...action.payload];
    },
    replaceLastAnswer: (state, action: PayloadAction<string>) => {
      if (!state.length) return state;
      
      const newState = [...state];
      newState[newState.length - 1] = action.payload;
      return newState;
    },
  },
});

export const { pushAnswer, setAnswers, replaceLastAnswer } = answerStackSlice.actions;
export default answerStackSlice.reducer;
