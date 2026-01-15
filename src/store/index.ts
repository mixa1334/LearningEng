import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { translationListenerMiddleware } from "./listener/translationListeners";
import { learnReducer } from "./slice/learnSlice";
import { practiceReducer } from "./slice/practiceSlice";
import { translationReducer } from "./slice/translationSlice";
import { userDataReducer } from "./slice/userDataSlice";
import { vocabularyReducer } from "./slice/vocabularySlice";

export const store = configureStore({
  reducer: {
    learn: learnReducer,
    practice: practiceReducer,
    userData: userDataReducer,
    vocabulary: vocabularyReducer,
    translation: translationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(translationListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
