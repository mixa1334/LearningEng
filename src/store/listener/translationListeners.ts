import * as TranslationService from "@/src/service/translationService";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearTranslationsAction, removeTranslationAction } from "../slice/translationSlice";

export const translationListenerMiddleware = createListenerMiddleware();

translationListenerMiddleware.startListening({
  actionCreator: removeTranslationAction,
  effect: (action) => {
    const id = action.payload;
    TranslationService.removeTranslation(id);
  },
});

translationListenerMiddleware.startListening({
  actionCreator: clearTranslationsAction,
  effect: () => {
    TranslationService.clearTranslations();
  },
});
