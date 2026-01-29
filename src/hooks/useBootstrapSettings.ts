import { useAppDispatch } from "@/src/hooks/hooks";
import { loadDailyWordSetThunk } from "@/src/store/slice/learnSlice";
import { reloadPracticeThunk } from "@/src/store/slice/practiceSlice";
import { initTranslationThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import { AppDispatch } from "@/src/store/types";
import * as Audio from "expo-audio";
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";
type BootstrapStatus = "idle" | "pending" | "success" | "error";

let settingsStatus: BootstrapStatus = "idle";
let settingsPromise: Promise<void> | null = null;
let settingsError: unknown;

function loadSettingsOnce(dispatch: AppDispatch) {
  if (!settingsPromise) {
    settingsStatus = "pending";
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    settingsPromise = (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentMode: true,
          ...(Platform.OS === 'ios'
            ? { interruptionMode: 'mixWithOthers' }
            : { interruptionModeAndroid: 'duckOthers' }),
        });
        await dispatch(loadUserDataThunk()).unwrap();
        await dispatch(loadDailyWordSetThunk()).unwrap();
        await dispatch(initTranslationThunk()).unwrap();
        await dispatch(initalizeVocabularyThunk()).unwrap();
        await dispatch(reloadPracticeThunk()).unwrap();

        settingsStatus = "success";
      } catch (error) {
        settingsStatus = "error";
        settingsError = error;
        console.error("Bootstrap failed:", error);
        throw error;
      }
    })();
  }

  return settingsPromise;
}

export function useBootstrapSettings() {
  const dispatch = useAppDispatch();

  if (settingsStatus === "success") return;

  if (settingsStatus === "error") throw settingsError;

  throw loadSettingsOnce(dispatch);
}
