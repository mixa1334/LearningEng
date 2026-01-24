import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface FieldTextInputProps {
  readonly label: string;
  readonly initialValue?: string;
  readonly onChangeText: (text: string) => void;
}

export default function FieldTextInput({ label, initialValue, onChangeText }: FieldTextInputProps) {
  return (
    <TextInput
      label={label}
      value={initialValue || ""}
      onChangeText={onChangeText}
      style={styles.input}
      mode="outlined"
    />
  );
}

const styles = StyleSheet.create({
  input: { marginVertical: 8, borderRadius: 12 },
});
