import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ITab } from "./Workspace";

export interface LibraryState {
  openTabs: ITab[];
  activeTabIndex: number;
}

const initialState: LibraryState = {
  openTabs: [],
  activeTabIndex: 0,
};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<ITab>) => {
      state.openTabs = [...state.openTabs, action.payload];
      state.activeTabIndex = state.openTabs.length - 1;
    },
    closeTab: (state, action: PayloadAction<ITab>) => {
      state.openTabs = state.openTabs.filter(
        (tab) => tab.name !== action.payload.name
      );
      state.activeTabIndex = state.openTabs.length - 1;
    },
  },
});

export const { openTab, closeTab } = tabsSlice.actions;

export default tabsSlice.reducer;
