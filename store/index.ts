import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { learnReducer } from "./slice/learnSlice";
import { statisticsReducer } from "./slice/statisticsSlice";
import { vocabularyReducer } from "./slice/vocabularySlice";

export const store = configureStore({
  reducer: {
    learn: learnReducer,
    statistics: statisticsReducer,
    vocabulary: vocabularyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
