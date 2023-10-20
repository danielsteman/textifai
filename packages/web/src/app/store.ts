import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "../features/DocumentCollection/librarySlice";
import messagesReducer from "../features/Chat/messageStackSlice";
import answersReducer from "../features/Chat/answerStackSlice";
import pdfReducer from "../features/PdfViewer/pdfSlice";
import tabsSlice from "../features/Workspace/tabsSlice";
import loginOrRegisterModalSlice from "../features/Authentication/loginOrRegisterModalSlice";

export const store = configureStore({
  reducer: {
    library: libraryReducer,
    messages: messagesReducer,
    answers: answersReducer,
    pdf: pdfReducer,
    tabs: tabsSlice,
    loginOrRegisterModal: loginOrRegisterModalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
