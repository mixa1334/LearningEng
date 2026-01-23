import { Alert } from "react-native";
import { SoundEffect, soundPlayer } from "./soundPlayer";

export function sendUserAlert(message: string) {
  soundPlayer.playEffect(SoundEffect.ACTION_SUCCESS);
  Alert.alert(message);
}

export function sendUserImportantConfirmation(title: string, message: string, onConfirm: () => void) {
  soundPlayer.playEffect(SoundEffect.ALERT_POP_UP);

  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: "Confirm", style: "destructive", onPress: onConfirm },
  ]);
}

export function sendUserError(error: string, onConfirm: () => void) {
  soundPlayer.playEffect(SoundEffect.ALERT_POP_UP);

  Alert.alert("Error", error, [{ text: "OK", style: "default", onPress: onConfirm }]);
}
