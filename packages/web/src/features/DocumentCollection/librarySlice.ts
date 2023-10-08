import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    initializeSelectedDocuments: (state, action: PayloadAction<string[]>) => {
      state.selectedDocuments = action.payload;
    },
    selectAllDocuments: (state, action: PayloadAction<string[]>) => {
      state.selectedDocuments = action.payload;
    },
    clearAllSelections: (state) => {
      state.selectedDocuments = [];
    },
  },
});

export const {
  enableDocument,
  disableDocument,
  initializeSelectedDocuments,
  selectAllDocuments,  
  clearAllSelections,
} = librarySlice.actions;

export default librarySlice.reducer;
