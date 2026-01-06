import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface FieldTextInputProps {
  label: string;
  initialValue?: string;
  onChangeText: (text: string) => void;
}

export default function FieldTextInput(props: FieldTextInputProps) {
  return (
    <TextInput
      label={props.label}
      value={props.initialValue || ""}
      onChangeText={props.onChangeText}
      style={styles.input}
      mode="outlined"
    />
  );
}

const styles = StyleSheet.create({
  input: { marginVertical: 8, borderRadius: 12 },
});
