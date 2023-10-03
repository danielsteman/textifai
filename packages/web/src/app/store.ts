import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "../features/DocumentCollection/librarySlice";
import messagesReducer from "../features/Chat/messageStackSlice";
import answersReducer from "../features/Chat/answerStackSlice";
import pdfReducer from "../features/PdfViewer/pdfSlice";

export const store = configureStore({
  reducer: {
    library: libraryReducer,
    messages: messagesReducer,
    answers: answersReducer,
    pdf: pdfReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
