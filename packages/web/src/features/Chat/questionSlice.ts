import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const questionSlice = createSlice({
  name: "sampleQuestions",
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<string>) => {
      return [...state, action.payload];
    },
    setQuestions: (state, action: PayloadAction<string[]>) => {
      return [...action.payload];
    },
  },
});

export const { addQuestion, setQuestions } = questionSlice.actions;
export default questionSlice.reducer;
