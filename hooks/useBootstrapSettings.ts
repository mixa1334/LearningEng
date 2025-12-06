import { AppDispatch, useAppDispatch } from "@/store";
import { loadUserDataThunk } from "@/store/slice/userDataSlice";

type BootstrapStatus = "idle" | "pending" | "success" | "error";

let settingsStatus: BootstrapStatus = "idle";
let settingsPromise: Promise<void> | null = null;
let settingsError: unknown;

function loadSettingsOnce(dispatch: AppDispatch) {
  if (!settingsPromise) {
    settingsStatus = "pending";
    settingsPromise = dispatch(loadUserDataThunk())
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
  const dispatch = useAppDispatch();

  if (settingsStatus === "success") return;

  if (settingsStatus === "error") throw settingsError;

  throw loadSettingsOnce(dispatch);
}
