import { AnyAction, configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: function (state: any, action: AnyAction) {
    throw new Error("Function not implemented.");
  },
});
