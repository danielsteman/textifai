import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ITab } from "./Workspace";

export interface LibraryState {
  openTabs: ITab[];
}

const initialState: LibraryState = {
  openTabs: [],
};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<ITab>) => {
      state.openTabs = [...state.openTabs, action.payload];
    },
    closeTab: (state, action: PayloadAction<ITab>) => {
      state.openTabs = state.openTabs.filter(
        (tab) => tab.name !== action.payload.name
      );
    },
  },
});

export const { openTab, closeTab } = tabsSlice.actions;

export default tabsSlice.reducer;
