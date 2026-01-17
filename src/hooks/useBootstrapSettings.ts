import { AppDispatch, useAppDispatch } from "@/src/store";
import { loadDailyWordSetThunk } from "@/src/store/slice/learnSlice";
import { reloadPracticeThunk } from "@/src/store/slice/practiceSlice";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";
type BootstrapStatus = "idle" | "pending" | "success" | "error";

let settingsStatus: BootstrapStatus = "idle";
let settingsPromise: Promise<void> | null = null;
let settingsError: unknown;

function loadSettingsOnce(dispatch: AppDispatch) {
  if (!settingsPromise) {
    settingsStatus = "pending";
    if(Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    settingsPromise = dispatch(loadUserDataThunk())
      .unwrap()
      .then(() =>
        Promise.all([
          dispatch(loadDailyWordSetThunk()).unwrap(),
          dispatch(loadTranslationsThunk()).unwrap(),
          dispatch(initalizeVocabularyThunk()).unwrap(),
          dispatch(reloadPracticeThunk()).unwrap(),
        ])
      )
      .then(() => {
        settingsStatus = "success";
      })
      .catch((error) => {
        settingsStatus = "error";
        settingsError = error;
        throw error;
      });
  }

  return settingsPromise;
}

export function useBootstrapSettings() {
  const dispatch = useAppDispatch();

  if (settingsStatus === "success") return;

  if (settingsStatus === "error") throw settingsError;

  throw loadSettingsOnce(dispatch);
}
