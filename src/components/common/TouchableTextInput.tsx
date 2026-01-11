import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useAppTheme } from "./ThemeProvider";

interface TouchableTextInputProps {
  readonly label: string;
  readonly initialValue?: string;
  readonly onChange: (text: string) => void;
  readonly onBlur?: () => void;
  readonly onPress?: () => void;
}

export default function TouchableTextInput({ label, initialValue, onChange, onBlur, onPress }: TouchableTextInputProps) {
  const theme = useAppTheme();
  const [isActive, setIsActive] = useState(false);

  const handlePress = () => {
    setIsActive(true);
    onPress?.();
  };

  const handleBlur = () => {
    setIsActive(false);
    onBlur?.();
  };

  return (
    <>
      {isActive ? (
        <TextInput
          autoFocus={true}
          label={label}
          value={initialValue || ""}
          onChangeText={onChange}
          style={styles.input}
          mode="outlined"
          textColor={theme.colors.onBackground}
          selectionColor={theme.colors.onBackground}
          cursorColor={theme.colors.onBackground}
          theme={{
            colors: {
              background: theme.colors.background,
              primary: theme.colors.onBackground,
            },
          }}
          onBlur={handleBlur}
        />
      ) : (
        <TouchableOpacity
          style={[styles.editableField, { backgroundColor: theme.colors.secondary }]}
          activeOpacity={0.8}
          onPress={handlePress}
        >
          <View>
            <Text style={[styles.editableLabel, { color: theme.colors.onSecondary }]}>{label}</Text>
            <Text style={[styles.editableValue, { color: theme.colors.onSecondary }]} numberOfLines={1}>
              {initialValue || "Tap to enter"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    borderRadius: 12,
    width: "100%",
  },
  editableField: {
    marginVertical: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: "100%",
  },
  editableLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  editableValue: {
    fontSize: 16,
    fontWeight: "500",
  },
});
