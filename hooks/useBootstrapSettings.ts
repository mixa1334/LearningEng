import { useDispatch } from "react-redux";

import { AppDispatch } from "@/store";
import { loadStatsThunk } from "@/store/thunk/statistics/loadStatsThunk";

type BootstrapStatus = "idle" | "pending" | "success" | "error";

let settingsStatus: BootstrapStatus = "idle";
let settingsPromise: Promise<void> | null = null;
let settingsError: unknown;

function loadSettingsOnce(dispatch: AppDispatch) {
  if (!settingsPromise) {
    settingsStatus = "pending";
    settingsPromise = dispatch(loadStatsThunk())
      .unwrap()
      .then(
        () => {
          settingsStatus = "success";
        },
        (error) => {
          settingsStatus = "error";
          settingsError = error;
        }
      );
  }

  return settingsPromise;
}

export function useBootstrapSettings() {
  const dispatch = useDispatch<AppDispatch>();

  if (settingsStatus === "success") return;

  if (settingsStatus === "error") throw settingsError;

  throw loadSettingsOnce(dispatch);
}
