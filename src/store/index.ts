import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./listener/appListener";
import initTranslationListeners from "./listener/translationListeners";
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
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

initTranslationListeners();