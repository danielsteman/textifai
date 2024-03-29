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
      const index = state.openTabs.findIndex(
        (tab) => tab.name === action.payload.name
      );
      if (index === -1) {
        state.openTabs = [...state.openTabs, action.payload];
        state.activeTabIndex = state.openTabs.length - 1;
      } else {
        state.activeTabIndex = index;
      }
    },
    closeTab: (state, action: PayloadAction<ITab>) => {
      state.openTabs =
        state.openTabs.length > 1
          ? state.openTabs.filter((tab) => tab.name !== action.payload.name)
          : state.openTabs;
      state.activeTabIndex = state.openTabs.length - 1;
    },
    activateTab: (state, action: PayloadAction<ITab>) => {
      state.activeTabIndex = state.openTabs.findIndex(
        (tab) => tab.name === action.payload.name
      );
    },
    addTab: (state, action: PayloadAction<ITab>) => {
      const index = state.openTabs.findIndex(
        (tab) => tab.name === action.payload.name
      );
      if (index === -1) {
        state.openTabs = [...state.openTabs, action.payload];
      }
    },
    closeChatSupport: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload
          ? { ...tab, ["openChatSupport"]: false }
          : tab
      );
    },
    closeMiniLibrary: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload
          ? { ...tab, ["openMiniLibrary"]: false }
          : tab
      );
    },
    closePdfViewer: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload ? { ...tab, ["openPdfViewer"]: false } : tab
      );
    },
    openChatSupport: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload
          ? { ...tab, ["openChatSupport"]: true }
          : tab
      );
    },
    openMiniLibrary: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload
          ? { ...tab, ["openMiniLibrary"]: true }
          : tab
      );
    },
    openPdfViewer: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.map((tab: ITab) =>
        tab.name === action.payload ? { ...tab, ["openPdfViewer"]: true } : tab
      );
    },
  },
});

export const {
  openTab,
  closeTab,
  activateTab,
  addTab,
  closeChatSupport,
  closeMiniLibrary,
  closePdfViewer,
  openChatSupport,
  openMiniLibrary,
  openPdfViewer,
} = tabsSlice.actions;

export default tabsSlice.reducer;
