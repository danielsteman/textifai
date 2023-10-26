import { createSlice } from "@reduxjs/toolkit";

export interface loginOrRegisterModalState {
  openSignInModal: boolean;
  openSignUpModal: boolean;
}

const initialState: loginOrRegisterModalState = {
  openSignInModal: false,
  openSignUpModal: false,
};

export const loginOrRegisterModalSlice = createSlice({
  name: "loginOrRegisterModal",
  initialState,
  reducers: {
    openSignInModal: (state) => {
      state.openSignInModal = true;
    },
    closeSignInModal: (state) => {
      state.openSignInModal = false;
    },
    openSignUpModal: (state) => {
      state.openSignUpModal = true;
    },
    closeSignUpModal: (state) => {
      state.openSignUpModal = false;
    },
  },
});

export const {
  openSignInModal,
  closeSignInModal,
  openSignUpModal,
  closeSignUpModal,
} = loginOrRegisterModalSlice.actions;

export default loginOrRegisterModalSlice.reducer;
