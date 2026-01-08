import { Alert } from "react-native";

export default function sendUserImportantConfirmation(title: string, message: string, onConfirm: () => void) {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: "Confirm", style: "destructive", onPress: onConfirm },
  ]);
}
