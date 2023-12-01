import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PdfState {
  selectedText: string;
  processedText: string;
}

const initialState: PdfState = {
  selectedText: "",
  processedText: "",
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    setSelectedText: (state, action: PayloadAction<string>) => {
      state.selectedText = action.payload;
    },
    setProcessedText: (state, action: PayloadAction<string>) => {
      state.processedText = action.payload;
    },
    clearSelectedText: (state) => {
      state.selectedText = "";
    },
  },
});

export const { setSelectedText, setProcessedText, clearSelectedText } =
  pdfSlice.actions;

export default pdfSlice.reducer;
