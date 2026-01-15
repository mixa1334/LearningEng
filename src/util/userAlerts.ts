import { Alert } from "react-native";

export function sendUserImportantConfirmation(title: string, message: string, onConfirm: () => void) {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: "Confirm", style: "destructive", onPress: onConfirm },
  ]);
}

export function sendUserError(error: string, onConfirm: () => void) {
  Alert.alert("Error", error, [{ text: "OK", style: "default", onPress: onConfirm }]);
}
