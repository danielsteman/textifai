import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PdfState {
  selectedText: string;
}

const initialState: PdfState = {
  selectedText: ""
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    setSelectedText: (state, action: PayloadAction<string>) => {
      state.selectedText = action.payload;
    },
    clearSelectedText: (state) => {
      state.selectedText = "";
    }
  }
});

export const { setSelectedText, clearSelectedText } = pdfSlice.actions;

export default pdfSlice.reducer;
