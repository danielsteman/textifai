import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "../features/DocumentCollection/librarySlice";
import messagesReducer from "../features/Chat/messageStackSlice";
import answersReducer from "../features/Chat/answerStackSlice";
import chatReducer from "../features/Chat/chatSlice";
import pdfReducer from "../features/PdfViewer/pdfSlice";
import tabsSlice from "../features/Workspace/tabsSlice";
import activeProjectReducer from "../features/Workspace/projectSlice";
import loginOrRegisterModalSlice from "../features/Authentication/loginOrRegisterModalSlice";
import questionReducer from "../features/Chat/questionSlice";

export const store = configureStore({
  reducer: {
    library: libraryReducer,
    messages: messagesReducer,
    answers: answersReducer,
    pdf: pdfReducer,
    tabs: tabsSlice,
    chat: chatReducer,
    activeProject: activeProjectReducer,
    loginOrRegisterModal: loginOrRegisterModalSlice,
    sampleQuestions: questionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
