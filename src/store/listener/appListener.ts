import { createListenerMiddleware, TypedStartListening } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../types";

export const listenerMiddleware = createListenerMiddleware();
export const startAppListening = listenerMiddleware.startListening as TypedStartListening<RootState, AppDispatch>;