import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { userStatsReducer } from "./slice/userStatsSlice";
import { wordsReducer } from "./slice/wordsSlice";

export const store = configureStore({
  reducer: {
    words: wordsReducer,
    stats: userStatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
