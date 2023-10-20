import { createSlice } from "@reduxjs/toolkit";

export interface loginOrRegisterModalState {
  openModal: boolean;
}

const initialState: loginOrRegisterModalState = {
  openModal: false,
};

export const loginOrRegisterModalSlice = createSlice({
  name: "loginOrRegisterModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.openModal = true;
    },
    closeModal: (state) => {
      state.openModal = false;
    },
  },
});

export const { openModal, closeModal } = loginOrRegisterModalSlice.actions;

export default loginOrRegisterModalSlice.reducer;
