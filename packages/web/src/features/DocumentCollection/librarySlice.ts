import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LibraryState {
  selectedDocuments: string[];
}

const initialState: LibraryState = {
  selectedDocuments: [],
};

export const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    enableDocument: (state, action: PayloadAction<string>) => {
      state.selectedDocuments = [...state.selectedDocuments, action.payload];
    },
    disableDocument: (state, action: PayloadAction<string>) => {
      state.selectedDocuments = state.selectedDocuments.filter(
        (doc) => doc !== action.payload
      );
    },
  },
});

export const { enableDocument, disableDocument } = librarySlice.actions;

export default librarySlice.reducer;
