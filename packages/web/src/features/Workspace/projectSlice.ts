import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveProjectState {
  projectId: string | null;
  projectName: string | null;
}

const initialState: ActiveProjectState = {
  projectId: null,
  projectName: null,
};

const activeProjectSlice = createSlice({
  name: "activeProject",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    clearActiveProject: (state) => {
      state.projectId = null;
      state.projectName = null;
    }
  },
});

export const {
  setProjectId,
  setProjectName,
  clearActiveProject
} = activeProjectSlice.actions;

export default activeProjectSlice.reducer;
