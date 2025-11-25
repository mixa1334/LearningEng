import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { learnReducer } from "./slice/learnSlice";
import { userStatsReducer } from "./slice/userStatsSlice";

export const store = configureStore({
  reducer: {
    learn: learnReducer,
    stats: userStatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
